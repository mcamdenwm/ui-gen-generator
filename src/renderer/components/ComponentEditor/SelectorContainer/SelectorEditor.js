import React from 'react';
import { WMAutocomplete, WMTextField } from '@workmarket/front-end-components';

export default ({ props, propName, onUpdate }) => {
	return (
		<div style={{marginBottom: 10}}>
			<WMAutocomplete
				floatingLabelText="PropName"
				hintText="label"
				dataSource={[].concat(props, propName)}
				filter="caseInsensitiveFilter"
				maxSearchResults={ 10 }
				onNewRequest={ (a) => { onUpdate && onUpdate(a); } }
				searchText={propName}
			/>
		</div>
	);
};