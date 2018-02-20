export default {
	"view": {
		"uuid": "c6dbad4e-b6bf-4c8e-b912-50d28b1fe0d1",
		"type": "WMGeneric",
		"children": [
			{
				"uuid": "fa9481d8-4fda-41f4-87cb-34b6a3083a99",
				"type": "WMFlatButton",
			}
		]
	},
	"resolveTrees": `[
		{
			"name": "fn1",
			"uuid": "a8d21da4-6aae-496d-a9e5-bb829b5588b8",
			"componentUuid": "fa9481d8-4fda-41f4-87cb-34b6a3083a99",
			"type": "selector",
			"propName": "label",
			"trees": [
				{
					"$$WM__resolve": {
						"uuid": "00317797-60b0-48e7-a2d3-cb36bd005451",
						"type": "fn",
						"name": "toUpper",
						"args": [
							{
								"$$WM__resolve": {
									"uuid": "39da4a6e-1bff-4c9f-bf22-b852e97bda11",
									"type": "state",
									"path": [
										"FOO",
										"bar",
										"baz"
									]
								}
							}
						]
					}
				},
				{
					"$$WM__resolve": {
						"uuid": "3311e4c3-a422-4771-ad31-0dce1fdda769",
						"type": "fn",
						"name": "concat",
						"args": [
							"!"
						]
					}
				}
			]
		}
	]`,
	"resolveNodes": [
		{
			"treeUuid": "a8d21da4-6aae-496d-a9e5-bb829b5588b8",
			"operationUuid": "00317797-60b0-48e7-a2d3-cb36bd005451",
			"position": {
				"x": 350,
				"y": 100
			},
			"color": "#1b9e77"
		},
		{
			"treeUuid": "a8d21da4-6aae-496d-a9e5-bb829b5588b8",
			"operationUuid": "39da4a6e-1bff-4c9f-bf22-b852e97bda11",
			"position": {
				"x": 200,
				"y": 100
			},
			"color": "#d95f02"
		},
		{
			"treeUuid": "a8d21da4-6aae-496d-a9e5-bb829b5588b8",
			"operationUuid": "3311e4c3-a422-4771-ad31-0dce1fdda769",
			"position": {
				"x": 500,
				"y": 100
			},
			"color": "#7570b3"
		}
	],
	"store": {
		"FOO": {
			"bar": {
				"baz": "Ayyyoooo",
			}
		}
	},
};