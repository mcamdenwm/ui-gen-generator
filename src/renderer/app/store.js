import {
  generateStore,
  generateState,
} from '@workmarket/ui-generation';

import low from 'lowdb';
import LocalStorageAdapter from 'lowdb/adapters/LocalStorage';

const adapter = new LocalStorageAdapter('db');
const db = low(adapter);

const storeConfig = {
  FOO: {
    initialState: {
      data: {
        bar: 'foobar',
      },
    },
    handlers: [
      'FOO__SET_BAR',
    ],
  },
  VIEW: {
    initialState: {
      data: {
        initial: true,
        uuid: 'my-hello-world',
        type: 'p',
        props: {
          style: {
            color: 'purple',
            padding: '0.25em',
            border: '1px solid purple',
          },
        },
        children: 'Hello World!',
      },
    },
    handlers: [
      'VIEW__ADD_COMPONENT',
      'VIEW__SET_STATE',
    ],
  },
  COMPONENT: {
    initialState: {
      data: {
        modalVisible: false,
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
        component: 'a-b-c',
      },
    },
    handlers: [
      'COMPONENT_EDITOR__EDIT_COMPONENT',
      'COMPONENT_EDITOR__CLOSE',
      'COMPONENT_EDITOR__UPDATE_FIELD',
    ],
  },
};

const persistState = store => next => action => {
  const result = next(action);
  const state = store.getState();
  
  // @todo needs better name
  // @todo how would this work for multiple views?
  if (!state.VIEW.get('initial')) {
    db.set('state.view', state.VIEW.toJS())
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