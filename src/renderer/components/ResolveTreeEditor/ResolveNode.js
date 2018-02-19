import React from 'react';
import { fromJS } from 'immutable';
import { writeUIGenTree, resolver } from '../../utils';

export default ({ 
	block,
	node,
	index,
	onMouseDown,
	onMouseUp,
	onMouseOver,
	onMouseOut,
}) => {
	let args = block.get('args');
	const path = block.get('path');

	if (!args.size && path.size) {
		args = path;
	}

	const hasArgs = args && args.size;
	const argsContainOnlyLiterals = args.reduce((memo, arg) => (memo && arg.get('type') !== 'string'), true);
	let blockName = block.get('name');

	if (block.get('type') === 'state') {
		blockName = 'state';
	}

	const state = {
		FOO: fromJS({
			bar: {
				baz: 'This is, foo, bar, baz   ',
			},
		}),
	};

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
						let resolvedArg = JSON.stringify( resolver(resolveArg)({state, args: [] }) );
						
						if (!resolvedArg) {
							value = `${treeArg.name}()`;
						} else {
							value = `'${resolvedArg}'`;
						}
					}
				}										
			} catch (e) {
				console.warn('Failed to resolve block', e.message, block.toJS());
			}

			memo.push(value);
			return memo;
		}, []);

		argString = argParts.join(',');
		if (argString.length > 10) {
			argString = argString.substring(0, 10) + '…';
		}
	}

	const truncatedPath = `${blockName}${!argString ? '' : `(${argString})`}`;
	const fullPath = `${blockName}${!argString ? '' : `(${argParts.join(',')})`}`;

	return (
		<g transform={`translate(${node.getIn(['position','x'])}, ${node.getIn(['position','y'])})`}
			onMouseDown={(e) => { onMouseDown(e, { args, blockName, uuid: block.get('uuid'), type: block.get('type') }) }}
			onMouseUp={(e) => { onMouseUp(e, { args, blockName, uuid: block.get('uuid'), type: block.get('type'), fullPath })}}
			onMouseOver={(e) => { onMouseOver(e, {uuid: block.get('uuid')} ) }}
			onMouseOut={(e) => { onMouseOut(e, {uuid: block.get('uuid')} ) }}
		>
			<text style={{
				textAnchor: argString.length > 10 ? 'middle' : 'start',
				fontFamily: 'monospace',
				fontSize: '12px',
				stroke: node.getIn(['color']),
				fill: node.getIn(['color']),
			}} transform="translate(-50, -50)">
				<tspan x="0" dy="1.2em">{truncatedPath}</tspan>
			</text>
			<circle r={5 + argParts.length * 5} fill={node.getIn(['color'])} style={{opacity: node.getIn(['position','opacity'])}} />
		</g>
	);
}

