import React from 'react';
import { writeUIGenTree, resolver } from '../../utils';

export default ({ block, position, index }) => {
	const args = block.get('args');
	const hasArgs = args && args.size;
	const argsContainOnlyLiterals = args.reduce((memo, arg) => (memo && arg.get('type') !== 'string'), true);
	const blockName = block.get('name');

	let argParts = [];
	let argString = '';

	if (hasArgs) {
		argParts = args.reduce((memo, arg) => {
			const name = arg.get('name');
			const isString = arg.get('type') === 'string';
			let value = isString ? `'${name}'` : name;

			try {
				if (!isString && ( arg.get('type') === 'state' || arg.get('type') === 'fn')) {
					const treeArg = arg.toJS();
					if (arg.get('type') === 'state' && treeArg.path.length > treeArg.args.length)  {
						treeArg.args = treeArg.path;
					}
					
					if (treeArg.args.length) {
						const resolveArg = writeUIGenTree(treeArg);
						const resolvedArg = JSON.stringify( resolver(resolveArg)({state, args: [] }) );

						value = `'${resolvedArg}'`;
					}
				}										
			} catch (e) {
				console.warn('Failed to resolve block', e.message, block.toJS());
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
		<g transform={`translate(${position.position.left}, ${position.position.top})`}
			onMouseDown={(e) => { this.handleMouseDownOnNode(e, { args, blockName, uuid: position.uuid, type: block.get('type') }) }}
			onMouseUp={(e) => { this.handleMouseUpOnNode(e, { args, blockName, isResolvedComputation, uuid: position.uuid, type: block.get('type') })}}
			onMouseOver={(e) => { this.handleMouseOver(e, {uuid: position.uuid} ) }}
			onMouseOut={(e) => { this.handleMouseOut(e, {uuid: position.uuid} ) }}
		>
			<text style={{
				textAnchor: argString.length > 10 ? 'middle' : 'start',
				fontFamily: 'monospace',
				fontSize: '12px',
				stroke: position.color,
				fill: position.color,
			}} transform="translate(-50, -50)">
				<tspan x="0" dy="1.2em">{blockName}{!argString ? '' : `(${argString})`}</tspan>
			</text>
			<circle r={5 + argParts.length * 5} fill={position.color} style={{opacity: position.opacity}} />
		</g>
	);
}

