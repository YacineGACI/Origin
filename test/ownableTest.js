var Ownable = artifacts.require("./Ownable.sol");

var app;

contract("Ownable", function(accounts){
    it("should initialize the Ownable contract correctly", function(){
        return Ownable.deployed().then(function(instance){
            app = instance;
            return app.owner();
        }).then(function(owner){
            assert.equal(owner, accounts[0], "Owner not initilized properly");
            return app.paused();
        }).then(function(paused){
            assert.equal(paused, false, "The chain is paused");
        })
    });

    it("should change the owner correctly", function(){
        return Ownable.deployed().then(function(instance){
            app = instance;
            return app.changeOwner(accounts[1], {from:accounts[0]});
        }).then(function(receipt){
            return app.owner();
        }).then(function(owner){
            assert.equal(owner, accounts[1], "Owner not changed correctly");
        })
    });

    it("should test the pausing effect", function(){
        return Ownable.deployed().then(function(instance){
            app = instance;
            return app.pauseSupplyChain({from:accounts[1]});
        }).then(function(receipt){
            return app.paused();
        }).then(function(paused){
            assert.equal(paused, true, "Chain not paused");
            return app.unPauseSupplyChain({from:accounts[1]});
        }).then(function(receipt){
            return app.paused();
        }).then(function(paused){
            assert.equal(paused, false, "Chain not unpaused");
        })
    });

})