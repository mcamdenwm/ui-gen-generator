import React from 'react';
import { fromJS } from 'immutable';
import { writeUIGenTree, resolver, blockNameRenderer } from '../../utils';

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

	const state = {
		FOO: fromJS({
			bar: {
				baz: 'This is, foo, bar, baz   ',
			},
		}),
	};

	const {
		truncatedPath,
		fullPath,
	} = blockNameRenderer(state, args, block);

	return (
		<g transform={`translate(${node.getIn(['position','x'])}, ${node.getIn(['position','y'])})`}
			onMouseDown={(e) => { onMouseDown(e, { args, uuid: block.get('uuid'), type: block.get('type') }) }}
			onMouseUp={(e) => { onMouseUp(e, { args, uuid: block.get('uuid'), type: block.get('type'), fullPath })}}
			onMouseOver={(e) => { onMouseOver(e, {uuid: block.get('uuid')} ) }}
			onMouseOut={(e) => { onMouseOut(e, {uuid: block.get('uuid')} ) }}
		>
			<text style={{
				textAnchor: truncatedPath.length > 10 ? 'middle' : 'start',
				fontFamily: 'monospace',
				fontSize: '12px',
				stroke: node.getIn(['color']),
				fill: node.getIn(['color']),
			}} transform="translate(-50, -50)">
				<tspan x="0" dy="1.2em">{truncatedPath}</tspan>
			</text>
			<circle r={5 + args.size * 5} fill={node.getIn(['color'])} style={{opacity: node.getIn(['position','opacity'])}} />
		</g>
	);
}

