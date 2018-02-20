import {
	generateStore,
	generateState,
} from '@workmarket/ui-generation';

/**
 * So this will actually need to be a function that generates a store
 */

const storeConfig = {
	FOO: {
		initialState: {
			data: {
				bar: {
					baz: 'Ayeeee',
				}
			},
		},
		handlers: [
			'FOO__DO_SOMETHING',
		],
	},
};

const store = generateStore({
	reducers: generateState(storeConfig),
});

window._previewStore = store;

export default store;