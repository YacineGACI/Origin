pragma solidity ^0.4.23;

import "./OriginProduct.sol";

contract OriginCore is OriginProduct{
    
    uint constant retailer = 6;

    // a mapping that specifies for every user the list of products that he needs to validate in order
    // to advance the supply chain
    mapping (address => uint[]) public notifications;

    // a mapping that specifies for every user the list of products that he participated upon their
    // validation in the past
    mapping (address => uint[]) public history;

    event NewAction(uint productId);

    //@dev: gives the index of _productId in the notifications array of user _user
    function indexOf(address _user, uint _productId) internal view returns(uint) {
        uint i = 0;
        while (notifications[_user][i] != _productId) {
            i++;
        }
        return i;
    }

    //@dev: removes the product of index _index from the notifications array of user _user
    function removeNotificationAtIndex(address _user, uint _index)  internal returns(bool) {
        if (_index >= notifications[_user].length) return;

        for (uint i = _index; i<notifications[_user].length-1; i++){
            notifications[_user][i] = notifications[_user][i+1];
        }
        delete notifications[_user][notifications[_user].length-1];
        notifications[_user].length--;
        return true;
    }

    //@dev: removes the product pf id _productId from the notifications array of user _user
    function removeNotification(address _user, uint _productId) public returns (bool){
        uint index = indexOf(_user, _productId);
        removeNotificationAtIndex(_user, index);
        return true;
    }

    //@dev: checks if the user _user can validate the product _product in the supply chain, that is if 
    //_product figures in the notifications array of user _user
    function userCanAddAction(address _user, uint _product) public view returns (bool success){
        require(isUser(_user));
        require(_product < products.length);
        success = false;
        uint i = 0;
        uint[] storage list = notifications[_user];
        while(!success && i < list.length){
            if(_product == list[i]){
                success = true;
            }
            else{
                i = i + 1;
            }
        }
        return success;
    }


    //@dev: adds action related to the product of id _productId and notifies the next actor in the supply
    // chain to validate the product
    function addAction(uint _productId, string _comment, string _place, address _nextActor) public unpausedSupplyChain returns (bool success){
        require(isUser(msg.sender));
        require(isUser(_nextActor));
        require(_productId < products.length);
        require(userCanAddAction(msg.sender, _productId));

        // Add the new Action
        actions[numberActions].actioner = msg.sender;
        actions[numberActions].comment = _comment;
        actions[numberActions].place = _place;
        actions[numberActions].time = now;

        // Add the new action to the path of the product to keep track of every action
        products[_productId].path.push(numberActions);

        // Increment the number of actions available in the supply chain
        numberActions++;

        // Remove action notification from msg.sender notifications
        removeNotification(msg.sender, _productId);

        // Add notification for the next actor in the supply chain
        notifications[_nextActor].push(_productId);

        // Add this product to this user's history
        history[msg.sender].push(_productId);

        // Emit the NewAction event
        emit NewAction(_productId);

        return true;
    }


    //@dev: validates the product of id _productId and terminates the supply chain for this product
    function validateProduct(uint _productId, string _comment, string _place) public unpausedSupplyChain returns (bool){
        require(isUser(msg.sender));
        require(userStructs[msg.sender].role == retailer);
        require(_productId < products.length);
        require(userCanAddAction(msg.sender, _productId));

        // Add the new Action
        actions[numberActions].actioner = msg.sender;
        actions[numberActions].comment = _comment;
        actions[numberActions].place = _place;
        actions[numberActions].time = now;

        // Add the new action to the path of the product to keep track of every action
        products[_productId].path.push(numberActions);

        // Increment the number of actions available in the supply chain
        numberActions++;

        // Remove action notification from msg.sender notifications
        removeNotification(msg.sender, _productId);

        // Add this product to this user's history
        history[msg.sender].push(_productId);

        // Emit the NewAction event
        emit NewAction(_productId);

        return true;
    }


    function addProduct(string _name, string _productType, string _description, uint _quantity, string _place, address _nextActor) public unpausedSupplyChain returns (uint index){
        require(isUser(msg.sender));
        require(isUser(_nextActor));

        index = createProduct(_name, _productType, _description, _quantity, _place);
        notifications[_nextActor].push(index);

        // Add this product to this user's history
        history[msg.sender].push(index);

        return index;
    }


    function getAllUserNotifications(address _user) public view unpausedSupplyChain returns (uint[] n){
        require(isUser(_user));
        return notifications[_user];
    }

    function getUserHistory(address _user) public view unpausedSupplyChain returns (uint[] h){
        require(isUser(_user));
        return history[_user];
    }

}