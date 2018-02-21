import React, { Component } from 'react';
const uuid = require('uuid/v4');
import ramdaApi from './ramda';
import { fromJS } from 'immutable';
import { blockNameRenderer } from '../../utils/';

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
		this.setState({
			type: props.type,
			args: props.args || [],
			argColors: props.argColors || {},
			name: props.name,
			path: props.path || [],
			pathArgs: [].concat(props.args, props.path),
		});
	}

	handleChange = (e) => {
		this.setState({
			type: e.target.value,
		});
	}

	handleChangeFn = (e) => {
		this.setState({
			name: e.target.value,
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
		} = this.state;

		const block = {
			name,
			type,
			uuid,
		};

		if (this.props.type === 'state') {
			block.path = this.state.pathArgs;
		} else {
			block.args = this.state.pathArgs;
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
		return (
			<div
				style={{
					...style,
					...this.props.style,
				}}
			>	
				<div>
					<select value={this.state.type} onChange={this.handleChange}>
						<option value="state">State</option>
						<option value="fn">Function</option>
					</select>
				</div>
				{
					this.state.type === 'fn' && (
						<select name="fn-selector" value={this.state.name} onChange={this.handleChangeFn}>
						{ramdaApi.map((api, i) => (
							<option key={i} value={api.name}>{api.name}</option>
						))}
						</select>
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