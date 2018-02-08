import React, { Component } from 'react';
import { WMText } from '@workmarket/front-end-components';

const tree = {
	type: 'App',
	children: [{
		type: 'View',
		children: [{
			type: 'WMFormzzzzzzz',
			children: [{
				type: 'WMTextField',
			}]
		}]
	}]
};

const ListContainer = (props) => {
	const styles = {
		listStyleType: 'none',
		paddingLeft: 10,
	};

	return (
		<ul style={styles}>
			{props.children}
		</ul>
	);
};

class ViewTreeRenderer extends Component {
	renderItems = (children) => {
		return children.map((child) => {
			if (!child) {
				return (<span />);
			}
			return (
				<li>
					<WMText>
						{child.type}
					</WMText>
					{child.children && (
						<ListContainer>
							{this.renderItems(child.children)}
						</ListContainer>
					)}
				</li>
			);
		});
	}
	render() {
		console.log(this.props.tree);
		return (
			<ListContainer>
				{this.renderItems([this.props.tree])}
			</ListContainer>
		);
	}
};

export default ViewTreeRenderer;