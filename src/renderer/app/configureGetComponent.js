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
import { walk, writeUIGenTree, walkResolve } from '../utils/';

import Immutable, { Map, fromJS, isImmutable } from 'immutable';
import TreeUtils from 'immutable-treeutils';
const uuid = require('uuid/v4');

import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/github';

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
					getStoreInitialData: (storeAsJson) => {
						return JSON.parse(storeAsJson).initialState.data;
					},
					getStoreHandlers: (storeAsJson) => {
						return JSON.parse(storeAsJson).handlers;
					},
					renderStoreAsJson: (storeState, storeHandlers, currentValue) => {
						if (currentValue) {
							return currentValue;
						}
						return JSON.stringify({
							initialState: {
								data: {
									...storeState.toJS(),
								},
							},
							handlers: [].concat(storeHandlers.toJS() || [])
						}, null, 4);
					},
					anyErrors: (annotations) => {
						return !!annotations.filter(a => a.type === 'error').length;
					},
					log: (n) => {
						// console.log(n);
						return n;
					},
					updateComponentNode: (uuid, data, state) => {
						debugger;
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
					getUIGenTree: (state, type) => {
						let { view, resolveTrees, props } = state.toJS();

						if (resolveTrees) {
							resolveTrees = JSON.parse(resolveTrees);
						}

						// walk, writeUIGenTree
						// Merge selectors and actions from tree
						let mutatedTree = walk(view, (node) => {
							const resolveTreesForComponent = resolveTrees.filter(tree => tree.componentUuid === node.uuid);
							let res = {
								...node,
								selectors: [],
							};

							if (resolveTreesForComponent && resolveTreesForComponent.length) {
								resolveTreesForComponent.forEach(rt => {
									let data = rt.trees;

									data = data
										.map(datum => {
											return walkResolve(datum, (node) => {
												// Optimize
												if (node.type === 'state' && node.args) {
													delete node.args;
												}

												if (node.type !== 'state' && node.path) {
													delete node.path;
												}

												// Generate protected path
												// Unless showing to the user
												if (node.type === 'state' && type !== 'json-editor') {
													node.path.unshift('VIEW', 'storeState');
												}

												return node;
											});
										})
									.map(writeUIGenTree);

									if (data.length === 1) {
										data = data[0];
									}
									// @todo we should be able to converge selectors/props/actions into this resolve tree
									res.selectors.push({
										propName: rt.propName,
										data: data || {},										
									});
								});
							}

							if (props && props.length) {
								const propsForNode = props.filter(p => p.componentUuid === node.uuid);
								
								res.props = {};

								propsForNode.forEach(p => {
									res.props[p.propName] = p.value;
								});
							}

							if (!res.selectors.length) {
								delete res.selectors;
							}

							if (res.props && !Object.keys(res.props).length) {
								delete res.props;
							}

							return res;
						});

						console.log('Full UIGen Tree', mutatedTree);
						
						if (type === 'json-editor') {
							return JSON.stringify(mutatedTree, null, 2);
						}

						return JSON.stringify(mutatedTree);
					},
					getMainViewStyle: (activeMainView, view) => {
						let display = 'none';

						if (activeMainView === view) {
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
					jsonStringify: (obj, f, n) => {
						console.log('JSON.stringify', obj);
						return JSON.stringify.apply(null, [obj, f, n]);
					},
					updateSelector: (resolveTreesStr, selectorStr, propName) => {
						const resolveTrees = JSON.parse(resolveTreesStr);
						const selector = JSON.parse(selectorStr);
						const mutResolveTrees = resolveTrees.map(tree => {
							if (tree.uuid === selector.uuid) {
								return {
									...tree,
									propName,
								};
							}

							return tree;
						});

						return JSON.stringify(mutResolveTrees);
					},
					mergeResolveTrees: (updatedResolveTreeStr, resolveTreesStr) => {
						const updatedResolveTreeList = fromJS(JSON.parse(updatedResolveTreeStr));
						const resolveTrees = fromJS(JSON.parse(resolveTreesStr));

						const mutResolveTrees = resolveTrees.map(rt => {
							const update = updatedResolveTreeList.find(u => u.get('uuid') === rt.get('uuid'));
							if (update) {
								return rt.merge(update);
							}
							return rt;
						});

						return JSON.stringify(mutResolveTrees.toJS());
					},
					updateProp: (uuid, update, props) => {
						const updateIndex = props.findIndex(p => p.get('uuid') === uuid);
						return props.update(updateIndex, (p) => p.merge(update));
					},
					addProp: (prop, props) => {
						let mutProps = props;
						if (!isImmutable(mutProps)) {
							mutProps = fromJS(mutProps);
						}

						return mutProps.push(Map(prop));
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
					AceEditor,
				},
			});

			return configuredGetComponent;
		});
	}

	return configuredGetComponent;
};
