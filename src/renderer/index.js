import React from 'react';
import { render } from 'react-dom';
import configureGetComponent from './app/configureGetComponent';
import store, { db } from './app/store';
import { Provider } from 'react-redux';

import editor from './editor';
import preview from './preview';

const view = db.get('state.view').value();

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
                      data: view,
                    }]
                  }]
                })
              }
            </div>
            <div className="editor" style={{
              flex: 1,
            }}>
              {
                getComponent(editor)
              }
            </div>
            <div className="preview" style={{
              flex: 1,
            }}>
              {
                getComponent(preview(getComponent))
              }
            </div>
          </div>
        </Provider>
      ),
      document.getElementById('app'),
    );
  })

