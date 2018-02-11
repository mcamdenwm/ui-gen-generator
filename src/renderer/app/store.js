import {
  generateStore,
  generateState,
} from '@workmarket/ui-generation';

import low from 'lowdb';
import LocalStorageAdapter from 'lowdb/adapters/LocalStorage';

const adapter = new LocalStorageAdapter('db');
const db = low(adapter);

const storeConfig = {
  VIEW: {
    initialState: {
      data: {
        "view": {
          "uuid": "root",
          "type": "WMGeneric",
          "children": [
          {
            "uuid": "a-b-c",
            "type": "WMFlatButton",
            "props": {
              "label": "Click Me"
            }
          }
          ]
        },
        functions: {
          fn1: {
            $$WM__resolve: {
              uuid: '1',
              type: 'fn',
              name: 'map',
              args: [{
                $$WM__resolve: {
                  uuid: '2',
                  type: 'fn',
                  name: 'trim',
                },
              }, {
                $$WM__resolve: {
                  uuid: '3',
                  type: 'fn',
                  name: 'split',
                  args: [',', 'x,y, x, z   ']
                },
              }],
            },
          }
        },
        functionPositions: {
          fn1: [{
            uuid: '1',
            position: {
              left: 0,
              top: -257.14285714285717
            },
          }, {
            uuid: '2',
            position: {
              left: -240,
              top: -321.42857142857144
            },
          }, {
            uuid: '3',
            position: {
              left: -240,
              top: -192.8571428571429
            },
          }]
        },
      }
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