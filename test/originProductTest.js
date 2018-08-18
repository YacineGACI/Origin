var OriginProduct = artifacts.require("./OriginProduct.sol");

var app;

contract("OriginProduct", function(accounts){
    var admin = accounts[0];
    var zaraInc= accounts[1];
    var zaraShop = accounts[2];

    it("should return empty list of products and actions", function(){
        return OriginProduct.deployed().then(function(instance){
            app = instance;
            return app.getProductCount();
        }).then(function(count){
            assert.equal(count, 0, "Product List not initialized correcly");
            return app.numberActions();
        }).then(function(actionCount){
            assert.equal(actionCount, 0, "Action List not initialized correctly");
        });
    });



    it("should add a new product correctly", function(){
        return OriginProduct.deployed().then(function(instance){
            app = instance;
            return app.createProduct("ZARA Shirt", "shirt men", "white shirt for men", 100, "ZARA HQ, New York, USA", {from:zaraInc});
        }).then(function(receipt){
            return app.getProductCount();
        }).then(function(count){
            assert.equal(count, 1, "Product not created correctly");
            return app.getProductInfoAt(0);
        }).then(function(info){
            assert.equal(info[0], zaraInc, "Owner not set correctly");
            assert.equal(info[1], "ZARA Shirt", "Name not set correctly");
            assert.equal(info[2], "shirt men", "Product typer not set correctly");
            assert.equal(info[3], 100, "Quantity not set correctly");
            assert.equal(info[4], "white shirt for men", "Description not set correctly");

            return app.numberActions();
        }).then(function(count){
            assert.equal(count, 1, "Action not added correctly");
            return app.getPathOfAt(0,0);
        }).then(function(res){
            assert.equal(res[0], zaraInc, "Actioner not set properly");
            assert.equal(res[1], "Creation of Product", "Comment not set properly");
            assert.equal(res[2], "ZARA HQ, New York, USA", "Place not set properly");
        });
    });



    it("should test a product consumption", function(){
        return OriginProduct.deployed().then(function(instance){
            app = instance;
            return app.consumeProduct(0);
        }).then(function(receipt){
            return app.getProductInfoAt(0);
        }).then(function(info){
            assert.equal(info[5], true, "Product not consumed correctly");
        });
    });

    

    it("should get all the products of a user", function(){
        return OriginProduct.deployed().then(function(instance){
            app = instance;
            return app.insertUser("Zach Herney", "06/05/1982", "zach.herney@gmail.com", 0, "ZARA", {from:zaraInc});
        }).then(function(receipt){
            return app.getAllUserProducts(zaraInc);
        }).then(function(res){
            assert.equal(res[0], 0, "Product ownership not set properly");
        });
    });


    it("should deactivate a product and reactivates it correctly", function(){
        return OriginProduct.deployed().then(function(instance){
            app = instance;
            return app.getProductCount();
        }).then(function(count){
            assert.equal(count, 1, "No product available");
            return app.deactivateProduct(0, {from:admin});
        }).then(function(receipt){
            return app.activateProduct(0, {from:admin});
        }).then(function(receipt){
            return app.getProductInfoAt(0);
        }).then(function(res){
            assert.equal(res[6], true, "Product not activated");
        })
    });
})