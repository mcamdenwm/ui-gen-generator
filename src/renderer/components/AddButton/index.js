import React from 'react';
import { WMFloatingActionButton, WMFontIcon } from '@workmarket/front-end-components';

export default (props) => (
	<WMFloatingActionButton {...props} mini style={{
		transform: 'scale(.5) translate(0, 20px)'
	}}>
		<WMFontIcon
			className="material-icons"
		>
			add
		</WMFontIcon>
	</WMFloatingActionButton>
);