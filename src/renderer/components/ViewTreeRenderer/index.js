import React, { Component } from 'react';
import { WMText, WMFloatingActionButton, WMFontIcon } from '@workmarket/front-end-components';
import AddButton from '../AddButton';

const ListContainer = (props) => {
	const styles = {
		listStyleType: 'none',
		paddingLeft: 10,
		cursor: 'pointer',
	};

	return (
		<ul style={styles}>
			{props.children}
		</ul>
	);
};

class ViewTreeRenderer extends Component {
	renderItems = (children) => {
		return children.map((child, i) => {
			if (!child) {
				return (<span />);
			}
			return (
				<li style={{
					fontWeight: this.props.selected === child.uuid ? 'bold' : 'normal',
				}} key={i} onClick={(e) => { e.stopPropagation(); this.props.onSelectComponent && this.props.onSelectComponent(child.uuid) }}>
					<WMText>
						{child.type} 
						<AddButton onClick={(e) => { e.stopPropagation(); this.props.onAddChild && this.props.onAddChild(child) } } />
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
		return (
			<ListContainer>
				{this.renderItems([this.props.tree])}
			</ListContainer>
		);
	}
};

export default ViewTreeRenderer;