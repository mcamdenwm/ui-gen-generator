import PropTypes from 'prop-types';
// import { map, reduce } from 'ramda';

function getType(type) {
  if (type === PropTypes.array) return 'array';
  if (type === PropTypes.bool) return 'bool';
  if (type === PropTypes.func) return 'func';
  if (type === PropTypes.number) return 'number';
  if (type === PropTypes.object) return 'object';
  if (type === PropTypes.string) return 'string';
  if (type === PropTypes.symbol) return 'symbol';
  if (type === PropTypes.node) return 'node';
  if (type === PropTypes.element) return 'element';
	
	// @todo arrayOf, oneOf, instanceOf, 
}

function getTypeIsRequired(type, resolvedType) {
	if (!resolvedType) {
		return false;
	}

	return PropTypes[resolvedType].isRequired === type.isRequired;
}

export default (propTypes) => {
	const keys = Object.keys(propTypes);

	return keys.reduce((memo, key) => {
		const resolvedType = getType(propTypes[key]);
		return {
			...memo,
			[key]: {
				type: resolvedType,
				isRequired: getTypeIsRequired(propTypes[key], resolvedType),
			},
		};
	}, {});
};