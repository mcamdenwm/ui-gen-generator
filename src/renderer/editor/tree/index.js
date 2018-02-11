export default {
	type: 'WMGeneric',
	props: {
		style: {
			width: '50%',
		},
	},
	children: [{
		type: 'WMConfigurableModal',
		selectors: [{
			propName: 'open',
			data: {
				$$WM__resolve: {
					type: 'state',
					path: ['COMPONENT', 'modalVisible'],
				},
			},
		}],
		actions: [{
			propName: 'onClose',
			sequence: [{
				type: 'COMPONENT__EDIT',
				path: ['COMPONENT', 'modalVisible'],
				data: false,
			}, {
				type: 'VIEW__SET_STATE',
				path: ['VIEW', 'children', '0', 'children', '2', 'props', 'primaryText'],
				data: {
					$$WM__resolve: {
						type: 'state',
						path: ['COMPONENT', 'config', 'data', 'props', 'primaryText'],
					},
				}
			}, {
				type: 'VIEW__SET_STATE',
				path: ['VIEW', 'children', '0', 'children', '2', 'props', 'secondaryText'],
				data: {
					$$WM__resolve: {
						type: 'state',
						path: ['COMPONENT', 'config', 'data', 'props', 'secondaryText'],
					},
				}
			}]
		}],
		children: {
			type: 'WMGeneric',
			children: [{
				type: 'WMTextField',
				selectors: [{
					propName: 'value',
					data: {
						$$WM__resolve: {
							type: 'state',
							path: ['COMPONENT', 'config', 'data', 'props', 'primaryText'],
						},
					}
				}],
				props: {
					floatingLabelText: 'props.primaryText',
				},
				actions: [{
					propName: 'onChange',
					sequence: [{
						type: 'COMPONENT__EDIT',
						path: ['COMPONENT', 'config', 'data', 'props', 'primaryText'],
						data: {
							$$WM__resolve: {
								type: 'event',
								index: 1,
							},
						},
					}]
				}],
			}, {
				type: 'WMTextField',
				selectors: [{
					propName: 'value',
					data: {
						$$WM__resolve: {
							type: 'state',
							path: ['COMPONENT', 'config', 'data', 'props', 'secondaryText'],
						},
					}
				}],
				props: {
					floatingLabelText: 'props.secondaryText',
				},
			}],
		},
	}, {
		type: 'Tree',
		actions: [{
			propName: 'onNodeClick',
			sequence: [{
        type: 'COMPONENT_EDITOR__EDIT_COMPONENT',
        path: ['COMPONENT_EDITOR'],
        data: {
        	open: true,
        	component: {
        		$$WM__resolve: {
        			type: 'event',
        			index: 0,
        			path: ['data', 'uuid']
        		},
        	}
        },
			}]
		}],
		selectors: [{
			propName: 'rootNode',
			data: {
				$$WM__resolve: {
					type: 'fn',
					name: 'log',
					args: [{
						$$WM__resolve: {
							type: 'state',
							path: ['VIEW', 'view'],
							toJS: true,
						},
					}] 
				},
			}
		}]
	}],
};
