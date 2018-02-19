import React, { Component } from 'react';
const uuid = require('uuid/v4');
import ramdaApi from './ramda';
import { fromJS } from 'immutable';

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
		console.log(props);

		this.setState({
			type: props.type,
			args: props.args || [],
			argColors: props.argColors || {},
			name: props.name,
			path: props.path || [],
			pathArgs: [].concat(props.args, props.path),
		});
	}

	handleChange(e) {
		this.setState({
			type: e.target.value,
		});
	}

	removeArg = (arg) => {
		// this.setState({
		// 	args: this.state.args.filter(a => a !== arg),
		// });

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
		// let args = {

		// 	type: this.state.type,
		// 	args: this.state.args,
		// 	name: this.state.name,
		// 	path: this.state.path,
		// };
		

		if (!this.props.onSave) {
			return;
		}

		const {
			name,
			type,
			uuid,
		} = this.props;

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

	render() {
		console.log(this.state.name, this.state);
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
						<select name="fn-selector" value={this.state.name}>
						{ramdaApi.map((api, i) => (
							<option key={i} value={api.name}>{api.name}</option>
						))}
						</select>
					)
				}
				{
					this.state.pathArgs.map((arg, i) => {
						const argName = arg.type === 'state' ? 'state' : arg.name;

						return (
							<div key={i}>
								<span style={{
									background: this.state.argColors[arg.uuid],
									display: 'inline-block',
									width: '5px',
									height: '5px',
									borderRadius: '5px',
								}} /> <input key={i} onChange={(e) => { this.handleUpdateArg(arg, e.target.value) }} type='text' value={arg.name} disabled={arg.type === 'fn' || arg.type === 'state'} />
								<button onClick={() => {
									this.removeArg(arg);
								}}>x</button>
							</div>
						)
					})
				}
				<button onClick={this.addArg}>+</button> <button onClick={this.handleSave}>Save</button>
			</div>
		);
	}
}

export default ResolveParamsEditor;