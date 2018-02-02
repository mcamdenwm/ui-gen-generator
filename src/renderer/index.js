import React from 'react';
import { render } from 'react-dom';
import configureGetComponent from './app/configureGetComponent';
import store, { db } from './app/store';
import { Provider } from 'react-redux';

const view = db.get('state.view').value();

configureGetComponent()
  .then(getComponent => {
    render(
      (
        <Provider store={store}>
          <div>
            <div>
              {
                getComponent({
                  type: 'WMGeneric',
                  actions: [{
                    propName: 'willMount',
                    sequence: [{
                      type: 'VIEW__SET_STATE',
                      path: ['VIEW'],
                      data: view,
                    }]
                  }]
                })
              }
            </div>
            <div>
              {
                getComponent({
                  type: 'RenderView',
                  props: {
                    getComponent,
                  },
                  selectors: [{
                    propName: 'view',
                    data: {
                      $$WM__resolve: {
                        type: 'state',
                        path: ['VIEW'],
                      },
                    },
                  }],
                })
              }
            </div>
            <div className="prop-editor">
              {
                getComponent({
                  type: 'WMGeneric',
                  children: [{
                    type: 'WMTextField',
                    props: {
                      id: 'children',
                      floatingLabelText: `Children of 'p'`
                    },
                    actions: [{
                      propName: 'onChange',
                      sequence: [{
                        type: 'VIEW__SET_STATE',
                        path: ['VIEW', 'children'],
                        data: {
                          $$WM__resolve: {
                            type: 'event',
                            index: 1,
                          },
                        },
                      }]
                    }],
                    selectors: [{
                      propName: 'value',
                      data: {
                        $$WM__resolve: {
                          type: 'state',
                          path: ['VIEW', 'children'],
                        },
                      },
                    }]
                  }, {
                    type: 'WMTextField',
                    props: {
                      id: 'color',
                      floatingLabelText: `props.style.color of 'p'`
                    },
                    actions: [{
                      propName: 'onChange',
                      sequence: [{
                        type: 'VIEW__SET_STATE',
                        path: ['VIEW', 'props', 'style', 'color'],
                        data: {
                          $$WM__resolve: {
                            type: 'event',
                            index: 1,
                          },
                        },
                      }]
                    }],
                    selectors: [{
                      propName: 'value',
                      data: {
                        $$WM__resolve: {
                          type: 'state',
                          path: ['VIEW', 'props', 'style', 'color'],
                        },
                      },
                    }]
                  }]
                })
              }
            </div>
          </div>
        </Provider>
      ),
      document.getElementById('app'),
    );
  })

