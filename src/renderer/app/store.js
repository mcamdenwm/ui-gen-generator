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
    ],
  },
};

const persistState = store => next => action => {
  const result = next(action);
  const state = store.getState();
  
  // @todo needs better name
  // @todo how would this work for multiple views?
  db.set('state.view', state.VIEW.toJS())
    .write();

  return result;
}

const store = generateStore({
  reducers: generateState(storeConfig),
  middlewares: [ persistState ],
});

export {
  store as default,
  db,
}