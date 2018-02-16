import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from "react-tap-event-plugin";
import { Provider } from 'react-redux';

import configureGetComponent from './app/configureGetComponent';
import store, { db } from './app/store';

// import editor from './editor';
import preview from './preview';

injectTapEventPlugin();

const state = db.get('state').value();
// let view = {};

// if (state && state.view) {
//   view = state.view;
// }

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
            <div className="initializer">
              {
                getComponent({
                  type: 'WMGeneric',
                  actions: [{
                    propName: 'willMount',
                    sequence: [{
                      type: 'VIEW__SET_STATE',
                      path: ['VIEW'],
                      data: state,
                    }]
                  }]
                })
              }
            </div>
{/*              getComponent({
                type: 'WMDrawer',
                selectors: [{
                  propName: 'open',
                  data: {
                    $$WM__resolve: {
                      type: 'state',
                      path: ['COMPONENT_EDITOR', 'open'],
                    },
                  },
                }],
                children: [{
                  type: 'WMFlatButton',
                  props: {
                    label: 'Close',
                  },
                  actions: [{
                    propName: 'onClick',
                    sequence: [{
                      type: 'COMPONENT_EDITOR__CLOSE',
                      path: ['COMPONENT_EDITOR', 'open'],
                      data: false,
                    }]
                  }]
                }, {
                  type: 'ComponentEditor',
                  selectors: [{
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
                            path: ['VIEW']
                          },
                        }],
                      },
                    },
                  }],
                  actions: [{
                    propName: 'onFieldChange',
                    sequence: [{
                      type: 'COMPONENT_EDITOR__UPDATE_FIELD',
                      path: ['VIEW'],
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
                              path: ['VIEW'],
                            },
                          }],
                        },
                      },
                    }]
                  }],
                }]
              })*/}
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
                  }]
                })
              }
            </div>
            <div className="preview" style={{
              width: '70%',
              display: 'none',
            }}>
              {
                getComponent(preview(getComponent))
              }
            </div>
            <div className="function-editor" style={{
              width: '70%',
            }}>
              {
                getComponent({
                  type: 'FunctionEditor',
                  selectors: [{
                    propName: 'functions',
                    data: {
                      $$WM__resolve: {
                        type: 'state',
                        path: ['VIEW', 'functions', 'fn1'],
                      },
                    },
                    toJS: true,
                  }, {
                    propName: 'functionPositions',
                    data: {
                      $$WM__resolve: {
                        type: 'state',
                        path: ['VIEW', 'functionPositions', 'fn1'],
                      },
                    },
                    toJS: true,
                  }]
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

