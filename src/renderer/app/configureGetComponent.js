import {
	configureGetComponent,
} from '@workmarket/ui-generation';
import Swagger from 'swagger-client';
import * as Components from '@workmarket/front-end-components';
import * as Patterns from '@workmarket/front-end-patterns';
import store from './store';
import Json from 'react-json';
import RenderView from './RenderView';
import Tree from './Tree';
import ComponentEditor from '../components/ComponentEditor';
import ViewTreeRenderer from '../components/ViewTreeRenderer';
import ResolveTreeEditor from '../components/ResolveTreeEditor';
import { walk, writeUIGenTree } from '../utils/';

import Immutable, { Map, fromJS } from 'immutable';
import TreeUtils from 'immutable-treeutils';
const uuid = require('uuid/v4');

// Store the local configuration so we don't hit the API again
let configuredGetComponent;

const treeUtils = new TreeUtils(
	null,
	'uuid',
	'children'
);

export default async () => {
	if (!configuredGetComponent) {
		const API_URL = 'http://petstore.swagger.io/v2/swagger.json';

		// Using cookie based auth, so don't pass authentication
		await Swagger(API_URL, {}).then((client) => {
			configuredGetComponent = configureGetComponent({
				api: client,
				functions: {
					log: (n) => {
						// console.log(n);
						return n;
					},
					updateComponentNode: (uuid, data, state) => {
						if (!state || typeof uuid !== 'string') {
							return {};
						}

						const f = state.updateIn(
							treeUtils.byId(state, uuid),
							(node) => node.merge(data),
						);

						return f;
					},
					getComponentNode: (uuid, state) => {
						if (!state || typeof uuid !== 'string') {
							return {};
						}

						const seq = treeUtils.byId(state, uuid);
						if (!seq) {
							console.warn('Seq not found for ', uuid, state);
							return {};
						}

						return state.getIn(seq);
					},
					// getUIGenTree for output, combines live resolve trees and current uigen tree for rendering
					getUIGenTree: (state, forPreview=true) => {
						let { view, resolveTrees } = state.toJS();

						if (resolveTrees) {
							resolveTrees = JSON.parse(resolveTrees);
						}
						
						// walk, writeUIGenTree
						// Merge selectors and actions from tree
						let mutatedTree = walk(view, (node) => {
							let resolveTree = resolveTrees.find(tree => tree.componentUuid === node.uuid);
							let res = {
								...node,
							};

							if (resolveTree && resolveTree.trees.length) {
								let data = resolveTree.trees;
								if (data.length === 1) {
									data = resolveTree.trees[0];
								}

								res.selectors = [{
									propName: resolveTree.propName,
									data: data || {},
								}];
							}

							return res;
						});

						console.log('mutatedTree', mutatedTree);
						return JSON.stringify(mutatedTree);
					},
					getMainViewStyle: (selectorUuid, type) => {
						let display = 'none';

						if (type === 'resolve-editor' && selectorUuid) {
							display = 'block';
						}
						else if (type === 'preview' && !selectorUuid) {
							display = 'block';
						}

						return {
							display: display,
						};
					},
					uuid: () => {
						let u = uuid();
						console.log('New uuid issued', u);
						return u;
					},
					jsonParse: (str) => {
						console.log('JSON.parse, ', str);
						return JSON.parse(str);
					},
					jsonStringify: JSON.stringify,
				},
				store,
				components: {
					...Components,
					...Patterns,
					Json,
					RenderView,
					Tree,
					ComponentEditor,
					ViewTreeRenderer,
					ResolveTreeEditor,
				},
			});

			return configuredGetComponent;
		});
	}

	return configuredGetComponent;
};
