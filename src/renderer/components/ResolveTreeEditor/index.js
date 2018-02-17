import React, { Component } from 'react';
import { WMTree } from '@workmarket/front-end-components';
import { compose, fromPairs, toPairs, map, range, trim, split } from 'ramda';
import _ from 'lodash';
import { fromJS, Map, List } from 'immutable';
import TreeUtils from 'immutable-treeutils';
import { hierarchy } from 'd3-hierarchy';
import { getResolver } from '@workmarket/ui-generation/dist-es/data';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemeDark2 } from 'd3-scale-chromatic';
const uuid = require('uuid/v4');

import { writeUIGenTree } from '../../utils';
import { RESOLVE } from '../../constants';

import ResolveParamsEditor from './ResolveParamsEditor';
import ResolveNode from './ResolveNode';
import ResolveLink from './ResolveLink';

const treeUtils = new TreeUtils(null, 'uuid', 'args');

const state = {
	FOO: fromJS({
		bar: {
			baz: 'This is, foo, bar, baz   ',
		},
	}),
};

const resolver = getResolver({
	functions: {
		split, trim, map
	},
});

function walkResolve(stack, cb) {
	function walker(node) {
		if (typeof(node) === 'string') {
			return {
				type: 'string',
				name: node,
				uuid: uuid(),
			};
		}

		let keys = Object.keys(node);
		if (keys[0] === RESOLVE) {
			return walker(node[RESOLVE]);
		}

		let block = Object.assign({}, node);
		block.args = _.map(block.args, walker);
		block.path = _.map(block.path || [], walker);

		return block;
	}

	return walker(stack);
}

var color = scaleOrdinal(schemeDark2);

class ResolveTreeEditor extends Component {
	state: {}
	componentWillMount() {
		this.props.resolveTree && this.parseResolveTree(this.props.resolveTree, this.props.resolveNodes);
	}
	componentWillReceiveProps(nextProps) {
		nextProps.resolveTree && this.parseResolveTree(nextProps.resolveTree, nextProps.resolveNodes);
	}
	generateState(resolveTree, resolveNodes) {
		const resolvedTrees = [].concat(resolveTree.trees).map(walkResolve);
		const immutableResolvedTrees = fromJS(resolvedTrees);
		const resolvedTreeLinks = immutableResolvedTrees.map(tree => hierarchy(tree.toJS(), d => d.args).links());

		// const resolvedTree = walkResolve(parsedFns);
		// const functionTree = fromJS(resolvedTree);
		// const functionLinks = hierarchy(resolvedTree, d => d.args).links();

		const immutableResolvedTreesAsNodes = immutableResolvedTrees.map(n => {
			return treeUtils.nodes(n).map(path => n.getIn(path));
		});

		let flattenedResolvedTreeLinks = resolvedTreeLinks.flatten(1).toJS();
		if (flattenedResolvedTreeLinks.length) {
			flattenedResolvedTreeLinks = flattenedResolvedTreeLinks.reduce((memo, g) => memo.concat(g), []);
		}		

		// console.log(immutableResolvedTrees, immutableResolvedTreesAsNodes);

		// treeUtils.nodes(functionTree).map(path => functionTree.getIn(path));
		
		return {
			resolveTrees: immutableResolvedTrees,
			resolveTreesAsNodes: immutableResolvedTreesAsNodes,
			resolveNodes: fromJS(resolveNodes),
			resolvedTreeLinks: flattenedResolvedTreeLinks,
			// resolveTree: parsedFns,
			// resolveNodes: this.assignColor(resolveNodes),
			// functionTree,
			// functionLinks,
			// functionTreeAsNodes,
		};
	}
	parseResolveTree(resolveTree, resolveNodes) {
		this.setState(this.generateState(resolveTree, resolveNodes));
	}

	assignColor = (positions, overNode) => {
		let overChildNodesSeq = [];
		let overChildNodes = [];

		if (overNode) {
			overChildNodesSeq =	treeUtils.childNodes(this.state.functionTree, overNode);
			overChildNodes = overChildNodesSeq.map(seq => this.state.functionTree.getIn(seq));
		}

		return positions.map((position, i) => {
			let positionOpacity = 1;

			if (overNode && overNode !== position.uuid) {
				positionOpacity = .1;
			}

			position.color = color(i);
			position.opacity = positionOpacity;
			return position;
		});
	}

	showResolveParamsEditor = (e, params) => {
		return;
		const container = document.getElementById('function-editor');

		// links are the args of the fn, so we can extract the arg color from the links
		const argColors = this.state.functionLinks.filter(link => link.source.data.uuid === params && params.uuid)
			.reduce((memo, link) => {
				if (link.target.data.type === 'string') {
					return null;
				}
				const target = this.state.resolveNodes.find(n => n.uuid === link.target.data.uuid);

				return {
					...memo,
					[target.uuid]: target.color,
				};
			}, {});
		
		const newNode = {
			uuid: uuid(),
			name: 'state',
			args: fromJS([
				{type: 'string', name: 'FOO'},
				{type: 'string', name: 'bar'}, 
				{type: 'string', name: 'baz'},
			]),
			type: 'state',
		};

		const newPositions = [].concat(this.state.resolveNodes);
		let newFunctionTreeAsNodes = this.state.functionTreeAsNodes;

		const translateX = 500;
		const translateY = 500;

		if (!params) {
			newPositions.push({
				position: {
					left: (e.clientX - container.offsetLeft) - translateX,
					top: (e.clientY) - translateY,
				},
				uuid: uuid(),
			});

			newFunctionTreeAsNodes = newFunctionTreeAsNodes.push(fromJS(newNode));
		}

		this.setState({
			showEditor: true,
			position: {
				x: e.clientX - container.offsetLeft,
				y: e.clientY,
			},
			editorParams: params || newNode,
			resolveNodes: this.assignColor(newPositions),
			functionTreeAsNodes: newFunctionTreeAsNodes,
			argColors,
		});
	}

	handleSave = (params) => {
		this.setState({
			showEditor: false,
		})
	}
	handleMouseDownOnNode = (e, params) => {
		this._dragFrom = params;
		this._dragFrom.args = this._dragFrom.args.toJS();
	}

	handleMouseMove = (e) => {
		const translateX = 500;
		const translateY = 500;

		if (this._dragFrom) {
			const container = document.getElementById('function-editor');
			this.setState({
				dragToPosition: {
					x: (e.clientX - container.offsetLeft) - translateX,
					y: (e.clientY) - translateY,
				}
			})
		}
	}

	handleMouseUpOnCanvas = (e) => {
		this._dragFrom = {};
		this.setState({
			dragPosition: null,
		});
	}

	handleMouseUpOnNode = (e, params) => {
		this.stopPropOfEditor = true;
		this.setState({
			dragToPosition: null,
		});

		if (this._dragFrom.uuid !== params.uuid) {
			const dragFrom = this._dragFrom;
			// Drag from node
			e.preventDefault();
			e.stopPropagation();

			// Add this as arg to another node
			let resolveSeq = treeUtils.byId(this.state.functionTree, params.uuid)
			let resolverTree;
			if (resolveSeq.size) {
				let resolverTree = this.state.functionTree.updateIn(resolveSeq.concat('args'), args => args.push(dragFrom))
				
				const uiGenTree = this.writeUIGenTree(resolverTree.toJS().args[0]);

				this.parseResolveTree(uiGenTree, this.state.resolveNodes);
			}

			this._dragFrom = null;
		} else {
			// Click (or otherwise mouseup) on node
			if(!params.isResolvedComputation) {
				e.preventDefault();
				e.stopPropagation();
				this.showResolveParamsEditor(e, {
					uuid: params.uuid
				});
			}
		}
	}

	handleAddArgToNode = (uuid) => {
		const dragFrom = this._dragFrom;
		if (!dragFrom) {
			return;
		}

		// Add this as arg to another node
		let resolveSeq = treeUtils.byId(this.state.functionTree, params.uuid)
		let resolverTree;
		if (resolveSeq.size) {
			let resolverTree = this.state.functionTree.updateIn(resolveSeq.concat('args'), args => args.push(dragFrom))
			
			const uiGenTree = this.writeUIGenTree(resolverTree.toJS().args[0]);

			this.parseResolveTree(uiGenTree, this.state.resolveNodes);
		}
	}

	handleRemoveArg = (params, arg) => {
		let argSeq = treeUtils.find(this.state.functionTree, n => n.get('uuid') === arg.uuid && n.get('name') === arg.name);
		let fn = this.state.functionTree.getIn(argSeq);
		let resolverTree = this.state.functionTree.removeIn(argSeq);
		
		const uiGenTree = this.writeUIGenTree(resolverTree.toJS().args[0]);
		const newState = this.generateState(uiGenTree, this.state.resolveNodes);

		this.setState({
			...newState,
			// Removing arg shouldnt remove node
			functionTreeAsNodes: newState.functionTreeAsNodes.push(fn),
		})
	}

	handleMouseOver = (e, { uuid }) => {
		// this isnt quite what I wanted
		return;
		console.log(`over ${uuid}`);
		this.setState({
			over: uuid,
			resolveNodes: this.assignColor(this.state.resolveNodes, uuid),
		});
	}

	handleMouseOut = (e, { uuid }) => {
		// this isnt quite what I wanted
		return;
		console.log(`out of ${uuid}`);
		this.setState({
			over: null,
			resolveNodes: this.assignColor(this.state.resolveNodes, null),
		});
	}	

	render() {
		const {
			resolveTrees,
			resolveTreesAsNodes,
			resolveNodes,
			resolvedTreeLinks,
			functionTree,
			functionLinks,
			showEditor,
			position,
			editorParams,
			functionTreeAsNodes,
			argColors,
			over,
		} = this.state;
		let resolveDataJson = {};

		// if (editorParams) {
		// 	let resolveData = functionTreeAsNodes.find(n => n.get('uuid') === editorParams.uuid);
		// 	resolveDataJson = resolveData.toJS();
		// }

		return <div onMouseUp={this.handleMouseUpOnCanvas} onMouseMove={this.handleMouseMove} style={{ position: 'relative' }} id="function-editor">
			{showEditor && (
				<ResolveParamsEditor style={{
					left: position.x,
					top: position.y,
				}}
					type={resolveDataJson.type}
					args={resolveDataJson.args}
					argColors={argColors}
					onSave={() => this.handleSave(resolveDataJson)}
					onRemoveArg={(arg) => this.handleRemoveArg(resolveDataJson, arg)}
				/>
			)}
			<svg 
				width="1000"
				height="600"
				onClick={(e) => {
					if (!this.stopPropOfEditor) {
						this.showResolveParamsEditor(e, null);
					}
					this.stopPropOfEditor = false;
				}}
				style={{
					userSelect: 'none',
					background: `rgb(41, 45, 62)`,
				}}
			>
				<g>
					{
						resolvedTreeLinks.map((link, i) => {
							if (link.target.data.type === 'string') {
								return null;
							}
							
							const target = resolveNodes.find(n => n.get('operationUuid') === link.target.data.uuid);
							const source = resolveNodes.find(n => n.get('operationUuid') === link.source.data.uuid);

							if (!target || !source) {
								console.log('Complete link not found for (target, source)', link.target.data.uuid, link.source.data.uuid)
								return null;
							}

							let sourceLeft = source.getIn(['position','x']);
							let sourceTop = source.getIn(['position','y']);
							let targetLeft = target.getIn(['position','x']);
							let targetTop = target.getIn(['position','y']);
							let pathColor = target.get('color');
							let pathOpacity = 1;

							if (over && (over !== source.get('uuid') || over === target.get('uuid'))) {
								pathOpacity = .1;
							}

							return (
								<ResolveLink
									key={i}
									color={pathColor}
									opacity={pathOpacity}
									sourceLeft={sourceLeft}
									sourceTop={sourceTop}
									targetLeft={targetLeft}
									targetTop={targetTop}
								/>
							);
						})
					}
					{
						resolveTreesAsNodes.flatten(1).map((block, blockIndex) => {
							const node = resolveNodes.find((n) => n.get('operationUuid') === block.get('uuid'));

							if (!node) {
								console.warn('Cant find node with ', block.toJS());
								return null;
							}

							{/*console.log(node.toJS());*/}

							return (
								<ResolveNode
									key={blockIndex}
									block={block}
									node={node}
									index={blockIndex}
								/>
							);
						})
					}
{/*					{this.state.dragToPosition && (() => {
						const fn = this.state.resolveNodes.find(n => n.uuid === this._dragFrom.uuid);

						if (!fn) {
							return null;
						}

						const sourceLeft = fn.position.left;
						const sourceTop = fn.position.top;
						const targetLeft = this.state.dragToPosition.x;
						const targetTop = this.state.dragToPosition.y - 10;

						return (<path
							stroke="#cc9900"
							strokeWidth="2px"
							d={ `M${sourceLeft},${sourceTop} L ${targetLeft} ${targetTop}` } />
						);
						})()
					}*/}
				</g>
			</svg>
		</div>
	}
}

export default (props) => {
	let resolveTrees = props.resolveTrees;
	if (typeof resolveTrees === 'string') {
		resolveTrees = JSON.parse(resolveTrees);
	}
	
	return (
		<ResolveTreeEditor
			{...props}
			resolveTree={resolveTrees[0]}
		/>
	);
};