import {
	configureGetComponent,
} from '@workmarket/ui-generation';
import Swagger from 'swagger-client';
import * as Components from '@workmarket/front-end-components';
import * as Patterns from '@workmarket/front-end-patterns';
import store from './previewStore';

// Store the local configuration so we don't hit the API again
let configuredGetComponent;

export default async () => {
	if (!configuredGetComponent) {
		const API_URL = 'http://petstore.swagger.io/v2/swagger.json';

		// Using cookie based auth, so don't pass authentication
		await Swagger(API_URL, {}).then((client) => {
			configuredGetComponent = configureGetComponent({
				api: client,
				functions: {},
				store,
				components: {
					...Components,
					...Patterns,
				},
			});

			configuredGetComponent.__test = true;

			return configuredGetComponent;
		});
	}

	return configuredGetComponent;
};
