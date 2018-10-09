var app = angular.module('orthmarket', []);
app.controller("orthmarket-ctrl", function ($scope, $http) {
    try {
        web3 = new Web3("ws://localhost:8545");
        MarketAddress = "0x0bdf95bb4dd64485ab211b45c7e5fabb6af74f93";
        Market = new web3.eth.Contract(MarketABI, MarketAddress);
        $scope.noMetaMask = false;
    } catch {
        $scope.noMetaMask = true;
        notify("Error", "Metamask is not installed. Please install to continue.")
    }
    
    // Retrieves account.
    $scope.notifications = [];
    console.log("Starting")
    web3.eth.getAccounts((_, x) => {$scope.Account = x[0]});
    //$scope.Account = web3.eth.accounts[0];


    notify = function (title, content) {
        $scope.notifications.push({
            title: title,
            content: content
        });
    }

    $scope.dismiss = function (index) {
        $scope.notifications.splice(index, 1);
    }

    $scope.getBalance = function (){
        Market.methods.myBalance().call().then((result) => {
            $scope.accountBalance = result.value
            $scope.$apply();
        });
    }

    $scope.calculateEtherCost = function () {
        $scope.costInEther = $scope.buyOrthAmmount / 1000;
    }

    $scope.purchaseOrth = function () {
        oneEth = 1000000000000000000
        Market.methods.buyOrth().send({
                from: $scope.Account, 
                value: $scope.costInEther * oneEth
            }).on("receipt", (r) => {
                console.log("Purchase Success.");
                notify("Purchase Successful", "You have successfully purchased "+$scope.buyOrthAmmount+" orth.");
                $scope.getBalance();
                $scope.buyOrthAmmount = 0;
            }).on("error", (e) => {
                console.log("--- Error: See Error Below ---");
                console.log(e);
                notify("Purchase Failed", "See console for more info.");
            });
    }
    
    $scope.populateMarket = function (){
        $scope.marketItems = [];
        Market.methods.countWarehouse().call().then((count) => {
            for(i=0; i<count; i++){
                Market.methods.getItem(0).call().then((item) => {
                    $scope.marketItems.push(item);
                    console.log(item);
                    $scope.$apply();
                });
            }
        });
    }

    notify("Startup", "Retrieving Balance");
    $scope.getBalance();
    notify("Startup", "Populating Market");
    $scope.populateMarket();

});


MarketABI = [
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

$(document).ready(function () {
    $('.modal').modal({ opacity: 1 });
});


