pragma solidity ^0.4.23;

import "./Ownable.sol";

contract OriginUser is Ownable{

    struct UserStruct{
        string fullName;
        string dateOfBirth;
        string email;
        string role;
        string brand;
        bool active;
        uint index;
    }

    mapping (address => UserStruct) private userStructs;
    address[] private userIndex;


    event NewUser(string _fullName, string _dateOfBirth, string _email, string _role, string _brand);
    event UpdateUser(string _fullName, string _dateOfBirth, string _email, string _role, string _brand, bool active);

    function isUser(address _userAddress) internal constant returns(bool isIndeed) {
        if(userIndex.length == 0) return false;
        return (userIndex[userStructs[_userAddress].index] == _userAddress);
    }


    function insertUser(string _fullName, string _dateOfBirth, string _email, string _role, string _brand) public unpausedSupplyChain returns (uint index){
        require(!isUser(msg.sender));
        userStructs[msg.sender].fullName = _fullName;
        userStructs[msg.sender].dateOfBirth = _dateOfBirth;
        userStructs[msg.sender].email = _email;
        userStructs[msg.sender].role = _role;
        userStructs[msg.sender].brand = _brand;
        userStructs[msg.sender].active = true;
        userStructs[msg.sender].index = userIndex.push(msg.sender) - 1;
        
        emit NewUser(_fullName, _dateOfBirth, _email, _role, _brand);

        return userIndex.length - 1;
    }

    function getUser(address _userAddress) view public unpausedSupplyChain returns (string _fullName, string _dateOfBirth, string _email, string _role, string _brand, bool active){
        require(isUser(_userAddress));
        require(userStructs[_userAddress].active);
        return (userStructs[_userAddress].fullName, userStructs[_userAddress].dateOfBirth, userStructs[_userAddress].email, userStructs[_userAddress].role, userStructs[_userAddress].brand, userStructs[_userAddress].active);
    }

    function updateUserFullName(string _fullName) public unpausedSupplyChain returns(bool success){
        require(isUser(msg.sender));
        require(userStructs[msg.sender].active);
        userStructs[msg.sender].fullName = _fullName;
        emit UpdateUser(userStructs[msg.sender].fullName, userStructs[msg.sender].dateOfBirth, userStructs[msg.sender].email, userStructs[msg.sender].role, userStructs[msg.sender].brand, userStructs[msg.sender].active);
        return true;
    }

    function updateUserDateOfBirth(string _dateOfBirth) public unpausedSupplyChain returns(bool success){
        require(isUser(msg.sender));
        require(userStructs[msg.sender].active);
        userStructs[msg.sender].dateOfBirth = _dateOfBirth;
        emit UpdateUser(userStructs[msg.sender].fullName, userStructs[msg.sender].dateOfBirth, userStructs[msg.sender].email, userStructs[msg.sender].role, userStructs[msg.sender].brand, userStructs[msg.sender].active);
        return true;
    }

    function updateUserEmail(string _email) public unpausedSupplyChain returns(bool success){
        require(isUser(msg.sender));
        require(userStructs[msg.sender].active);
        userStructs[msg.sender].email = _email;
        emit UpdateUser(userStructs[msg.sender].fullName, userStructs[msg.sender].dateOfBirth, userStructs[msg.sender].email, userStructs[msg.sender].role, userStructs[msg.sender].brand, userStructs[msg.sender].active);
        return true;
    }

    function deactivateUser() public unpausedSupplyChain returns(bool success){
        require(isUser(msg.sender));
        require(userStructs[msg.sender].active);
        userStructs[msg.sender].active = false;
        emit UpdateUser(userStructs[msg.sender].fullName, userStructs[msg.sender].dateOfBirth, userStructs[msg.sender].email, userStructs[msg.sender].role, userStructs[msg.sender].brand, userStructs[msg.sender].active);
        return true;
    }

    function activateUser(address _userAddress) public onlyOwner returns(bool success){
        require(isUser(_userAddress));
        require(!userStructs[_userAddress].active);
        userStructs[_userAddress].active = true;
        emit UpdateUser(userStructs[_userAddress].fullName, userStructs[_userAddress].dateOfBirth, userStructs[_userAddress].email, userStructs[_userAddress].role, userStructs[_userAddress].brand, userStructs[_userAddress].active);
        return true;
    }
    
    function ownerDeactivatesUser(address _address) public onlyOwner returns(bool success){
        require(isUser(_address));
        require(userStructs[_address].active);
        userStructs[_address].active = false;
        emit UpdateUser(userStructs[_address].fullName, userStructs[_address].dateOfBirth, userStructs[_address].email, userStructs[_address].role, userStructs[_address].brand, userStructs[_address].active);
        return true;
    }

    function getUserCount() view public unpausedSupplyChain returns(uint count){
        return userIndex.length;
    }
}