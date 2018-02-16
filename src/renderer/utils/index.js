import { getResolver } from '@workmarket/ui-generation/dist-es/data';
import * as R from 'ramda';

const uuid = require('uuid/v4');

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
			if (node.args) {
				block.args = node.args.map(walker);
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

		if (block.type === 'state') {
			block.path = block.args;
			delete block.args;
		}

		return {
			$$WM__resolve: {
				...block,
			},
		};
	});
}

function walkResolve(stack, cb) {
	function walker(node) {
		if (typeof(node) === 'string') {
			return {
				type: 'string',
				name: node,
				uuid: '__',
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