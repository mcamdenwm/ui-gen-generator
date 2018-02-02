import {
  configureGetComponent,
} from '@workmarket/ui-generation';
import Swagger from 'swagger-client';
import * as Components from '@workmarket/front-end-components';
import * as Patterns from '@workmarket/front-end-patterns';
import store from './store';
import Json from 'react-json';
import RenderView from './RenderView';
import Tree from './Tree';

// Store the local configuration so we don't hit the API again
let configuredGetComponent;

export default async () => {
  if (!configuredGetComponent) {
    const API_URL = 'http://petstore.swagger.io/v2/swagger.json';

    // Using cookie based auth, so don't pass authentication
    await Swagger(API_URL, {}).then((client) => {
      configuredGetComponent = configureGetComponent({
        api: client,
        functions: {
          log: (n) => {
            console.log(n);
            return n;
          }
        },
        store,
        components: {
          ...Components,
          ...Patterns,
          Json,
          RenderView,
          Tree,
        },
      });

      return configuredGetComponent;
    });
  }

  return configuredGetComponent;
};
