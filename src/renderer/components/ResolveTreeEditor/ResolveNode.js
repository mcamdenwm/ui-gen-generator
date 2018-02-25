import React from 'react';
import { fromJS } from 'immutable';
import { writeUIGenTree, resolver, blockNameRenderer } from '../../utils';

export default ({ 
	block,
	node,
	index,
	over,
	overAny,
	onMouseDown,
	onMouseUp,
	onMouseOver,
	onMouseOut,
	storeState,
}) => {
	let args = block.get('args');
	const path = block.get('path');

	if (!args.size && path.size) {
		args = path;
	}

	const hasArgs = args && args.size;
	const argsContainOnlyLiterals = args.reduce((memo, arg) => (memo && arg.get('type') !== 'string'), true);

	const {
		truncatedPath,
		fullPath,
		resolvedBlock,
	} = blockNameRenderer(storeState, args, block);

	return (
		<g transform={`translate(${node.getIn(['position','x'])}, ${node.getIn(['position','y'])})`}
			onMouseDown={(e) => { onMouseDown(e, { args, uuid: block.get('uuid'), type: block.get('type') }) }}
			onMouseUp={(e) => { onMouseUp(e, { args, uuid: block.get('uuid'), type: block.get('type'), fullPath })}}
			onMouseOver={(e) => { onMouseOver(e, {uuid: block.get('uuid')} ) }}
			onMouseOut={(e) => { onMouseOut(e, {uuid: block.get('uuid')} ) }}
		>
			{ (!overAny || over) && (
				<text style={{
					textAnchor: truncatedPath.length > 10 ? 'middle' : 'start',
					fontFamily: 'monospace',
					fontSize: '12px',
					stroke: node.getIn(['color']),
					fill: node.getIn(['color']),
				}} transform="translate(-50, -50)">
					<tspan x="0" dy="1.2em">{over ? fullPath : truncatedPath}</tspan>
				</text>
			)}
			<circle
				r={10 + args.size * 5}
				fill={node.getIn(['color'])}
				style={{
					opacity: overAny && !over ? .2 : 1,
				}}
			/>
			{ over && (
				<g transform="translate(0, 50)">
					<text
						style={{
							textAnchor: 'middle',
							fontFamily: 'monospace',
							fontSize: '12px',
							stroke: node.getIn(['color']),
							fill: node.getIn(['color']),
						}}
					>{resolvedBlock}</text>
				</g>
			)}
		</g>
	);
}

