var app = angular.module('orthmarket', []);
app.controller("orthmarket-ctrl", function ($scope, $http) {

	$scope.notifications = [];
	notify = function (title, content) {
		$scope.notifications.push({
			title: title,
			content: content
		});
	}

	try {
		// Hacky way to preserve the metamask provider to web3 1.0
		web3 = new Web3(web3.currentProvider);
		MarketAddress = "0xebd6153141d41e9f3ccfe8f19396afd18da829f8";
		Market = new web3.eth.Contract(MarketABI, MarketAddress);
		$scope.noMetaMask = false;
	} catch {
		$scope.noMetaMask = true;
		notify("Error", "Metamask is not installed. Please install to continue.")
	}

	// Retrieves account.
	console.log("Starting")
	web3.eth.getAccounts((_, x) => {
		$scope.Account = x[0];
		console.log("Operating on:", x[0]);
		Market.options.from = x[0];
		web3.eth.defaultAccount = x[0];
		notify("Startup", "Retrieving Balance");
		$scope.getBalance();
		setInterval(() => {
			$scope.getBalance();
		}, 5000);
	});

	// Gets the contract owner, helps with tidying the UI. Changing this wouldn't have 
	// 	any effect since the checks are done on the contract side.
	Market.methods.getOwner().call().then(admin => {
		console.log("Contract owner:", admin);
		$scope.Administrator = admin;
		$scope.$apply();
	});

	repoPath = 'ipfs-1111'
	ipfs = new Ipfs({ repo: repoPath })


	$scope.formatJson = function (data) {
		return JSON.stringify(data, null, 2);
	}

	$scope.loadJsonData = function () {
		file = $("#submitNewItem").find("input").get(0).files[0];
		fr = new FileReader();
		fr.onload = function (e) {
			$scope.uploadable = true;
			r_data = e.target.result;
			j_data = JSON.parse(e.target.result);
			signature = sha256.update(r_data).hex();
			$scope.itemToUpload = { json: j_data, raw: r_data, signature: signature };
			console.log($scope.itemToUpload);

			Market.methods.getSignatureOwner(signature).call().then(result => {
				console.log(result);
				if (result.user != $scope.Account) {
					$scope.uploadStatus = "You don't own this item.";
					$scope.uploadable = false;
				}
				if (result.inMarket) {
					$scope.uploadStatus = "This item is already in the market.";
					$scope.uploadable = false;
				}
				if ($scope.uploadable) {
					$scope.uploadStatus = "Ready to submit."
				}
				$scope.$apply();
			});
		}
		fr.readAsText(file);

	}

	$scope.downloadJson = function (data) {
		url = `https://ipfs.io/ipfs/${data._d}`;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = function () {
			var status = xhr.status;
			if (status === 200) {
				download(xhr.response, data._signature + ".json");
			} else {
				console.log(xhr.status);
			}
		};
		xhr.send();
	}

	$scope.viewItem = function (index) {
		console.log(index);
		$scope.itemData = undefined;
		item = $scope.marketItems[index];
		$('#view-item').modal('open');
		getJSON(`https://ipfs.io/ipfs/${item._d}`, (resp, data) => {
			$scope.itemData = item;
			$scope.itemData.data = data;
			$scope.onViewIndex = index;
			console.log($scope.itemData);
		});

	}

	$scope.submitItem = function () {
		// Upload Data Part
		data = $scope.itemToUpload;
		console.log(data);
		ipfs.files.add(ipfs.types.Buffer(data.raw)).then(result => {
			result = result[0];
			url = `https://ipfs.io/ipfs/${result.hash}`;
			console.log(result.hash);
			Market.methods.addItem(
				data.json.name,
				Number.parseInt($scope.itemCost),
				result.hash,
				data.signature).send({ from: $scope.Account })
				.on('receipt', e => {
					console.log(e);
					notify("New Listing: Successful", `${data.json.name} is now up for sale!`);
					$scope.itemToUpload = undefined;
					$scope.populateMarket();
				})
				.on('error', e => {
					notify("New Listing: Error", e);
				})
		});
	}

	//$scope.Account = web3.eth.accounts[0];

	$scope.dismiss = function (index) {
		$scope.notifications.splice(index, 1);
	}

	$scope.getBalance = function () {
		Market.methods.myBalance().call().then((result) => {
			//console.log("Retrieving balance.");
			$scope.accountBalance = result.value;
			$scope.$apply();
		});
	}

	$scope.calculateEtherCost = function () {
		$scope.costInEther = $scope.buyOrthAmmount / 1000;
	}

	$scope.removeItem = function (index) {
		if ($scope.marketItems[index]._owner != $scope.Account) {
			M.toast({ html: 'You\'re not the owner of the item you want to remove.', classes: 'panel' });
		}
		Market.methods.removeItem(index).send({ from: $scope.Account })
			.on("receipt", success => {
				notify("Item Removal", "Successfully sent request to remove listing.");
				$scope.populateMarket();
			})
			.on("error", e => {
				notify("Error: Item Removal", e);
			});
	}

	$scope.purchaseOrth = function () {
		oneEth = 1000000000000000000
		Market.methods.buyOrth().send({
			from: $scope.Account,
			value: $scope.costInEther * oneEth
		}).on("receipt", (r) => {
			console.log("Purchase Success.");
			notify("Purchase Successful", "You have successfully purchased " + $scope.buyOrthAmmount + " orth.");
			$scope.buyOrthAmmount = 0;
		}).on("error", (e) => {
			console.log("--- Error: See Error Below ---");
			console.log(e);
			notify("Purchase Failed", "See console for more info.");
		});
		$('#purchase-confirm').modal('close');
	}

	$scope.purchaseItem = function () {
		item = $scope.itemData;
		data = $scope.itemData.data;
		index = $scope.onViewIndex;
		Market.methods.buyItem(index).send({ from: $scope.Account })
			.on('receipt', (r) => {
				notify("Purchase Successful", "You have successfully purchased " + item._name + ". The data has been downloaded, do not lose this.");
				$scope.downloadJson(item);
				$scope.populateMarket();
			}).on("error", (e) => {
				console.log("--- Error: See Error Below ---");
				console.log(e);
				notify("Purchase Failed", "See console for more info.");
			});
	}

	$scope.populateMarket = function () {
		$scope.marketItems = [];
		Market.methods.countWarehouse().call().then((count) => {
			for (i = 0; i < count; i++) {
				Market.methods.getItem(i).call().then((item) => {
					$scope.marketItems.push(item);
					console.log(item);
					$scope.$apply();
				});
			}
		});
	}

	$scope.AdminRegisterItem = function () {
		address = $scope.registerAddress;
		signature = $scope.registerSignature;
		Market.methods.registerItem(address, signature).send({ from: $scope.Account })
			.on('receipt', e => {
				notify("Item Register", "Successfully binded " + signature + " to " + address + ".");
			})
			.on('error', e => {
				notify("Error: Item Register", e)
			});
	}

	$scope.utilCanAfford = function (a, b){
		return Number.parseInt(a) >= Number.parseInt(b);
	}
	$scope.utilCantAfford = function (a, b){
		return Number.parseInt(a) < Number.parseInt(b);
	}

	notify("Startup", "Populating Market");
	$scope.populateMarket();

});

var getJSON = function (url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function () {
		var status = xhr.status;
		if (status === 200) {
			callback(null, xhr.response);
		} else {
			callback(status, xhr.response);
		}
	};
	xhr.send();
};


$(document).ready(function () {
	$('.modal').modal({ opacity: 1 });
	setTimeout(() => {
		$('.tooltipped').tooltip();
	}, 1000);

	$('.collapsed').next().slideToggle();
});
