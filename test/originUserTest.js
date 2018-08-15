var OriginUser = artifacts.require("./OriginUser.sol");

var app;

contract("OriginUser", function(accounts){

    var admin = accounts[0];
    var designer = accounts[1];
    var farmInspector = accounts[2];

    it("should return empty list of users", function(){
        return OriginUser.deployed().then(function(instance){
            app = instance;
            return app.getUserCount.call();
        }).then(function(count){
            assert.equal(count, 0, "User list is not empty");
        });
    });


    it("should add new users correctly", function(){
        return OriginUser.deployed().then(function(instance){
            app = instance;
            return app.insertUser("Yacine GACI", "02/05/1996", "nglsuper0@gmail.com", "cloth desiner", "ZARA", {from:designer});
        }).then(function(receipt){
            return app.getUserCount.call();
        }).then(function(count){
            assert.equal(count, 1, "user not inserted correctly");
            return app.getUser.call(designer);
        }).then(function(res){
            assert.equal(res[0], "Yacine GACI", "Name not set properly");
            assert.equal(res[1], "02/05/1996", "Birth date not set properly");
            assert.equal(res[2], "nglsuper0@gmail.com", "Email not set properly");
            assert.equal(res[3], "cloth desiner", "Role not set properly");
            assert.equal(res[4], "ZARA", "Brand not set properly");
            assert.equal(res[5], true, "Active state not set properly");
        });
    });

    it("should update email correctly", function(){
        return OriginUser.deployed().then(function(instance){
            app = instance;
            return app.insertUser("John Doe", "02/04/1986", "johnd@gmail.com", "farm inspector", "John Doe Inspection", {from:farmInspector});
        }).then(function(receipt){
            return app.updateUserEmail("johndoe@gmail.com", {from:farmInspector});
        }).then(function(receipt){
            return app.getUser.call(farmInspector);
        }).then(function(res){
            assert.equal(res[2], "johndoe@gmail.com", "Email not modified properly");
        });
    });

    it("should deactivate a user and reactivates it correctly", function(){
        return OriginUser.deployed().then(function(instance){
            app = instance;
            return app.deactivateUser({from:farmInspector});
        }).then(function(receipt){
            return app.getUser(farmInspector);
        }).then(function(res){
            assert.equal(res[5], false, "User not deactivated");
            return app.activateUser(farmInspector, {from:admin});
        }).then(function(receipt){
            return app.getUser(farmInspector);
        }).then(function(res){
            assert.equal(res[5], true, "User not activated");
        })
    });

})