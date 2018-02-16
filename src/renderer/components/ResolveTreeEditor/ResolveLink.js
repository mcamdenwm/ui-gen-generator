import React from 'react';

export default ({ 
	color,
	opacity,
	sourceLeft,
	sourceTop,
	targetLeft,
	targetTop,
}) => {
	return (
		<path
			style={{
				opacity,
			}}
			stroke={color}
			strokeWidth="2px"
			d={ `M${sourceLeft},${sourceTop} L ${targetLeft} ${targetTop}` } />
	);
};