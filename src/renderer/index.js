import React from 'react';
import { render } from 'react-dom';
import configureGetComponent from './app/configureGetComponent';
import { db } from './app/store';

const view = db.get('state.view').value();

configureGetComponent()
  .then(getComponent => {
    render(
      <div>
        {
          getComponent(view)
        }
      </div>,
      document.getElementById('app'),
    );
  })

