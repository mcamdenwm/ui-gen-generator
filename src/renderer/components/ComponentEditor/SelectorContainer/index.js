import React from 'react';
import { WMLink } from '@workmarket/front-end-components';
import SelectorEditor from './SelectorEditor';

const SelectorContainer = ({ selectors, props, editing, onClick, onUpdateSelector, onDeleteSelector }) => {
	let availableProps = props.filter(p => !(selectors.find(s => s.propName === p)));
	return (
		<div>
			{selectors.map( (selector, i) => (
				<div style={{
					marginLeft: 10,
				}} key={i}>
					{editing === selector.uuid && (
						<SelectorEditor
							props={availableProps}
							propName={selector.propName}
							selectorUuid={selector.uuid}
							onUpdate={(propName) => onUpdateSelector && onUpdateSelector(selector, propName)}
						/>
					)}
					{editing !== selector.uuid && (
						<div>
						<WMLink
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								onClick && onClick(selector.uuid)
							}}>{selector.propName || '(no prop selected)'}</WMLink>
						<button 
							style={{marginLeft: 2}}
							onClick={(e) => { e.stopPropagation(); onDeleteSelector && onDeleteSelector(selector.uuid) }}
						>
							x
						</button>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default SelectorContainer;