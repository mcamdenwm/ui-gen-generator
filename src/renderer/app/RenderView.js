import React, { Component } from 'react';
import configureGetComponent from './configureGetComponent';
import { resolver } from '../utils';
import { fromJS } from 'immutable';

const storeState = {
	FOO: fromJS({
		bar: {
			baz: 'This is, foo, bar, baz   ',
		},
	}),
};

class RenderView extends Component {
	componentWillMount = () => {
		this.transferPropsToState(this.props);
	}
	componentWillReceiveProps = (nextProps) => {
		this.transferPropsToState(nextProps);
	}
	transferPropsToState = (props) => {
		configureGetComponent()
			.then((getComponent) => {
				this.setState({
					getComponent,
				});
			})
			.catch((e) => {
				console.log('Failed to resolve component');
			})
	}
  render() {
  	if (!this.state) {
  		return null;
  	}

  	const view = JSON.parse(this.props.view);
  	// console.log(resolver(view));

  	// let resolvedArg = resolver(view)({storeState, args: [] });

  	// console.log();
  	let resolverResult;
  	let componentResult = null;

  	try {
  		resolverResult = resolver(view);
  		componentResult = this.state.getComponent(resolverResult);
  	} catch (e) {
  		console.error('Failed to render a thing', e);
  	}

  	return componentResult;


  	// return this.state.getComponent( resolver(view) );
		// debugger;  	
    // return this.state.getComponent(view);
  }
}

export default RenderView;