import React, { Component } from 'react';
const uuid = require('uuid/v4');

const style = {
	position: 'absolute',
	padding: '10px 15px',
	border: '2px solid steelblue',
	borderRadius: '2px',
	background: '#fff',
};

class ResolverEditor extends Component {
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
			args: [{
				uuid: uuid(),
			}].concat(this.state.args),
		});
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
					this.state.args.map((arg, i) => (
						<div key={i}>
							<span style={{
								background: this.state.argColors[arg.uuid],
								display: 'inline-block',
								width: '5px',
								height: '5px',
								borderRadius: '5px',
							}} /> <input key={i} type='text' value={arg.name} disabled={arg.type === 'fn' || arg.type === 'state'} />
							<button onClick={() => {
								this.removeArg(arg);
							}}>x</button>
						</div>
					))
				}
				<button onClick={this.addArg}>+</button> <button onClick={this.props.onSave && this.props.onSave}>Save</button>
			</div>
		);
	}
}

export default ResolverEditor;