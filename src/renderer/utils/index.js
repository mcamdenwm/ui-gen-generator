import { getResolver } from '@workmarket/ui-generation/dist-es/data';
import * as R from 'ramda';
const uuid = require('uuid/v4');
import { RESOLVE } from '../constants';
import _ from 'lodash';

import blockNameRenderer from './blockNameRenderer';

export { 
	blockNameRenderer,
};

// expand dis
export const resolver = getResolver({
	functions: {
		...R,
	},
});

export const walk = (stack, cb) => {
	function walker(node) {
		let block = {
			...node,
		};

		if (typeof node === 'string') {
			block = node;
		} else {
			if (node.args && node.args.length) {
				block.args = node.args.map(walker);
			}
			else if (node.path && node.path.length) {
				block.path = node.path.map(walker);
			}
			else if (node.children && node.children.length) {
				block.children = node.children.map(walker);
			}
		}

		return cb(block);
	}

	return walker(stack, cb);
}

export const writeUIGenTree = (functionTree) => {
	return walk(functionTree, (block) => {
		if (typeof block === 'string') {
			return block;
		}

		if (block.type === 'string') {
			return block.name;
		}

		if (block.type === 'state' && block.args && block.args.length) {
			block.path = block.args;
		}

		if (block._type && block._type === 'redux-action') {
			let mutBlock = {
				...block,
			};

			delete mutBlock.name;

			if (R.is(Array, mutBlock.data)) {
				mutBlock.data = writeUIGenTree(mutBlock.data[0]);
			}

			// delete mutBlock._type;

			return {
				...mutBlock,
			};
		}

		return {
			$$WM__resolve: {
				...block,
			},
		};
	});
}

// this be da right one
export const walkResolve = (stack, cb) => {
	function walker(node) {
		if (typeof(node) === 'string') {
			return cb({
				type: 'string',
				name: node,
				uuid: uuid(),
			});
		}

		let keys = Object.keys(node);
		if (keys[0] === RESOLVE) {
			return walker(node[RESOLVE]);
		}

		let block = Object.assign({}, node);

		if (block.args) {
			block.args = _.map(block.args, walker);
		}

		if (block.path) {
			block.path = _.map(block.path, walker);
		}

		return cb(block);
	}

	return walker(stack);
}

export const walkResolveTree = (tree) => {
	function walker(node) {
		if (typeof(node) === 'string') {
			return {
				type: 'string',
				name: node,
				uuid: uuid(),
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

	return walker(tree);
}