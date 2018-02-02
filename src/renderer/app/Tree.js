import React, { Component } from 'react';
import { WMTree, WMTreeNode, WMTreeRootNode } from '@workmarket/front-end-components';

class Tree extends React.Component {
	render() {
		return (
			<WMTree
				rootNode={this.props.rootNode}
				height={window.innerHeight}
				nodeWidth="150"
				nodeHeight="100"
				renderNode={ (node, i) => {
					const style = {left: node.x, top: node.y, position: 'absolute'};
					const Node = i === 0 ? WMTreeRootNode : WMTreeNode;
					let name = node.data.type;
					let canAddAbove = false;
					let canAddBelow = false;
					let canAddRight = false;
					let canAddLeft = false;

					if (!name && typeof node.data === 'string') {
						name = `"${node.data}"`;
						canAddAbove = false;
						canAddBelow = false;
						canAddRight = false;
						canAddLeft = false;
					}

					if (node.isRoot) {
						name = 'App';
					}

					const nodeClick = this.props.onNodeClick;
					const safeNode = {
						...node,
						// Do we need this?
						parent: null,
						children: null,
					};

					return (
						<Node
							name={name}
							style={style}
							canAddAbove={canAddAbove}
							canAddBelow={canAddBelow}
							canAddRight={canAddRight}
							canAddLeft={canAddLeft}
							onAddAbove={this.props.onAddAbove}
							onAddBelow={this.props.onAddBelow}
							onAddRight={this.props.onAddRight}
							onAddLeft={this.props.onAddLeft}
							onNodeClick={() => { nodeClick(safeNode) }}
						/>
					)}
				}
				renderLinks={() => {}}
				style={{
					transform: 'translate(50%, 100px)'
				}}
			/>
		);
	}
}

export default Tree;