export default () => ({
	type: 'RenderView',
	selectors: [{
		propName: 'view',
		data: {
			$$WM__resolve: {
				type: 'fn',
				name: 'getUIGenTree',
				args: [{
					$$WM__resolve: {
						type: 'state',
						path: ['VIEW'],
					},					
				}]
			},
		},
	}],
})
