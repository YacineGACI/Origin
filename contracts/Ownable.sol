pragma solidity ^0.4.23;

contract Ownable{
    address public owner;
    bool public paused;

    event SupplyChainPaused();
    event SupplyChainUnPaused();
    event OwnerChanged();

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier unpausedSupplyChain(){
        require(paused == false);
        _;
    }

    modifier pausedSupplyChain(){
        require(paused == true);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function changeOwner(address _newOwner) public onlyOwner unpausedSupplyChain{
        if(_newOwner != address(0)){
            owner = _newOwner;
        }
        emit OwnerChanged();
    }

    function pauseSupplyChain() public onlyOwner unpausedSupplyChain{
        paused = true;
        emit SupplyChainPaused();
    }

    function unPauseSupplyChain() public onlyOwner pausedSupplyChain{
        paused = false;
        emit SupplyChainUnPaused();
    }

}