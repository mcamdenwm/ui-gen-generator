import React, { Component } from 'react';
import { WMTree } from '@workmarket/front-end-components';
import { compose, fromPairs, toPairs, map, range, trim, split } from 'ramda';
import _ from 'lodash';
import { fromJS } from 'immutable';
import TreeUtils from 'immutable-treeutils';
import { hierarchy } from 'd3-hierarchy';
import { makeLib } from '@workmarket/ui-generation/dist-es/data/resolveFunctions';
import { getResolver, executor } from '@workmarket/ui-generation/dist-es/data';
import { scaleLinear } from 'd3-scale';

import CurlyBracketLeft from './CurlyBracketLeft';
import CurlyBracketRight from './CurlyBracketRight';

const treeUtils = new TreeUtils(null, 'uuid', 'args');

const RESOLVE = '$$WM__resolve';

const state = {
	REDUCER: fromJS({}),
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
    .domain([10, 40])
    .range(["red", "steelblue"]);

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

		this.setState({
			functions: parsedFns,
			functionPositions: functionPositions.concat(rootPosition),
			functionTree,
			functionLinks,
		});
	}
	render() {
		const {
			functionPositions,
			functionTree,
			functionLinks
		} = this.state;

		return <div>
			<svg width="1000" height="600">
				<g transform="translate(500, 500)">
					{
						functionLinks.map(link => {
							if (link.target.data.uuid === '__') {
								return null;
							}
							const target = functionPositions.find(n => n.uuid === link.target.data.uuid);
							const source = functionPositions.find(n => n.uuid === link.source.data.uuid);

							const path = treeUtils.byId(functionTree, target.uuid);
							const depth = path.size;
							const c = color((depth+1) * 10);

							return (
							<path
								stroke={c}
								strokeWidth="2px"
								d={ `M${source.position.left},${source.position.top} L ${target.position.left} ${target.position.top}` } />
							);
						})
					}
					{
						functionPositions.map(fnPosition => {
							const path = treeUtils.byId(functionTree, fnPosition.uuid);
							const fn = functionTree.getIn(path);
							if (!fn) {
								console.log('no fn at path', path, fn, fnPosition.uuid);
							}
							const args = fn.get('args');
							const hasArgs = args && args.size;
							const depth = path.size;
							const c = color((depth+1) * 10);
							let name = fn.get('name');
							const isResolvedComputation = fn.get('uuid') === 'resolved-computation';

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
								<g transform={`translate(${fnPosition.position.left}, ${fnPosition.position.top})`}>
									{!isResolvedComputation && (
										<circle r="30" fill="none" stroke="steelblue" strokeWidth="2px" />
									)}
									{isResolvedComputation && (
										<g transform="scale(.2)">
											<g transform="translate(0, -100)">
												<CurlyBracketLeft fill={c} />
											</g>
											<g transform="translate(200, -100)">
												<CurlyBracketRight fill={c} />
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
											<circle r="4.5" fill={c} />
										</g>
									)}
									{!hasArgs && !isResolvedComputation && (
										<g>
											<circle r="1.5" fill={c} />
										</g>
									)}
								</g>
							);
						})
					}
				</g>
			</svg>
		</div>
	}
}

export default FunctionEditor;