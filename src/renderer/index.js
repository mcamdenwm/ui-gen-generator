import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from "react-tap-event-plugin";
import { Provider } from 'react-redux';

import configureGetComponent from './app/configureGetComponent';
import store, { db } from './app/store';

const uuid = require('uuid/v4');

// import editor from './editor';
import preview from './preview';

injectTapEventPlugin();

let state = db.get('state').value();

if (!state) {
	console.log('State not found in DB');
	state = {};
}

// Reset body styles
document.body.style.margin = '0';
document.body.style.padding = '0';

configureGetComponent()
	.then(getComponent => {
		render(
			(
				<Provider store={store}>
					<div style={{
						display: 'flex',
						flexDirection: 'row',
						overflow: 'hidden',
					}}>
						<div className="view-tree" style={{
							width: '15%',
						}}>
							{
								getComponent({
									type: 'ViewTreeRenderer',
									selectors: [{
										propName: 'tree',
										data: {
											$$WM__resolve: {
												type: 'state',
												path: ['VIEW', 'view'],
												toJS: true,
											},
										},
									}]
								})
							}
						</div>
						<div style={{
							width: '70%',
						}}>
							{
								getComponent({
									type: 'WMGeneric',
									props: {
										style: {
											textAlign: 'right'
										},
									},
									children: [{
										type: 'WMFlatButton',
										props: {
											label: '[Preview]'
										},
										actions: [{
											propName: 'onClick',
											sequence: [{
												type: 'COMPONENT_EDITOR__EDIT_SELECTOR',
												path: ['COMPONENT_EDITOR', 'selector'],
												data: null,
											}]
										}]
									}, {
										type: 'WMFlatButton',
										props: {
											label: '[Resolver Editor]'
										}
									}]
								})
							}
							{
								getComponent({
									type: 'WMGeneric',
									props: {
										className: 'preview',
										key: 'preview',
									},
									selectors: [{
										propName: 'style',
										data: {
											$$WM__resolve: {
												type: 'fn',
												name: 'getMainViewStyle',
												args: [{
													$$WM__resolve: {
														type: 'state',
														path: ['COMPONENT_EDITOR', 'selector'],
													},
												}, 'preview'],
											},
										},
									}],
									children: [preview()]
								})
							}
							{
								getComponent({
									type: 'WMGeneric',
									props: {
										className: 'function-editor',
										key: 'resolve-editor',
									},
									selectors: [{
										propName: 'style',
										data: {
											$$WM__resolve: {
												type: 'fn',
												name: 'getMainViewStyle',
												args: [{
													$$WM__resolve: {
														type: 'state',
														path: ['COMPONENT_EDITOR', 'selector'],
													},
												}, 'resolve-editor'],
											},
										},
									}],
									children: [{
										type: 'ResolveTreeEditor',
										selectors: [{
											propName: 'storeState',
											data: {
												$$WM__resolve: {
													type: 'state',
													path: ['VIEW', 'storeState'],
												},
											},
										}, {
											propName: 'resolveTrees',
											data: {
												$$WM__resolve: {
													type: 'state',
													path: ['VIEW', 'resolveTrees'],
												},
											},
											toJS: true,
										}, {
											propName: 'resolveNodes',
											data: {
												$$WM__resolve: {
													type: 'state',
													path: ['VIEW', 'resolveNodes'],
												},
											},
											toJS: true,
										}],
										actions: [{
											propName: 'onMutatedResolveTree',
											sequence: [{
												type: 'VIEW__UPDATE_TREE',
												path: ['VIEW', 'resolveTrees'],
												data: {
													$$WM__resolve: {
														type: 'event',
														index: 0,
													},
												},
											}, {
												type: 'VIEW__UPDATE_POSITIONS',
												path: ['VIEW', 'resolveNodes'],
												data: {
													$$WM__resolve: {
														type: 'event',
														index: 1,
													},
												},
											}]
										}, {
											propName: 'onUpdatePositions',
											sequence: [{
												type: 'VIEW__UPDATE_POSITIONS',
												data: {
													$$WM__resolve: {
														type: 'event',
														index: 0,
													},
												},
											}]
										}]
									}]
								})
							}
						</div>
						<div className="props" style={{
							width: '15%',
						}}>
							{
								getComponent({ 
									type: 'ComponentEditor',
									selectors: [{
										propName: 'component',
										data: {
											$$WM__resolve: {
												type: 'fn',
												name: 'getComponentNode',
												args: [{
													$$WM__resolve: {
														type: 'state',
														path: ['COMPONENT_EDITOR', 'component'],
													},
												}, {
													$$WM__resolve: {
														type: 'state',
														path: ['VIEW', 'view']
													},
												}],
											},
										},
									}, {
										propName: 'resolveTrees',
										data: {
											$$WM__resolve: {
												type: 'state',
												path: ['VIEW', 'resolveTrees'],
											},
										},
										toJS: true,
									}],
									actions: [{
										propName: 'onFieldChange',
										sequence: [{
											type: 'COMPONENT_EDITOR__UPDATE_FIELD',
											path: ['VIEW', 'view'],
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'updateComponentNode',
													// (uuid, data, state)
													args: [{
														$$WM__resolve: {
															type: 'state',
															path: ['COMPONENT_EDITOR', 'component'],
														},
													}, {
														$$WM__resolve: {
															type: 'event',
															index: 0,
														},
													}, {
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW', 'view'],
														},
													}],
												},
											},
										}]
									}, {
										propName: 'onEditSelector',
										sequence: [{
											type: 'COMPONENT_EDITOR__EDIT_SELECTOR',
											path: ['COMPONENT_EDITOR', 'selector'],
											data: {
												selector: {
													$$WM__resolve: {
														type: 'event',
														index: 0,
													},
												}
											},
										}],
									}, {
										propName: 'onAddSelector',
										sequence: [{
											type: 'VIEW__ADD_SELECTOR',
											path: ['VIEW', 'newSelectorUuid'],
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'uuid',
													args: [],
												},
											},
										}, {
											type: 'VIEW__ADD_SELECTOR',
											path: ['VIEW', 'resolveTrees'],
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'call',
													args: [{
														$$WM__resolve: {
															type: 'fn',
															name: 'compose',
															args: [{
																$$WM__resolve: {
																	type: 'fn',
																	name: 'jsonStringify',
																}
															}, {
																$$WM__resolve: {
																	type: 'fn',
																	name: 'append',
																	args: [{
																		uuid: {
																			$$WM__resolve: {
																				type: 'state',
																				path: ['VIEW', 'newSelectorUuid'],
																			},
																		},
																		type: 'selector',
																		name: 'selector-',
																		propName: 'label',
																		trees: [],
																		componentUuid: 'fa9481d8-4fda-41f4-87cb-34b6a3083a99',
																	}],
																},
															}, {
																$$WM__resolve: {
																	type: 'fn',
																	name: 'jsonParse',
																},
															}]
														},
													}, {
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW', 'resolveTrees'],
														},
													}],
												},
											},
										}, {
											type: 'COMPONENT_EDITOR__EDIT_SELECTOR',
											path: ['COMPONENT_EDITOR', 'selector'],
											data: {
												selector: {
													$$WM__resolve: {
														type: 'state',
														path: ['VIEW', 'newSelectorUuid'],
													},
												}
											},
										}]
									}],
								})
							}
						</div>
					</div>
				</Provider>
			),
			document.getElementById('app'),
		);
	})

