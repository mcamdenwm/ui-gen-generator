import React, { Component } from 'react';
import { WMTree } from '@workmarket/front-end-components';
import { compose, fromPairs, toPairs, map, range, trim, split } from 'ramda';
import _ from 'lodash';
import { fromJS, Map, List } from 'immutable';
import TreeUtils from 'immutable-treeutils';
import { hierarchy } from 'd3-hierarchy';
import { makeLib } from '@workmarket/ui-generation/dist-es/data/resolveFunctions';
import { getResolver, executor } from '@workmarket/ui-generation/dist-es/data';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemeDark2 } from 'd3-scale-chromatic';

import CurlyBracketLeft from './CurlyBracketLeft';
import CurlyBracketRight from './CurlyBracketRight';
import ParenthesisTonde from './ParenthesisTonde';
import LeftParenthesis from './LeftParenthesis';
import RightParenthesis from './RightParenthesis';
import LeftSquareBracket from './LeftSquareBracket';
import RightSquareBracket from './RightSquareBracket';
import ResolverEditor from './ResolverEditor';

const treeUtils = new TreeUtils(null, 'uuid', 'args');

const RESOLVE = '$$WM__resolve';

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
}

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
				uuid: '__',
			};
		}

		let keys = Object.keys(node);
		if (keys[0] === RESOLVE) {
			return walker(node[RESOLVE]);
		}

		let block = Object.assign({}, node);
		block.args = _.map(block.args, walker);

		return block;
	}

	return walker(stack);
}

function walk(stack, cb) {
	function walker(node) {
		let block = Object.assign({}, node);

		if (typeof node === 'string') {
			block = node;
		} else {
			if (node.args) {
				block.args = _.map(node.args, walker);
			}			
		}

		return cb(block);
	}

	return walker(stack, cb);
}

// var color = scaleLinear()
//     .domain([1, 60])
//     .range(["green", "steelblue"]);

var color = scaleOrdinal(schemeDark2);

console.log(color(0), color(1), color(2));

/*
 This is really a ResolverEditor(Tree), it visualizes a resolve composition
 */

class FunctionEditor extends Component {
	state: {}
	componentWillMount() {
		this.props.functions && this.setFunctions(this.props.functions, this.props.functionPositions);
	}
	componentWillReceiveProps(nextProps) {
		nextProps.functions && this.setFunctions(nextProps.functions, nextProps.functionPositions);
	}
	generateState(functions, functionPositions) {
		let parsedFns = functions;
		if (typeof functions === 'string') {
			parsedFns = JSON.parse(functions);
		}

		const resolvedTree = walkResolve(parsedFns);
		const resolvedTreeWithComputation = {
			name: JSON.stringify(resolver(parsedFns)({state, args: [] })),
			args: [ resolvedTree ],
			uuid: 'resolved-computation',
		};

		const functionTree = fromJS(resolvedTreeWithComputation);
		const functionLinks = hierarchy(resolvedTreeWithComputation, d => d.args).links();

		let finalSegment = functionPositions.find(f => f.uuid === resolvedTreeWithComputation.args[0].uuid);

		let rootPosition = {
			uuid: 'resolved-computation',
			position: {
				left: 200 + finalSegment.position.left,
				top: finalSegment.position.top,
			},
		}

		const functionTreeAsNodes = treeUtils.nodes(functionTree).map(path => functionTree.getIn(path));
		return {
			functions: parsedFns,
			functionPositions: this.assignColor(functionPositions.concat(rootPosition)),
			functionTree,
			functionLinks,
			functionTreeAsNodes,
		};
	}
	setFunctions(functions, functionPositions) {
		this.setState(this.generateState(functions, functionPositions));
	}

	writeUIGenTree(functionTree) {
		// let resolveStack;

		return walk(functionTree, (block) => {
			if (typeof block === 'string') {
				return block;
			}

			if (block.type === 'string') {
				return block.name;
			}

			if (block.type === 'state') {
				block.path = block.args;
				delete block.args;
			}

			return {
				$$WM__resolve: {
					...block,
				},
			};
		});
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

			// if (overChildNodes && overChildNodes.find(n => n.get('uuid') === position.uuid)) {
			// 	positionOpacity = .1;
			// }
			
			if (overNode && overNode !== position.uuid) {
				positionOpacity = .1;
			}

			// if (this.state && this.state.over && this.state.over === position.uuid) {
			// 	let childNodeSeq = treeUtils.childNodes(this.state.functionTree, this.state.over);
				
			// }
			// const c = color((i+1) * 40);
			position.color = color(i);
			position.opacity = positionOpacity;
			return position;
		});
	}

	showResolverEditor = (e, params) => {
		const container = document.getElementById('function-editor');

		// links are the args of the fn, so we can extract the arg color from the links
		const argColors = this.state.functionLinks.filter(link => link.source.data.uuid === params && params.uuid)
			.reduce((memo, link) => {
				if (link.target.data.uuid === '__') {
					return null;
				}
				const target = this.state.functionPositions.find(n => n.uuid === link.target.data.uuid);

				return {
					...memo,
					[target.uuid]: target.color,
				};
			}, {});
		
		const newNode = {
			uuid: 'new',
			name: 'state',
			args: fromJS([
				{type: 'string', name: 'FOO'},
				{type: 'string', name: 'bar'}, 
				{type: 'string', name: 'baz'},
			]),
			type: 'state',
		};

		const newPositions = [].concat(this.state.functionPositions);
		let newFunctionTreeAsNodes = this.state.functionTreeAsNodes;

		const translateX = 500;
		const translateY = 500;

		if (!params) {
			newPositions.push({
				position: {
					left: (e.clientX - container.offsetLeft) - translateX,
					top: (e.clientY) - translateY,
				},
				uuid: 'new',
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
			functionPositions: this.assignColor(newPositions),
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

	handleMouseUpOnNode = (e, params) => {
		this.stopPropOfEditor = true;
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

				this.setFunctions(uiGenTree, this.state.functionPositions);
			}

			this._dragFrom = null;
		} else {
			// Click (or otherwise mouseup) on node
			if(!params.isResolvedComputation) {
				e.preventDefault();
				e.stopPropagation();
				this.showResolverEditor(e, {
					uuid: params.uuid
				});
			}
		}
		
		// console.log('handleMouseUpOnNode', e, params);
	}

	handleRemoveArg = (params, arg) => {
		let argSeq = treeUtils.find(this.state.functionTree, n => n.get('uuid') === arg.uuid && n.get('name') === arg.name);
		let fn = this.state.functionTree.getIn(argSeq);
		let resolverTree = this.state.functionTree.removeIn(argSeq);
		
		const uiGenTree = this.writeUIGenTree(resolverTree.toJS().args[0]);
		const newState = this.generateState(uiGenTree, this.state.functionPositions);

		this.setState({
			...newState,
			// Removing arg shouldnt remove node
			functionTreeAsNodes: newState.functionTreeAsNodes.push(fn),
		})
	}

	handleMouseOver = (e, { uuid }) => {
		// this isnt quite what I wanted
		// return;
		console.log(`over ${uuid}`);
		this.setState({
			over: uuid,
			functionPositions: this.assignColor(this.state.functionPositions, uuid),
		});
	}

	handleMouseOut = (e, { uuid }) => {
		// this isnt quite what I wanted
		// return;
		console.log(`out of ${uuid}`);
		this.setState({
			over: null,
			functionPositions: this.assignColor(this.state.functionPositions, null),
		});
	}	

	render() {
		const {
			functionPositions,
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

		if (editorParams) {
			// let resolveSeq = treeUtils.byId(this.state.functionTree, editorParams.uuid)
			let resolveData = functionTreeAsNodes.find(n => n.get('uuid') === editorParams.uuid);
			resolveDataJson = resolveData.toJS();
		}

		return <div style={{ position: 'relative' }} id="function-editor">
			{showEditor && (
				<ResolverEditor style={{
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
			<svg width="1000" height="600" onClick={(e) => {
				if (!this.stopPropOfEditor) {
					this.showResolverEditor(e, null);
				}
				this.stopPropOfEditor = false;
			} } style={{
				userSelect: 'none',
				background: `rgb(41, 45, 62)`,
			}}>
				<g transform="translate(500, 500)">
					{
						functionLinks.map((link, i) => {
							if (link.target.data.uuid === '__') {
								return null;
							}
							const target = functionPositions.find(n => n.uuid === link.target.data.uuid);
							const source = functionPositions.find(n => n.uuid === link.source.data.uuid);

							let sourceLeft = source.position.left;
							let sourceTop = source.position.top;
							let targetLeft = target.position.left;
							let targetTop = target.position.top;
							let pathColor = target.color;
							let pathOpacity = 1;

							if (over && (over !== source.uuid || over === target.uuid)) {
								pathOpacity = .1;
							}

							return (
							<path
								style={{
									opacity: pathOpacity,
								}}
								stroke={pathColor}
								strokeWidth="2px"
								d={ `M${sourceLeft},${sourceTop} L ${targetLeft} ${targetTop}` } />
							);
						})
					}
					{
						functionPositions.map((fnPosition, i) => {
							const fn = functionTreeAsNodes.find((n) => {
								return n.get('uuid') === fnPosition.uuid
							});
							if (!fn) {
								console.error('Cant find fnPosition', fnPosition);
								return;
							}
							const args = fn.get('args');
							const hasArgs = args && args.size;
							let name = fn.get('name');
							const isResolvedComputation = fn.get('uuid') === 'resolved-computation';

							const argsContainOnlyLiterals = args.reduce((memo, arg) => (memo && arg.get('type') !== 'string'), true);
							let argPartParts = null;
							let argParts = [];
							let argString = '';

							if (hasArgs && !isResolvedComputation) {
								argParts = args.reduce((memo, arg) => {
									const name = arg.get('name');
									const isString = arg.get('type') === 'string';
									let value = isString ? `'${name}'` : name;

									if (!isString && ( arg.get('type') === 'state' || arg.get('type') === 'fn')) {
										const treeArg = arg.toJS();
										if (arg.get('type') === 'state' && treeArg.path.length > treeArg.args.length)  {
											treeArg.args = treeArg.path;
										}
										
										if (treeArg.args.length) {

											const resolveArg = this.writeUIGenTree(treeArg);
											const resolvedArg = JSON.stringify( resolver(resolveArg)({state, args: [] }) );

											value = `'${resolvedArg}'`;
										}
									}

									memo.push(value);
									return memo;
								}, []);

								argString = argParts.join(',');
								if (argString.length > 15) {
									argString = argString.substring(0, 15) + '…';
								}

							}

							return (
								<g transform={`translate(${fnPosition.position.left}, ${fnPosition.position.top})`}
									onMouseDown={(e) => { this.handleMouseDownOnNode(e, { args, name, uuid: fnPosition.uuid, type: fn.get('type') }) }}
									onMouseUp={(e) => { this.handleMouseUpOnNode(e, { args, name, isResolvedComputation, uuid: fnPosition.uuid, type: fn.get('type') })}}
									onMouseOver={(e) => { this.handleMouseOver(e, {uuid: fnPosition.uuid} ) }}
									onMouseOut={(e) => { this.handleMouseOut(e, {uuid: fnPosition.uuid} ) }}
								>
									<text style={{
										textAnchor: argString.length > 10 ? 'middle' : 'start',
										fontFamily: 'monospace',
										fontSize: '12px',
										stroke: fnPosition.color,
										fill: fnPosition.color,
									}} transform="translate(-50, -50)">
										<tspan x="0" dy="1.2em">{name}{!argString ? '' : `(${argString})`}</tspan>
									</text>
									<circle r={5 + argParts.length * 5} fill={fnPosition.color} style={{opacity: fnPosition.opacity}} />
								</g>
							);
						})
					}
					{
						functionLinks.reverse().map((link, i) => {
							return null;

							if (link.target.data.uuid === '__' || link.source.data.uuid === 'resolved-computation') {
								return null;
							}
							const target = functionPositions.find(n => n.uuid === link.target.data.uuid);
							const source = functionPositions.find(n => n.uuid === link.source.data.uuid);

							let sourceLeft = source.position.left;
							let sourceTop = source.position.top;
							{/*let targetLeft = target.position.left;*/}
							{/*let targetTop = target.position.top;*/}
							const degreesPerArc = 360 / functionLinks.length;
							const offsetAngle = 50;
							const startAngle = (i*degreesPerArc) + offsetAngle;
							const endAngle = ((i*degreesPerArc) + degreesPerArc) + offsetAngle;

							const arc = describeArc(sourceLeft, sourceTop, 30, startAngle, endAngle);

							return (
							<path
								stroke={target.color}
								strokeWidth="2px"
								fill="none"
								d={ arc } />
							);
						})
					}
				</g>
			</svg>
		</div>
	}
}

export default FunctionEditor;