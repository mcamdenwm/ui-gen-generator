export default (getComponent) => ({
	type: 'RenderView',
	props: {
		getComponent,
	},
	selectors: [{
		propName: 'view',
		data: {
			$$WM__resolve: {
				type: 'state',
				path: ['VIEW', 'view'],
			},
		},
	}],
})
