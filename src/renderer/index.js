import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from "react-tap-event-plugin";
import { Provider } from 'react-redux';

import configureGetComponent from './app/configureGetComponent';
import store, { db } from './app/store';

require('brace/mode/java');
require('brace/theme/github');
require('material-design-icons/iconFont/material-icons.css');

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
									}, {
										propName: 'selected',
										data: {
											$$WM__resolve: {
												type: 'state',
												path: ['COMPONENT_EDITOR', 'component']
											},
										},
									}],
									actions: [{
										propName: 'onSelectComponent',
										sequence: [{
											type: 'COMPONENT_EDITOR__EDIT_COMPONENT',
											path: ['COMPONENT_EDITOR', 'component'],
											data: {
												$$WM__resolve: {
													type: 'event',
													index: 0,
												},
											}
										}]
									}, {
										propName: 'onAddChild',
										sequence: [{
											type: 'VIEW__ADD_COMPONENT',
											path: ['VIEW', 'newComponentUuid'],
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'uuid',
													args: [],
												},
											},
										}, {
											type: 'VIEW__ADD_COMPONENT',
											path: ['VIEW', 'view'],
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'addComponentNode',
													args: [{
														$$WM__resolve: {
															type: 'event',
															index: 0,
															path: ['uuid']
														},
													}, {
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW', 'newComponentUuid'],
														},
													}, {
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW', 'view'],
														},
													}]
												},
											},
										}, {
											type: 'COMPONENT_EDITOR__EDIT_COMPONENT',
											path: ['COMPONENT_EDITOR', 'component'],
											data: {
												$$WM__resolve: {
													type: 'state',
													path: ['VIEW', 'newComponentUuid'],
												},												
											}
										}],
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
									children: [{
										type: 'WMTabs',
										props: {
											tabs: [
												{
													label: 'Preview',
													value: 'preview',
												},
												{
													label: 'Resolve Editor',
													value: 'resolve-editor',
												},
												{
													label: 'Store',
													value: 'store-editor',
												},
												{
													label: 'Output',
													value: 'json-editor',
												},
											]
										},
										selectors: [{
											propName: 'value',
											data: {
												$$WM__resolve: {
													type: "state",
													path: ['APPLICATION', 'mainView'],
												}
											},
										}],
										actions: [{
											propName: 'onChange',
											sequence: [{
												type: 'APPLICATION__SET_LAST_VIEW',
												path: ['APPLICATION', 'lastView'],
												data: {
													$$WM__resolve: {
														type: 'state',
														path: ['APPLICATION', 'mainView'],
													}
												}												
											}, {
												type: 'APPLICATION__SET_MAIN_VIEW',
												path: ['APPLICATION', 'mainView'],
												data: {
													$$WM__resolve: {
														type: 'event',
														index: 0,
													}
												}
											}, {
												conditional: {
													$$WM__resolve: {
														type: 'fn',
														name: 'equals',
														args: [{
															$$WM__resolve: {
																type: 'state',
																path: ['APPLICATION', 'mainView'],
															},
														}, 'preview']
													},
												},
												type: 'COMPONENT_EDITOR__EDIT_SELECTOR',
												path: ['COMPONENT_EDITOR', 'selector'],
												data: null,
											}, {
												conditional: {
													$$WM__resolve: {
														type: 'fn',
														name: 'and',
														args: [{
															$$WM__resolve: {
																type: 'fn',
																name: 'equals',
																args: [{
																	$$WM__resolve: {
																		type: 'state',
																		path: ['APPLICATION', 'lastView'],
																	},
																}, 'store-editor']
															},
														}, {
															$$WM__resolve: {
																type: 'state',
																path: ['STORE_EDITOR', 'isValid'],
															},
														}],
													},
												},
												type: 'VIEW__UPDATE_STORE_DATA',
												path: ['VIEW', 'storeState'],
												data: {
													$$WM__resolve: {
														type: 'fn',
														name: 'getStoreInitialData',
														args: [{
															$$WM__resolve: {
																type: 'state',
																path: ['STORE_EDITOR', 'value'],
															},
														}],
													}
												},
											}, {
												conditional: {
													$$WM__resolve: {
														type: 'fn',
														name: 'and',
														args: [{
															$$WM__resolve: {
																type: 'fn',
																name: 'equals',
																args: [{
																	$$WM__resolve: {
																		type: 'state',
																		path: ['APPLICATION', 'lastView'],
																	},
																}, 'store-editor']
															},
														}, {
															$$WM__resolve: {
																type: 'state',
																path: ['STORE_EDITOR', 'isValid'],
															},
														}],
													},
												},
												type: 'VIEW__UPDATE_STORE_HANDLERS',
												path: ['VIEW', 'storeHandlers'],
												data: {
													$$WM__resolve: {
														type: 'fn',
														name: 'getStoreHandlers',
														args: [{
															$$WM__resolve: {
																type: 'state',
																path: ['STORE_EDITOR', 'value'],
															},
														}],
													}
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
											propName: 'storeHandlers',
											data: {
												$$WM__resolve: {
													type: 'state',
													path: ['VIEW', 'storeHandlers'],
												},
											},
											toJS: true,
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
													}, {
														$$WM__resolve: {
															type: 'state',
															path: ['STORE_EDITOR', 'value'],
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
												type: 'STORE_EDITOR__UPDATE_VALUE',
												path: ['STORE_EDITOR', 'value'],
												conditional: {
													$$WM__resolve: {
														type: 'state',
														path: ['STORE_EDITOR', 'isValid'],
													},
												},
												data: {
													$$WM__resolve: {
														type: 'event',
														index: 0,
													},
												}
											}]
										}]
									} ]
								})
							}
						</div>
						<div className="props" style={{
							width: '15%',
							padding: '0 10px',
						}}>
							{
								getComponent({ 
									type: 'ComponentEditor',
									selectors: [{
										// editing resolve
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
									}, {
										propName: 'viewProps',
										data: {
											$$WM__resolve: {
												type: 'state',
												path: ['VIEW', 'props'],
											},
										}
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
											path: ['VIEW', 'newResolveUuid'],
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
																				path: ['VIEW', 'newResolveUuid'],
																			},
																		},
																		type: {
																			$$WM__resolve: {
																				type: 'event',
																				index: 0,
																			},
																		},
																		propName: '',
																		trees: [],
																		componentUuid: {
																			$$WM__resolve: {
																				type: 'state',
																				path: ['COMPONENT_EDITOR', 'component'],
																			}
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
														path: ['VIEW', 'newResolveUuid'],
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
														path: ['VIEW', 'newResolveUuid'],
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
														path: ['VIEW', 'newResolveUuid'],
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
									}, {
										propName: 'onUpdateProp',
										sequence: [{
											type: 'VIEW__UPDATE_PROP',
											path: ['VIEW', 'props'],
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'updateProp',
													args: [{
														$$WM__resolve: {
															type: 'event',
															index: 0,
														}
													}, {
														$$WM__resolve: {
															type: 'event',
															index: 1,
														},
													}, {
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW', 'props'],
														},
													}]
												},
											},
										}]
									}, {
										propName: 'onAddProp',
										sequence: [{
											type: 'VIEW__ADD_PROP',
											path: ['VIEW', 'newPropUuid'],
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'uuid',
													args: [],
												},
											},
										}, {
											type: 'VIEW__ADD_PROP',
											path: ['VIEW', 'props'],
											data: {
												$$WM__resolve: {
													type: 'fn',
													name: 'addProp',
													args: [{
														uuid: {
															$$WM__resolve: {
																type: 'state',
																path: ['VIEW', 'newPropUuid'],
															}
														},
														componentUuid: {
															$$WM__resolve: {
																type: 'state',
																path: ['COMPONENT_EDITOR', 'component'],
															}
														},
														propName: '',
														value: '',
													}, {
														$$WM__resolve: {
															type: 'state',
															path: ['VIEW', 'props'],															
														},
													}],
												},
											},
										}, {
											type: 'COMPONENT_EDITOR__EDIT_PROP',
											path: ['COMPONENT_EDITOR', 'prop'],
											data: {
												$$WM__resolve: {
													type: 'state',
													path: ['VIEW', 'newPropUuid'],
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

