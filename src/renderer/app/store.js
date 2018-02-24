import {
	generateStore,
	generateState,
} from '@workmarket/ui-generation';

import low from 'lowdb';
import LocalStorageAdapter from 'lowdb/adapters/LocalStorage';
import data from './backup';

const adapter = new LocalStorageAdapter('db');
const db = low(adapter);

let state = db.get('state').value();

if (!state) {
	console.log('State not found in DB');
	state = data || {};
}

const storeConfig = {
	VIEW: {
		initialState: {
			data: {
				...state,
				FOO: {
					bar: {
						baz: 'Ayyyoo',
					},
				},
			},
		},
		handlers: [
			'VIEW__ADD_COMPONENT',
			'VIEW__SET_STATE',
			'VIEW__UPDATE_TREE',
			'VIEW__UPDATE_POSITIONS',
			'VIEW__IGNORE',
			'VIEW__ADD_SELECTOR',
			'VIEW__EDIT_SELECTOR',
			'VIEW__DELETE_SELECTOR',
		],
	},
	COMPONENT: {
		initialState: {
			data: {
				modalVisible: false,
				component: 'fa9481d8-4fda-41f4-87cb-34b6a3083a99',
			},
		},
		handlers: [
			'COMPONENT__EDIT',
			'COMPONENT_DADS',
		],
	},
	COMPONENT_EDITOR: {
		initialState: {
			data: {
				open: false,
				component: 'fa9481d8-4fda-41f4-87cb-34b6a3083a99',
				selector: null,
			},
		},
		handlers: [
			'COMPONENT_EDITOR__EDIT_COMPONENT',
			'COMPONENT_EDITOR__CLOSE',
			'COMPONENT_EDITOR__UPDATE_FIELD',
			'COMPONENT_EDITOR__EDIT_SELECTOR',
			'COMPONENT_EDITOR__ADD_SELECTOR',
		],
	},
};

const persistState = store => next => action => {
	const result = next(action);
	const state = store.getState();
	
	// @todo needs better name
	// @todo how would this work for multiple views?
	if (!state.VIEW.get('initial')) {
		db.set('state', state.VIEW.toJS())
			.write();
		console.log('Persist view to DB ', state.VIEW.toJS());
	}

	return result;
}

const store = generateStore({
	reducers: generateState(storeConfig),
	middlewares: [ persistState ],
});

window._store = store;

export {
	store as default,
	db,
}