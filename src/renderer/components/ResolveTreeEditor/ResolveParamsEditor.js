import React, { Component } from 'react';
const uuid = require('uuid/v4');
import ramdaApi from './ramda';
import { fromJS } from 'immutable';
import { blockNameRenderer } from '../../utils/';
import { WMAutocomplete, WMTextField } from '@workmarket/front-end-components';

const style = {
	position: 'absolute',
	padding: '10px 15px',
	border: '2px solid steelblue',
	borderRadius: '2px',
	background: '#fff',
};

class ResolveParamsEditor extends Component {
	componentWillMount() {
		this.transferPropsToState(this.props);
	}
	componentWillReceiveProps(nextProps) {
		this.transferPropsToState(nextProps);
	}

	transferPropsToState(props) {
		let { args, path, _type } = props;
		let actionPath = [];
		let pathArgs = [].concat(props.args, props.path);

		if (_type === 'redux-action') {
			actionPath = path;
			path = [];
			pathArgs = [].concat(props.args);

			if (actionPath && actionPath.length) {
				actionPath = actionPath.map(a => a.name);
				actionPath = actionPath.join('.');
			}
		}

		this.setState({
			type: props.type,
			args: args || [],
			argColors: props.argColors || {},
			name: props.name,
			path: path || [],
			pathArgs: pathArgs,
			storeHandler: props.type,
			actionPath: actionPath,
		});
	}

	handleChange = (e) => {
		this.setState({
			type: e.target.value,
		});
	}

	handleChangeFn = (value) => {
		this.setState({
			name: value,
		});
	}

	handleChangeHandler = (value) => {
		this.setState({
			storeHandler: value,
		});
	}

	removeArg = (arg) => {
		this.setState({
			pathArgs: this.state.pathArgs.filter(a => a.uuid !== arg.uuid),
		});

		this.props.onRemoveArg && this.props.onRemoveArg(arg);
	}

	addArg = () => {
		this.setState({
			pathArgs: [].concat(this.state.pathArgs, [{
				uuid: uuid(),
				type: 'string',
				name: '',
			}]),
		});
	}

	handleSave = () => {
		if (!this.props.onSave) {
			return;
		}

		const {
			uuid,
		} = this.props;

		const {
			name,
			type,
			pathArgs,
			storeHandler,
			actionPath,
		} = this.state;

		const isTypeStateOrFn = type === 'state' || type === 'fn';

		const block = {
			name,
			type: !isTypeStateOrFn ? storeHandler : type,
			uuid,
		};

		if (type === 'state') {
			block.path = pathArgs;
		} else if (type === 'fn') {
			block.args = pathArgs;
		} else {
			// Action
			block.name = storeHandler;
			block.args = pathArgs;
			block._type = 'redux-action';
			block.path = actionPath.split('.');
		}

		this.props.onSave(block);
	}

	handleUpdateArg = (arg, value) => {
		const mutPathArgs = this.state.pathArgs.map((pathArg, i) => {
			if (pathArg.uuid !== arg.uuid) {
				return pathArg;
			}

			pathArg.name = value;
			return pathArg;
		});

		this.setState({
			pathArgs: mutPathArgs,
		});
	}

	handleCancel = () => {
		if (this.props.onCancel) {
			this.props.onCancel();
		}
	}

	removeNode = () => {
		if (this.props.onRemoveNode) {
			this.props.onRemoveNode(this.props.uuid);
		}
	}

	render() {
		const { type } = this.state;
		const isTypeStateOrFn = type === 'state' || type === 'fn';

		return (
			<div
				style={{
					...style,
					...this.props.style,
				}}
			>	
				<div>
					<select value={isTypeStateOrFn ? this.state.type : 'redux-action'} onChange={this.handleChange}>
						<option value="state">State</option>
						<option value="fn">Function</option>
						<option value="redux-action">Redux Action</option>
					</select>
				</div>
				{
					!isTypeStateOrFn && (
						<div style={{marginBottom: 10}}>
							<WMAutocomplete
								floatingLabelText="handler"
								hintText="FOO__UPDATE_BAR"
								dataSource={this.props.storeHandlers}
								filter="caseInsensitiveFilter"
								maxSearchResults={ 10 }
								onNewRequest={ (a) => { this.handleChangeHandler(a) } }
								onBlur={(e) => { this.handleChangeHandler(e.target.value) }}
								searchText={this.state.storeHandler}
							/>
							<WMTextField
								floatingLabelText="path"
								hintText="FOO.bar.result"
								value={this.state.actionPath}
								onChange={(e, v) => { this.setState({ actionPath: v }) }}
							/>
						</div>
					)
				}
				{
					this.state.type === 'fn' && (
						<div style={{marginBottom: 10}}>
							<WMAutocomplete
								floatingLabelText="fn"
								hintText="toUpper"
								dataSource={ramdaApi.map(api => api.name)}
								filter="caseInsensitiveFilter"
								maxSearchResults={ 10 }
								onNewRequest={ (a) => { this.handleChangeFn(a) } }
								searchText={this.state.name}
							/>
						</div>
					)
				}
				{
					this.state.pathArgs.map((arg, i) => {
						let fullPath = '';

						if (arg.type !== 'string') {
							fullPath = blockNameRenderer(this.props.storeState, fromJS([arg]), fromJS(arg)).fullPath;
						}

						let argName = arg.name;

						if (arg.type === 'state') {
							argName = fullPath;
						}

						return (
							<div key={i}>
								<span style={{
									background: this.state.argColors[arg.uuid],
									display: 'inline-block',
									width: '5px',
									height: '5px',
									borderRadius: '5px',
								}} /> <input key={i} onChange={(e) => { this.handleUpdateArg(arg, e.target.value) }} type='text' value={argName} disabled={arg.type === 'fn' || arg.type === 'state'} />
								<button onClick={() => {
									this.removeArg(arg);
								}}>x</button>
							</div>
						)
					})
				}
				<div>
					<button onClick={this.addArg}>+</button> <button onClick={this.handleSave}>Save</button> <button onClick={this.handleCancel}>Cancel</button> 
				</div>
				<div>
					<button onClick={this.removeNode}>Delete Node</button>
				</div>
			</div>
		);
	}
}

export default ResolveParamsEditor;