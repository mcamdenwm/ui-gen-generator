import { writeUIGenTree, resolver } from './';

export default (state, args, block) => {
	let argString = '';

	const argParts = args.reduce((memo, arg) => {
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
					console.log(treeArg, resolveArg, state);

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

	let blockName = block.get('name');

	if (block.get('type') === 'state') {
		blockName = 'state';
	}

	const truncatedPath = `${blockName}${!argString ? '' : `(${argString})`}`;
	const fullPath = `${blockName}${!argString ? '' : `(${argParts.join(',')})`}`;

	return {
		truncatedPath,
		fullPath,
	};
};