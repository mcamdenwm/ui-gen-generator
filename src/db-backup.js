const uuid = require('uuid/v4');

const getTreeAndPositions = () => {
	const toUpperUuid = uuid();
	const stateUuid = uuid();
	const concatUuid = uuid();
	const fn1Uuid = uuid();

	return {
		resolveTrees: [{
			name: 'fn1',
			uuid: fn1Uuid,
			trees: [{
				$$WM__resolve: {
					uuid: toUpperUuid,
					type: 'toUpper',
					args: [{
						$$WM__resolve: {
							uuid: stateUuid,
							type: 'state',
							path: ['FOO', 'bar', 'baz'],
						},
					}],
				},
			}, {
				$$WM__resolve: {
					uuid: concatUuid,
					type: 'concat',
					args: ['##']
				},
			}],
		}],
		resolveNodes: [{
			treeUuid: fn1Uuid,
			operationUuid: toUpperUuid,
			position: {
				x: 0,
				y: 0,
			},
			color: '#1b9e77',
		}, {
			treeUuid: fn1Uuid,
			operationUuid: stateUuid,
			position: {
				x: 0,
				y: 0,
			},
			color: '#d95f02',
		}, {
			treeUuid: fn1Uuid,
			operationUuid: concatUuid,
			position: {
				x: 0,
				y: 0,
			},
			color: '#7570b3',
		}],
	};
};

let treeAndPositions = getTreeAndPositions();

const db = {
	state: {
		view: {
			uuid: uuid(),
			type: 'WMGeneric',
			children: [{
				uuid: uuid(),
				type: 'WMButton',
				props: {
					label: 'Click Meh',
				}
			}]
		},
		...treeAndPositions,
	}
};

let result = JSON.stringify(db, null, 2);
console.log(result);

// console.log( `localStorage.setItem('db', \`${ result }\`)` );