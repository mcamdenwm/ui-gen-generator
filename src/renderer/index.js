import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from "react-tap-event-plugin";
import { Provider } from 'react-redux';

import configureGetComponent from './app/configureGetComponent';
import store, { db } from './app/store';

require('brace/mode/java');
require('brace/theme/github');


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
									type: 'WMGeneric',
									children: [{
										type: 'WMFlatButton',
										props: {
											label: 'Store',
										},
										actions: [{
											propName: 'onClick',
											sequence: [{
												type: 'APPLICATION__SET_MAIN_VIEW',
												path: ['APPLICATION', 'mainView'],
												data: 'store-editor',
											}]
										}],
									}]
								})
							}
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
											}, {
												type: 'APPLICATION__SET_MAIN_VIEW',
												path: ['APPLICATION', 'mainView'],
												data: 'preview',
											}]
										}]
									}, {
										type: 'WMFlatButton',
										props: {
											label: '[AS JSON]'
										},
										actions: [{
											propName: 'onClick',
											sequence: [{
												type: 'APPLICATION__SET_MAIN_VIEW',
												path: ['APPLICATION', 'mainView'],
												data: 'json-editor',
											}]
										}],
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
														path: ['APPLICATION', 'mainView'],
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
														path: ['APPLICATION', 'mainView'],
													},
												}, 'resolve-editor'],
											},
										},
									}],
									children: [{
										type: 'ResolveTreeEditor',
										selectors: [{
											propName: 'editingSelector',
											data: {
												$$WM__resolve: {
													type: 'state',
													path: ['COMPONENT_EDITOR', 'selector', 'selector'],
												},
											},
											toJS: true,
										}, {
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
														type: 'fn',
														name: 'mergeResolveTrees',
														args: [{
															$$WM__resolve: {
																type: 'event',
																index: 0,
															},															
														}, {
															$$WM__resolve: {
																type: 'state',
																path: ['VIEW', 'resolveTrees'],
															},
														}]
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
							{
								getComponent({
									type: 'WMGeneric',
									props: {
										className: 'json-editor',
										key: 'json-editor',
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
														path: ['APPLICATION', 'mainView'],
													},
												}, 'json-editor'],
											},
										},
									}],
									children: [ {
										type: 'AceEditor',
										props: {										
											mode: 'json',
											theme: 'github',
											readOnly: true,
										},
										selectors: [{
											propName: 'value',
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'getUIGenTree',
													args: [{
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW'],
														},
													}, 'json-editor']
												},
											},
										}],
										actions: [{
											propName: 'onChange',
											sequence: [{
												type: 'JSON_EDITOR__UPDATE',
												path: ['JSON_EDITOR', 'value'],
												data: {
													$$WM__resolve: {
														type: 'event',
														index: 0,
													},
												},
											}]
										}],
									} ]
								})
							}
							{
								getComponent({
									type: 'WMGeneric',
									props: {
										className: 'store-editor',
										key: 'store-editor',
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
														path: ['APPLICATION', 'mainView'],
													},
												}, 'store-editor'],
											},
										},
									}],
									children: [ {
										type: 'AceEditor',
										props: {										
											mode: 'json',
											theme: 'github',
										},
										selectors: [{
											propName: 'value',
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'renderStoreAsJson',
													args: [{
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW', 'storeState'],
														},
													}, {
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW', 'storeHandlers'],
														},
													}],
												},
											},
										}],
										actions: [{
											propName: 'onValidate',
											sequence: [{
												type: 'STORE_EDITOR__SET_ANNOTATIONS',
												path: ['STORE_EDITOR', 'annotations'],
												data: {
													$$WM__resolve: {
														type: 'event',
														index: 0,
													},
												}
											}, {
												type: 'STORE_EDITOR__SET_VALID',
												path: ['STORE_EDITOR', 'isValid'],
												data: {
													$$WM__resolve: {
														type: 'fn',
														name: 'not',
														args: [{
															$$WM__resolve: {
																type: 'fn',
																name: 'anyErrors',
																args: [{
																	$$WM__resolve: {
																		type: 'state',
																		path: ['STORE_EDITOR', 'annotations'],
																	},
																}],
															},															
														}],
													},
												},
											}],
										}, {
											propName: 'onChange',
											sequence: [{
												type: 'VIEW__UPDATE_STORE_DATA',
												path: ['VIEW', 'storeState'],
												conditional: {
													$$WM__resolve: {
														type: 'state',
														path: ['STORE_EDITOR', 'isValid'],
													},
												},
												data: {
													$$WM__resolve: {
														type: 'fn',
														name: 'getStoreInitialData',
														args: [{
															$$WM__resolve: {
																type: 'event',
																index: 0,
															},
														}],
													}
												},
											}, {
												type: 'VIEW__UPDATE_STORE_HANDLERS',
												path: ['VIEW', 'storeHandlers'],
												conditional: {
													$$WM__resolve: {
														type: 'state',
														path: ['STORE_EDITOR', 'isValid'],
													},
												},
												data: {
													$$WM__resolve: {
														type: 'fn',
														name: 'getStoreHandlers',
														args: [{
															$$WM__resolve: {
																type: 'event',
																index: 0,
															},
														}],
													}
												},
											}]
										}]
									} ]
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
										propName: 'editingSelector',
										data: {
											$$WM__resolve: {
												type: 'state',
												path: ['COMPONENT_EDITOR', 'selector', 'selector'],
											},
										},
										toJS: true,
									}, {
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
										}, {
											type: 'APPLICATION__SET_MAIN_VIEW',
											path: ['APPLICATION', 'mainView'],
											data: 'resolve-editor',
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
																		propName: '',
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
										}, {
											type: 'APPLICATION__SET_MAIN_VIEW',
											path: ['APPLICATION', 'mainView'],
											data: 'resolve-editor',
										}]
									}, {
										propName: 'onDeleteSelector',
										sequence: [{
											type: 'VIEW__DELETE_SELECTOR',
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
																	name: 'filter',
																	args: [{ 
																		$$WM__resolve: {
																			type: 'fn',
																			name: 'compose',
																			args: [{
																				$$WM__resolve: {
																					type: 'fn',
																					name: 'not',
																				},
																			}, {
																				$$WM__resolve: {
																					type: 'fn',
																					name: 'propEq',
																					args: ['uuid', {
																						$$WM__resolve: {
																							type: 'event',
																							index: 0,
																						},
																					}]
																				},
																			}],
																		},
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
									}, {
										propName: 'onUpdateSelector',
										sequence: [{
											type: 'VIEW__EDIT_SELECTOR',
											path: ['VIEW', 'resolveTrees'],
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'updateSelector',
													args: [{
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW', 'resolveTrees'],
														},
													}, {
														$$WM__resolve: {
															type: 'event',
															index: 0,
														},
													}, {
														$$WM__resolve: {
															type: 'event',
															index: 1,
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
									}, {
										propName: 'onChangeType',
										sequence: [{
											type: 'VIEW__UPDATE_TREE',
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

