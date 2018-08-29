pragma solidity ^0.4.7;

contract OrthMarket {
    /*
    OrthMarket.Item
        Data structure for an item object being stored in the contract
        ---
        string **name**
            - item name, does not require to be unique.

        uint **value**
            - item value in Orth.
        
        string **d**;
            - item data, could be item metadata or the whole item object encoded 
                in string.

        string **signature**l
            - item signature, this is the object unique identifier.
        
        address **owner**;
            - DEPRECATED, item ownership is now being tracked through 
                (OrthMarket.Ownership).owner

    */
    struct Item {
        string name;
        uint value;
        string d;
        string signature;
        address owner;
    }
    
    /*
    OrthMarket.ItemState
        Data structure for tracking item state in the contract
        ---
        address owner
            - Owner of the item/signature. 
                This is modified through OrthMarket.buyItem 
                    or OrthMarket.registerItem
        bool inMarket
            - Sets the state wether the item is in the marketplace or not. 
                Prevents multiple submission of the same item in the marketplace.

    */
    struct ItemState {
        address owner;
        bool inMarket;
    }
    

    address administrator;
    Item[] Warehouse;
    mapping(address => uint) Balance;
    mapping(string => ItemState) Ownership;
    uint lastIndex;
    bool payout;
    
    modifier inlimits() {
        require(msg.value >= 1 finney, "Sent value is below minimum value.");
        require(msg.value % 1 finney == 0, "Sent value is not divisible by 1 finney.");
        _;
    }
    
    function buyOrth() public payable inlimits{
        Balance[msg.sender] += msg.value / 1000000000;
    }
    

    function payoutOrth(uint ammount) public payable {
        require(Balance[msg.sender] > ammount, "Not enough orth conduct payout.");
        require(payout == true, "The contract owner disabled orth payout.")
        msg.sender.transfer(ammount * 1000000000);
        Balance[msg.sender] -= ammount;
    }
    
    constructor() public {
        administrator = msg.sender;
        lastIndex = 0;
        payout = true;
    }

    modifier adminOnly {
        require(msg.sender == administrator, "Function for contract owner only.");
        _;
    }
    
    function togglePayout(bool b) public adminOnly{
        payout = b;
    }

    function sendCredits(address recipient, uint value) public returns(bool succesful, string data){
        if(msg.sender == administrator){
            Balance[recipient] += value;
            succesful = true;
            data = "Sucessfuly sent ammount";
        }else{
            if(Balance[msg.sender] < value){
                succesful = false;
                data = "Not enough balance";
            }else{
                Balance[recipient] += value;
                Balance[msg.sender] -= value;
                succesful = true;
                data = "Sucessfuly sent ammount";
            }
        }
    }
    
    function registerItem(address recipient, string signature) public{
        if(msg.sender == administrator){
            Ownership[signature].owner = recipient;
        }
        
    }
    
    function myBalance() public view returns (address dest, uint value){
        dest = msg.sender;
        value = Balance[msg.sender];
    }
    
    function getItem(uint index) public view returns (
        string _name, 
        uint _value,
        string _d,
        string _signature,
        address _owner
        )
    {
        Item storage item = Warehouse[index];
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
        bool x = !true;
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