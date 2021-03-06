import React, { Component } from 'react';
import * as Components from '@workmarket/front-end-components';
import { map } from 'ramda';
import { fromJS } from 'immutable';

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

	if (component === 'WMGeneric') {
		return Promise.resolve({});
	}

	return import(`@workmarket/front-end-components/dist-es/${component}/index.js.flow`);
}

class ComponentEditor extends Component {
	state = {
		componentPropTypes: {},
	};

	componentWillMount() {
		this.props.component && this.props.component.get && this.hydratePropTypes(this.props.component.get('type'));
	}

	componentWillReceiveProps(nextProps) {
		console.info('##componentWillReceiveProps', nextProps);
		nextProps.component && nextProps.component.get && this.hydratePropTypes(nextProps.component.get('type'));
	}

	hydratePropTypes = (type) => {
		getComponent(type).then((componentDef) => {
			const Component = componentDef.default;
			
			this.setState({
				componentPropTypes: extractPropTypes(Component.propTypes),
			});
		})
		.catch((e) => {
			console.error('Component not found, propTypes not determinable', type);
			
			this.setState({
				componentPropTypes: {
					style: {
						type: 'object',
						isRequired: false,
					}
				},
			});
		});
	}

	getSelectors = () => {
		const resolveTrees = JSON.parse(this.props.resolveTrees);
		return resolveTrees.filter(tree => tree.type === 'selector' && tree.componentUuid === this.props.component.get('uuid'));
	}

	getComponentProps = () => {
		return this.props.viewProps.filter(prop => prop.get('componentUuid') === this.props.component.get('uuid'));
	}

	getActions = () => {
		const resolveTrees = JSON.parse(this.props.resolveTrees);
		return resolveTrees.filter(tree => tree.type !== 'selector' && tree.componentUuid === this.props.component.get('uuid'));
	}

	render() {
		if (!this.props.component || !this.props.component.get) {
			return null;
		}

		const componentType = this.props.component.get('type');
		const componentTypes = [].concat(Object.keys(Components).filter(n => n !== 'commonStyles'), componentType);

		return (
			<div style={{ overflow: 'auto', height: '100vh' }}>
				<div style={{
					width: '100%',
				}}>
					<WMText style={{fontWeight: 'bold'}}>
						Type
					</WMText>
					<div style={{marginLeft: 10}}>
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
				</div>
				<div style={{
					width: '100%',
				}}>
					<WMText style={{fontWeight: 'bold'}}>
						Props <WMFlatButton style={{minWidth: 22}} label="+" onClick={() => { this.props.onAddProp && this.props.onAddProp() }} />
					</WMText>
				{
						this.getComponentProps().map((prop, i) => {
							const key = prop.get('propName') || i;
							const propType = this.state.componentPropTypes[prop.get('propName')];
							let Field = WMTextField;

							if (propType && propType.type === 'bool') {
								Field = WMToggle;
							}

							if (!propType) {
								Field = () => (<div />)
							}

							return (
								<div key={key} style={{marginLeft: 10}}>
									<WMAutocomplete
										floatingLabelText="PropName"
										hintText="disabled"
										dataSource={Object.keys(this.state.componentPropTypes)}
										filter="caseInsensitiveFilter"
										maxSearchResults={ 10 }
										onNewRequest={ (a) => { this.props.onUpdateProp && this.props.onUpdateProp(prop.get('uuid'), { propName: a }) } }
										searchText={prop.get('propName')}
									/>
									<Field
										name={prop.get('propName')}
										value={prop.get('value')}
										toggled={prop.get('value')}
										onChange={(e, value) => { this.props.onUpdateProp && this.props.onUpdateProp(prop.get('uuid'), { value: value }) } }
										onToggle={(e, value) => { this.props.onUpdateProp && this.props.onUpdateProp(prop.get('uuid'), { value: value }) }}
									/>
								</div>
							);
						})
					}
				</div>
				<div style={{
					width: '100%',
				}}>
					<WMText style={{fontWeight: 'bold'}}>
						Selectors <WMFlatButton style={{minWidth: 22}} label="+" onClick={() => { this.props.onAddSelector && this.props.onAddSelector('selector') }} />
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
					<WMText style={{fontWeight: 'bold'}}>
						Actions <WMFlatButton style={{minWidth: 22}} label="+" onClick={() => { this.props.onAddSelector && this.props.onAddSelector('action') }} />
					</WMText>
					<SelectorContainer
						selectors={this.getActions()}
						props={Object.keys(this.state.componentPropTypes)}
						onClick={(uuid) => {this.props.onEditSelector && this.props.onEditSelector(uuid)}}
						editing={this.props.editingSelector}
						onUpdateSelector={(selector, propName) => { this.props.onUpdateSelector && this.props.onUpdateSelector(JSON.stringify(selector), propName); }}
						onDeleteSelector={(uuid) => { this.props.onDeleteSelector && this.props.onDeleteSelector(uuid); }}
					/>
				</div>
			</div>
		);
	}
}

export default ComponentEditor;