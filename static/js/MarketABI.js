MarketABI =[
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_value",
				"type": "uint256"
			},
			{
				"name": "_d",
				"type": "string"
			},
			{
				"name": "_signature",
				"type": "string"
			}
		],
		"name": "addItem",
		"outputs": [
			{
				"name": "succesful",
				"type": "bool"
			},
			{
				"name": "returnMessage",
				"type": "string"
			},
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "buyItem",
		"outputs": [
			{
				"name": "succesful",
				"type": "bool"
			},
			{
				"name": "data",
				"type": "string"
			},
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_value",
				"type": "uint256"
			},
			{
				"name": "_d",
				"type": "string"
			},
			{
				"name": "_signature",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "buyOrth",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "txid",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "string"
			}
		],
		"name": "Log",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "ammount",
				"type": "uint256"
			}
		],
		"name": "payoutOrth",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "recipient",
				"type": "address"
			},
			{
				"name": "signature",
				"type": "string"
			}
		],
		"name": "registerItem",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "removeItem",
		"outputs": [
			{
				"name": "succesful",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "txid",
				"type": "string"
			},
			{
				"name": "recipient",
				"type": "address"
			},
			{
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "sendCredits",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "countWarehouse",
		"outputs": [
			{
				"name": "count",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "user",
				"type": "address"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"name": "dest",
				"type": "address"
			},
			{
				"name": "value",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getItem",
		"outputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_value",
				"type": "uint256"
			},
			{
				"name": "_d",
				"type": "string"
			},
			{
				"name": "_signature",
				"type": "string"
			},
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"name": "owner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "signature",
				"type": "string"
			}
		],
		"name": "getSignatureOwner",
		"outputs": [
			{
				"name": "user",
				"type": "address"
			},
			{
				"name": "inMarket",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "myBalance",
		"outputs": [
			{
				"name": "dest",
				"type": "address"
			},
			{
				"name": "value",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]