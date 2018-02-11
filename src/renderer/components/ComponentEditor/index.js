import React, { Component } from 'react';
import {
	WMTextField,
	WMToggle,
} from '@workmarket/front-end-components';
import { map } from 'ramda';

import extractPropTypes from './extractPropTypes';

async function getComponent(component) {
	if (!component) {
		return Promise.reject('No component');
	}

	console.log('getComponent for ', component);

	return import(`@workmarket/front-end-components/dist-es/${component}/index.js`);
}

class ComponentEditor extends Component {
	state = {
		componentPropTypes: {},
	};

	componentWillMount() {
		this.props.component && this.hydratePropTypes(this.props.component.get('type'));
	}

	componentWillReceiveProps(nextProps) {
		nextProps.component && this.hydratePropTypes(nextProps.component.get('type'));
	}

	hydratePropTypes = (type) => {
		console.log('Get propTypes for ', type);
		getComponent(type).then((component) => {
			this.setState({
				componentPropTypes: component.propTypes,
			});
		});
	}

	render() {
		return <div />;
		// return (
		// 	<div style={{ overflow: 'auto', height: '100vh' }}>
		// 	 {
		// 		 	map((key) => {
		// 				const propType = this.state.componentPropTypes[key];
		// 				let Field = WMTextField;

		// 				if (propType.type === 'bool') {
		// 					Field = WMToggle;
		// 				}

		// 				return (
		// 					<div>
		// 						<Field
		// 							name={key}
		// 							label={key}
		// 							floatingLabelText={key}
		// 							value={this.props.component.getIn(['props', key])}
		// 							onChange={(e, value) => { this.props.onFieldChange({ [key]: value }) }}
		// 						/>
		// 					</div>
		// 				);
		// 			}, Object.keys(this.state.componentPropTypes))
		// 		}
		// 	</div>
		// );
	}
}

export default ComponentEditor;