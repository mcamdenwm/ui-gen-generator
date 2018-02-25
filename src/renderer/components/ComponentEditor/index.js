import React, { Component } from 'react';
import * as Components from '@workmarket/front-end-components';
import { map } from 'ramda';

const {
	WMText,
	WMTextField,
	WMToggle,
	WMLink,
	WMFlatButton,
	WMAutocomplete
} = Components;

import SelectorContainer from './SelectorContainer';
import extractPropTypes from './extractPropTypes';

// This is neat, but we probably are wasting some space/build cycles with this
async function getComponent(component) {
	if (!component) {
		return Promise.reject('No component');
	}

	console.info('getComponent for ', component);

	return import(`@workmarket/front-end-components/dist-es/${component}/index.js.flow`);
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
		getComponent(type).then((componentDef) => {
			const Component = componentDef.default;

			this.setState({
				componentPropTypes: Component.propTypes,
			});
		});
	}

	getSelectors = () => {
		const resolveTrees = JSON.parse(this.props.resolveTrees);
		return resolveTrees.filter(tree => tree.type === 'selector');
	}

	render() {
		const componentType = this.props.component.get('type');
		const componentTypes = [].concat(Object.keys(Components).filter(n => n !== 'commonStyles'), componentType);

		return (
			<div style={{ overflow: 'auto', height: '100vh' }}>
				<div style={{
					width: '100%',
				}}>
					<WMText>
						Type
					</WMText>
					<WMAutocomplete
						floatingLabelText="Type"
						hintText="WMFlatButton"
						dataSource={componentTypes}
						filter="caseInsensitiveFilter"
						maxSearchResults={ 10 }
						onNewRequest={ (a) => { this.props.onChangeType && this.props.onChangeType({type: a}, this.props.component.get('uuid')) } }
						searchText={componentType}
					/>
				</div>
				<div style={{
					width: '100%',
				}}>
					<WMText>
						Props
					</WMText>
				 {
					 	map((key) => {
							const propType = this.state.componentPropTypes[key];
							let Field = WMTextField;

							if (propType.type === 'bool') {
								Field = WMToggle;
							}

							return (
								<div key={key}>
									<Field
										name={key}
										label={key}
										floatingLabelText={key}
										value={this.props.component.getIn(['props', key])}
										onChange={(e, value) => { this.props.onFieldChange({ [key]: value }) }}
									/>
								</div>
							);
						}, Object.keys(this.state.componentPropTypes).filter(key => this.props.component.getIn(['props', key])) )
					}
				</div>
				<div style={{
					width: '100%',
				}}>
					<WMText>
						Selectors <WMFlatButton label="+" onClick={() => { this.props.onAddSelector && this.props.onAddSelector() }} />
					</WMText>
					<SelectorContainer
						selectors={this.getSelectors()}
						props={Object.keys(this.state.componentPropTypes)}
						onClick={(uuid) => {this.props.onEditSelector && this.props.onEditSelector(uuid)}}
						editing={this.props.editingSelector}
						onUpdateSelector={(selector, propName) => { this.props.onUpdateSelector && this.props.onUpdateSelector(JSON.stringify(selector), propName); }}
						onDeleteSelector={(uuid) => { this.props.onDeleteSelector && this.props.onDeleteSelector(uuid); }}
					/>
				</div>
				<div style={{
					width: '100%',
				}}>
					<WMText>
						Actions
					</WMText>
				</div>
			</div>
		);
	}
}

export default ComponentEditor;