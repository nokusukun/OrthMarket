pragma solidity ^0.4.7;
contract OrthMarket {
    
    event Log (string txid, string value);
    
    struct Item {
        string name;        // Item name
        uint value;         // Item Cost1
        string d;           // Hash for IPFS data
        string signature;   // Item Hash
        address owner;      // Owner
    }
    
    struct ItemState {
        address owner;      
        bool inMarket;
    }
    
    address administrator;
    Item[] Warehouse;
    mapping(address => uint) Balance;
    
    mapping(string => ItemState) Ownership;
    // Item.signature => ItemState
    
    uint lastIndex;
    
    function OrthMarket() public {
        administrator = msg.sender;
        lastIndex = 0;
    }

    modifier inlimits() {
        require(msg.value >= 1 finney);
        require(msg.value % 1 finney == 0);
        _;
    }
    
    function getOwner() public view returns(address owner){
        owner = administrator;
    }
    
    function buyOrth() public payable inlimits{
        Balance[msg.sender] += msg.value / 1 finney;
    }
    
    function payoutOrth(uint ammount) public payable {
        msg.sender.transfer(ammount * 1 finney);
        Balance[msg.sender] -= ammount;
    }
    
    function sendCredits(string txid, address recipient, uint value) public {
        if(msg.sender == administrator){
            Balance[recipient] += value;
            
            emit Log(txid, "OK:Sucessfuly sent ammount.");
        }else{
            if(Balance[msg.sender] < value){
                emit Log(txid, "ERROR:Not enough balance.");
            }else{
                Balance[recipient] += value;
                Balance[msg.sender] -= value;
                emit Log(txid, "OK:Sucessfuly sent ammount.");
            }
        }
    }
    
    function registerItem(address recipient, string signature) public{
        if(msg.sender == administrator){
            Ownership[signature].owner = recipient;
        }
        
    }
    
    function myBalance() view public returns (address dest, uint value){
        dest = msg.sender;
        value = Balance[msg.sender];
    }
    
    function getBalance(address user) view public returns (address dest, uint value){
        dest = user;
        value = Balance[user];
    }
    
    function countWarehouse() view public returns (uint count){
        count = Warehouse.length;
    }
    
    function getItem(uint index) view public returns (
        string _name, 
        uint _value,
        string _d,
        string _signature,
        address _owner
        )
    {
        require(index != lastIndex, "This index is empty.");
        Item storage item = Warehouse[index];
        require(Ownership[item.signature].inMarket, "Item is not for sale.");
        _name = item.name;
        _value = item.value;
        _d = item.d;
        _signature = item.signature;
        _owner = item.owner;
    }
    
    function addItem(
        string _name, 
        uint _value,
        string _d,
        string _signature
        ) public returns (bool succesful, string returnMessage, uint index)
    {
        if(Ownership[_signature].owner != msg.sender){
            succesful = false;
            returnMessage = "Item signature not registered to message sender.";
            return;
        }
        if(Ownership[_signature].inMarket){
            succesful = false;
            returnMessage = "Item already in the market.";
        }
        Item memory item;
        item.name = _name;
        item.value = _value;
        item.d = _d;
        item.signature = _signature;
        item.owner = msg.sender;
        if(Warehouse.length == lastIndex){
            Warehouse.push(item);
            lastIndex += 1;
        }else{
            Warehouse[lastIndex] = item;
            lastIndex += 1;
        }
        index = lastIndex - 1;
        succesful = true;
        returnMessage = "Item put up for sale.";
        Ownership[_signature].inMarket = true;
    }
    
    
    function removeItem(uint index) public returns(bool succesful){
        require(Warehouse[index].owner == msg.sender, "You don't own this.");
        Item storage item = Warehouse[index];
        Ownership[item.signature].inMarket = false;
        Warehouse[index] = Warehouse[lastIndex-1];
        lastIndex -= 1;
        succesful = true;
    }
    
    
    function getSignatureOwner(string signature) public view returns
    (address user, bool inMarket){
        user = Ownership[signature].owner;
        inMarket = Ownership[signature].inMarket;
    }
    
    // Implemented to compensate for the inmmaturity of the
    // web3.py library.
    function buyItem(uint index) public returns(
        bool succesful,
        string data,
        string _name, 
        uint _value,
        string _d,
        string _signature
        ){
        if (Warehouse[index].value > Balance[msg.sender]){
            succesful = false;
            data = "Not enough balance to buy item.";
            return;
        }else{
            data = "Item removed from shop. Do not lose the item data.";
            succesful = true;
            Item storage item = Warehouse[index];
            _name = item.name;
            _value = item.value;
            _d = item.d;
            _signature = item.signature;
            Warehouse[index] = Warehouse[lastIndex-1];
            lastIndex -= 1;
            Ownership[_signature].owner = msg.sender;
            Ownership[_signature].inMarket = false;
            Balance[item.owner] += _value;
            Balance[msg.sender] -= _value;
        }
    }
    
}