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

					if (!name && typeof node.data === 'string') {
						name = `"${node.data}"`;
					}

					if (node.isRoot) {
						name = 'App';
					}

					const nodeClick = this.props.onNodeClick;
					const safeNode = {
						...node,
						// Too much recursion 
						parent: null,
						children: null,
					};

					const code = node.data.props && (JSON.stringify(node.data.props, false, 2));
						// .replace(/\"\:\ /ig, `": \n\t`)) || '';

					return (
						<div style={{
							boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
							color: 'rgb(24, 144, 224)',
							textAlign: 'center',
							width: 125,
							height: 50,
							fontFamily: '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
							...style,
							padding: '10px',
							fontSize: '14px',
							borderRadius: '2px',
							cursor: 'pointer',
						}}
							onClick={() => {nodeClick(safeNode)}}>
							{name}
						</div>
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