import React, { Component } from 'react';
import { WMTree } from '@workmarket/front-end-components';
import { compose, fromPairs, toPairs, map, range, trim, split, uniqBy } from 'ramda';
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
			resolveTree,
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
		const argColors = this.state.resolvedTreeLinks.filter(link => link.source.data.uuid === params && params.uuid)
			.reduce((memo, link) => {
				if (link.target.data.type === 'string') {
					return null;
				}
				const target = this.state.resolveNodes.find(n => n.get('uuid') === link.target.data.uuid);

				return {
					...memo,
					[target.get('uuid')]: target.color,
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

		if (!params) {
			newPositions.push({
				position: {
					left: (e.clientX - container.offsetLeft),
					top: (e.clientY),
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
		if (!this.props.onMutatedResolveTree) {
			return;
		}

		const parentTree = this.state.resolveTrees.find(tree => treeUtils.byId(tree, params.uuid));
		const parentTreeI = this.state.resolveTrees.findIndex(tree => treeUtils.byId(tree, params.uuid));
		const seq = [parentTreeI].concat(treeUtils.byId(parentTree, params.uuid).toJS());

		let mutatedTreeList = this.state.resolveTrees.updateIn(seq, () => fromJS(params));

		if (this._preservedTrees) {
			mutatedTreeList = mutatedTreeList.concat(fromJS(this._preservedTrees));
			this._preservedTrees = null;
		}

		const uiGenTreeList = mutatedTreeList.toJS().map(writeUIGenTree);
		
		// @todo tree should be a list of strings (resolves)
		const mutatedTree = JSON.stringify([{
			...this.state.resolveTree,
			trees: uiGenTreeList,
		}]);

		this.props.onMutatedResolveTree(mutatedTree, this.state.resolveNodes);

		console.log('save', mutatedTree);
		this.setState({
			edit: null,
		});
	}
	handleMouseDownOnNode = (e, params) => {
		console.log('new drag from', params);
		this._dragFrom = params;
		this._dragFrom.args = this._dragFrom.args.toJS();
	}

	handleMouseMove = (e) => {
		if (this._dragFrom) {
			const container = document.getElementById('function-editor');
			this.setState({
				dragToPosition: {
					x: (e.clientX - container.offsetLeft),
					y: (e.clientY),
				}
			})
		}
	}

	handleMouseUpOnCanvas = (e) => {
		if (e.target.id !== 'canvas' || this.state.edit) {
			return;
		}

		const container = document.getElementById('function-editor');
		const operationUuid = uuid();
		let parentTree = null;
		let childNode = null;
		let newResolve;

		if (this._dragFrom) {
			parentTree = this.state.resolveTrees.find(tree => treeUtils.byId(tree, this._dragFrom.uuid));
			childNode = parentTree.getIn(treeUtils.byId(parentTree, this._dragFrom.uuid));

			newResolve = {
				uuid: operationUuid,
				args: [childNode.toJS()],
				type: 'fn',
				name: 'trim',
			};
		} else {
			newResolve = {
				uuid: operationUuid,
				path: ['FOO', 'bar', 'baz'],
				type: 'state',
			};
		}

		const newNode = {
			// treeUuid
			operationUuid: operationUuid,
			position: {
				x: (e.clientX - container.offsetLeft),
				y: (e.clientY),
			},
			color: color(this.state.resolveTreesAsNodes.size + 1),
		};

		const mutatedTreeList = this.state.resolveTrees.push(Map(newResolve));
		const mutatedNodesList = this.state.resolveNodes.push(Map(newNode));
		const uiGenTreeList = mutatedTreeList.toJS().map(writeUIGenTree);

		if (this.props.onMutatedResolveTree) {
			// @todo tree should be a list of strings (resolves)
			const mutatedTree = JSON.stringify([{
				...this.state.resolveTree,
				trees: uiGenTreeList,
			}]);

			this.props.onMutatedResolveTree(mutatedTree, mutatedNodesList);
		}

		this._dragFrom = null;
		this.setState({
			dragToPosition: null,
			edit: operationUuid,
		});
	}

	handleMouseUpOnNode = (e, params) => {
		let updatedState = {
			dragToPosition: null,
		};

		if (this._dragFrom && this._dragFrom.uuid !== params.uuid) {
			const parentTree = this.state.resolveTrees.find(tree => treeUtils.byId(tree, params.uuid));
			const parentTreeI = this.state.resolveTrees.findIndex(tree => treeUtils.byId(tree, params.uuid));
			const seq = [parentTreeI].concat(treeUtils.byId(parentTree, params.uuid).toJS());

			const { resolveTreesAsNodes } = this.state;
			const dragFromResolve = resolveTreesAsNodes.flatten(1).find(n => n.get('uuid') === this._dragFrom.uuid);

			let mutatedTreeList = this.state.resolveTrees.updateIn(seq, (parentNode) => {
				console.log('Update parentNode', parentNode.toJS());
				const parentNodeArgs = parentNode.get('args');
				return parentNode.set('args', parentNodeArgs.push(dragFromResolve));
			});

			const uiGenTreeList = mutatedTreeList.toJS().map(writeUIGenTree);
			
			// @todo tree should be a list of strings (resolves)
			const mutatedTree = JSON.stringify([{
				...this.state.resolveTree,
				trees: uiGenTreeList,
			}]);

			this.props.onMutatedResolveTree(mutatedTree, this.state.resolveNodes);
		} else {
			updatedState.edit = params.uuid;
		}

		this._dragFrom = null;
		this.setState(updatedState);
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
		if (arg.type === 'string') {
			return;
		}

		// Preserve removed args as new trees
		this._preservedTrees = [].concat(this._preservedTrees || [], arg);
		this._preservedTrees = uniqBy(n => n.uuid, this._preservedTrees);
	}

	handleMouseOver = (e, { uuid }) => {
		this.setState({
			over: uuid,
		});
	}

	handleMouseOut = (e, { uuid }) => {
		this.setState({
			over: null,
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
			position,
			editorParams,
			functionTreeAsNodes,
			over,
			edit,
		} = this.state;

		let resolveDataJson = {};
		let editorPosition = {};
		let showEditor = false;

		if (edit) {
			const editResolve = resolveTreesAsNodes.flatten(1).find(n => n.get('uuid') === edit);
			const editNode = resolveNodes.find((n) => n.get('operationUuid') === edit);
			editorPosition = {
				left: editNode.getIn(['position', 'x']),
				top: editNode.getIn(['position', 'y']),
			};
			resolveDataJson = editResolve.toJS();
			showEditor = true;
		}

		const argColors = resolveNodes.reduce((memo, current) => ({
			...memo,
			[current.get('operationUuid')]: current.get('color'),
		}), {});

		return <div onMouseUp={this.handleMouseUpOnCanvas} onMouseMove={this.handleMouseMove} style={{ position: 'relative' }} id="function-editor">
			{showEditor && (
				<ResolveParamsEditor style={{
					...editorPosition,
				}}
					{...resolveDataJson}
					argColors={argColors}
					onSave={(data) => this.handleSave(data)}
					onRemoveArg={(arg) => this.handleRemoveArg(resolveDataJson, arg)}
					onCancel={() => { this.setState({edit: null, }) }}
				/>
			)}
			<svg 
				width="1000"
				height="600"
				id="canvas"
				style={{
					cursor: 'pointer',
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
								if (block.get('type') !== 'string') {
									console.warn('Cant find node with ', block.toJS());
								}
								return null;
							}

							return (
								<ResolveNode
									key={blockIndex}
									block={block}
									node={node}
									index={blockIndex}
									over={over === block.get('uuid')}
									overAny={!!over}
									onMouseDown={this.handleMouseDownOnNode}
									onMouseUp={this.handleMouseUpOnNode}
									onMouseOver={this.handleMouseOver}
									onMouseOut={this.handleMouseOut}
								/>
							);
						})
					}
					{ this.state.dragToPosition && (() => {
						const node = this.state.resolveNodes.find(n => n.get('operationUuid') === this._dragFrom.uuid);

						if (!node) {
							console.warn('Unable to find node for ', this._dragFrom.uuid);
							return null;
						}

						const sourceLeft = node.getIn(['position', 'x']);
						const sourceTop = node.getIn(['position', 'y']);
						const targetLeft = this.state.dragToPosition.x;
						const targetTop = this.state.dragToPosition.y - 10;

						return (<path
							stroke="#cc9900"
							strokeWidth="2px"
							d={ `M${sourceLeft},${sourceTop} L ${targetLeft} ${targetTop}` } />
						);
						})()
					}
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