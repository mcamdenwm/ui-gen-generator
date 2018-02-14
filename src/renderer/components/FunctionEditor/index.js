import React, { Component } from 'react';
import { WMTree } from '@workmarket/front-end-components';
import { compose, fromPairs, toPairs, map, range, trim, split } from 'ramda';
import _ from 'lodash';
import { fromJS, Map, List } from 'immutable';
import TreeUtils from 'immutable-treeutils';
import { hierarchy } from 'd3-hierarchy';
import { makeLib } from '@workmarket/ui-generation/dist-es/data/resolveFunctions';
import { getResolver, executor } from '@workmarket/ui-generation/dist-es/data';
import { scaleLinear } from 'd3-scale';

import CurlyBracketLeft from './CurlyBracketLeft';
import CurlyBracketRight from './CurlyBracketRight';
import ParenthesisTonde from './ParenthesisTonde';
import LeftParenthesis from './LeftParenthesis';
import RightParenthesis from './RightParenthesis';
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
			baz: 'x,y, x, z ',
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

var color = scaleLinear()
    .domain([1, 60])
    .range(["green", "steelblue"]);

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
	setFunctions(functions, functionPositions) {
		const parsedFns = JSON.parse(functions);

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
				left: 120 + finalSegment.position.left,
				top: finalSegment.position.top,
			},
		}

		const functionTreeAsNodes = treeUtils.nodes(functionTree).map(path => functionTree.getIn(path));

		this.setState({
			functions: parsedFns,
			functionPositions: this.assignColor(functionPositions.concat(rootPosition)),
			functionTree,
			functionLinks,
			functionTreeAsNodes,
		});
	}

	assignColor(positions) {
		return positions.map((position, i) => {
			const c = color((i+1) * 40);
			position.color = c;
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
		console.log('handleMouseDownOnNode', e, params);
	}

	handleMouseUpOnNode = (e, params) => {
		this.stopPropOfEditor = true;
		if (this._dragFrom.uuid !== params.uuid) {
			// Drag from node
			e.preventDefault();
			e.stopPropagation();

			this._dragFrom = null;
		} else {
			// Click (or otherwise mouseup) on node
			// debugger;
			if(!params.isResolvedComputation) {
				e.preventDefault();
				e.stopPropagation();
				this.showResolverEditor(e, params);
			}
		}
		
		console.log('handleMouseUpOnNode', e, params);
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
		} = this.state;

		return <div style={{ position: 'relative' }} id="function-editor">
			{showEditor && (
				<ResolverEditor style={{
					left: position.x,
					top: position.y,
				}}
					type={editorParams.type}
					args={editorParams.args && editorParams.args.toJS()}
					argColors={argColors}
					onSave={() => this.handleSave(editorParams)}
				/>
			)}
			<svg width="1000" height="600" onClick={(e) => {
				if (!this.stopPropOfEditor) {
					this.showResolverEditor(e, null);
				}
				this.stopPropOfEditor = false;
			} }>
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

							return (
							<path
								stroke={target.color}
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
							const args = fn.get('args');
							const hasArgs = args && args.size;
							let name = fn.get('name');
							const isResolvedComputation = fn.get('uuid') === 'resolved-computation';

							const argsContainOnlyLiterals = args.reduce((memo, arg) => (memo && arg.get('type') !== 'string'), true);

							if (hasArgs && !isResolvedComputation) {
								const argParts = args.reduce((memo, arg) => {
									const name = arg.get('name');
									const isString = arg.get('type') === 'string';

									if (isString) {
										memo.push(`'${name}'`);
									} else {
										memo.push(name);
									}
									return memo;
								}, []);

								const argString = argParts.join(',');
								name += `(${argString})`;
							}

							return (
								<g transform={`translate(${fnPosition.position.left}, ${fnPosition.position.top})`}
									onMouseDown={(e) => { this.handleMouseDownOnNode(e, { args, name, uuid: fnPosition.uuid, type: fn.get('type') }) }}
									onMouseUp={(e) => { this.handleMouseUpOnNode(e, { args, name, isResolvedComputation, uuid: fnPosition.uuid, type: fn.get('type') })}}
								>
									{!isResolvedComputation && (
										<circle r="30" fill="white" stroke={fnPosition.color} strokeWidth="2px" />
									)}
									{isResolvedComputation && (
										<g transform="scale(.2)">
											<g transform="translate(0, -100)">
												<CurlyBracketLeft fill="#004499" />
											</g>
											<g transform="translate(200, -100)">
												<CurlyBracketRight fill="#004499" />
											</g>
										</g>
									)}
									<text style={{
										textAnchor: !isResolvedComputation ? 'end' : 'start',
										fontFamily: 'monospace',
										fontSize: '11px',
									}} y="-40">
										{name}
									</text>
									{hasArgs && !isResolvedComputation && (
										<g>
											<circle r="4.5" fill={fnPosition.color} />
										</g>
									)}
									{!hasArgs && !isResolvedComputation && (
										<g>
											<circle r="1.5" fill={fnPosition.color} />
										</g>
									)}
								</g>
							);
						})
					}
					{
						functionLinks.reverse().map((link, i) => {
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