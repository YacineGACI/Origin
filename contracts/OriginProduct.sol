pragma solidity ^0.4.23;

import "./OriginUser.sol";

contract OriginProduct is OriginUser{

    struct Action{
        address actioner;
        string comment;
        uint time;
        string place;
    }

    struct ProductStruct{
        string name;
        string description;
        string productType;
        uint quantity;
        address owner;
        uint[] path;
        bool consumed;
        bool active;
    }

    event NewProduct(address owner, string _name, string _productType, string _description, uint _quantity, string _place);
    event ProductConsumed(uint index);

    ProductStruct[] public products;
    mapping (uint => Action) public actions;
    uint public numberActions ;
    mapping (address => uint[]) public userToProducts;


    // a mapping for ownership mapping (address => uint[]) each address has an array of products that the company/address owns
    // for notifications use mapping (address => uint[]) each address has an array of product ids to be verified on the supply chain

    function createProduct(string _name, string _productType, string _description, uint _quantity, string _place) public unpausedSupplyChain returns (uint index) {
        require(msg.sender != address(0));

        actions[numberActions].actioner = msg.sender;
        actions[numberActions].comment = "Creation of Product";
        actions[numberActions].place = _place;
        actions[numberActions].time = now;


        ProductStruct memory product;
        product.name = _name;
        product.productType = _productType;
        product.description = _description;
        product.quantity = _quantity;
        product.owner = msg.sender;
        product.consumed = false;
        product.active = true;

        index = products.push(product) - 1;
        products[index].path.push(numberActions);

        userToProducts[msg.sender].push(index);

        numberActions = numberActions + 1;

        emit NewProduct(msg.sender, _name, _productType, _description, _quantity, _place);

        return index;
    }



    function getProductInfoAt(uint index) public view unpausedSupplyChain returns (address owner, string name, string productType, uint quantity, string description, bool consumed, bool active) {
        require(index < products.length);
        require(products[index].active);

        ProductStruct memory _product = products[index];
        return (_product.owner, _product.name, _product.productType, _product.quantity, _product.description, _product.consumed, _product.active);
    }


    function getPathOfAt(uint productIndex, uint actionIndex) public view unpausedSupplyChain returns(address, string, string, uint){
        require(productIndex < products.length);
        require(actionIndex < products[productIndex].path.length);
        require(products[productIndex].active);

        uint index = products[productIndex].path[actionIndex];
        return (actions[index].actioner, actions[index].comment, actions[index].place, actions[index].time);

    }

    function consumeProduct(uint index) public unpausedSupplyChain returns (bool succes){
        require(index < products.length);
        require(products[index].active);

        products[index].consumed = true;

        emit ProductConsumed(index);

        return true;
    }

    function deactivateProduct(uint index) public onlyOwner unpausedSupplyChain returns (bool success){
        require(index < products.length);
        require(products[index].active);

        products[index].active = false;

        return true;
    }

    function activateProduct(uint index) public onlyOwner unpausedSupplyChain returns (bool success){
        require(index < products.length);
        require(!products[index].active);

        products[index].active = true;

        return true;
    }

    function getProductCount() public view unpausedSupplyChain returns (uint count){
        return products.length;
    }

}