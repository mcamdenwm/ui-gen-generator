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
					getUIGenTree: (state, forPreview=true) => {
						let { view, resolveTrees } = state.toJS();

						if (resolveTrees) {
							resolveTrees = JSON.parse(resolveTrees);
						}

						// resolveTrees.

						// console.log(resolveTrees);
						
						// walk, writeUIGenTree
						// Merge selectors and actions from tree
						let mutatedTree = walk(view, (node) => {
							let resolveTree = resolveTrees.find(tree => tree.componentUuid === node.uuid);
							let res = {
								...node,
							};

							if (resolveTree) {
								let lastResolveTree = resolveTree.trees[1];
								let mutatedLastResolveTree = walk(lastResolveTree, (tree) => {
									console.log(tree);
									return tree;
								});
								
								res.selectors = [{
									propName: resolveTree.propName,
									data: (resolveTree && resolveTree.trees[1]) || {},
								}];
							}

							return res;
						});

						console.log('mutatedTree', mutatedTree);
						return JSON.stringify(mutatedTree);
					}
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
