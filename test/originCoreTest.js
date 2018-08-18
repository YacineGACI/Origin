var OriginCore = artifacts.require("./OriginCore.sol");

var app;

contract("OriginCore", function(accounts){
    var admin = accounts[0];
    var zaraInc = accounts[1];
    var designer = accounts[2];
    var farmInspector = accounts[3];
    var productionInspector = accounts[4];
    var transportInspector = accounts[5];
    var retailer = accounts[6];

    var BRAND_ROLE = 1;
    var DESIGNER_ROLE = 2;
    var FARM_INSPECTOR_ROLE = 3;
    var PRODUCTION_INSPECTOR_ROLE = 4;
    var TRANSPORT_INSPECTOR_ROLE = 5;
    var RETAILER_ROLE = 6;

    it("should add users correctly", function(){
        return OriginCore.deployed().then(function(instance){
            app = instance;
            return app.insertUser("Zach Herney", "06/05/1982", "zach.herney@gmail.com", BRAND_ROLE, "ZARA", {from:zaraInc});
        }).then(function(receipt){
            return app.getUser(zaraInc);
        }).then(function(res){
            assert.equal(res[0], "Zach Herney", "Name not set properly");
            assert.equal(res[1], "06/05/1982", "Birth date not set properly");
            assert.equal(res[2], "zach.herney@gmail.com", "Email not set properly");
            assert.equal(res[3], BRAND_ROLE, "Role not set properly");
            assert.equal(res[4], "ZARA", "Brand not set properly");
            assert.equal(res[5], true, "Active state not set properly");

            return app.insertUser("Yacine GACI", "02/05/1996", "nglsuper0@gmail.com", DESIGNER_ROLE, "ZARA", {from:designer});
        }).then(function(receipt){
            return app.getUser(designer);
        }).then(function(res){
            assert.equal(res[0], "Yacine GACI", "Name not set properly");
            assert.equal(res[1], "02/05/1996", "Birth date not set properly");
            assert.equal(res[2], "nglsuper0@gmail.com", "Email not set properly");
            assert.equal(res[3], DESIGNER_ROLE, "Role not set properly");
            assert.equal(res[4], "ZARA", "Brand not set properly");
            assert.equal(res[5], true, "Active state not set properly");

            return app.getUserCount();
        }).then(function(count){
            assert.equal(count, 2, "There are not 2 users");

            return app.insertUser("Haithem KAHIL", "02/05/1996", "nglsuper0@gmail.com", FARM_INSPECTOR_ROLE, "ZARA", {from:farmInspector});
        }).then(function(receipt){
            return app.insertUser("Adel HANSALI", "02/05/1996", "nglsuper0@gmail.com", PRODUCTION_INSPECTOR_ROLE, "ZARA", {from:productionInspector});
        }).then(function(receipt){
            return app.insertUser("Hanane MAAFI", "02/05/1996", "nglsuper0@gmail.com", TRANSPORT_INSPECTOR_ROLE, "ZARA", {from:transportInspector});
        }).then(function(receipt){
            return app.insertUser("Adel DJIDJIK", "02/05/1996", "nglsuper0@gmail.com", RETAILER_ROLE, "ZARA", {from:retailer});
        }).then(function(receipt){
            return app.getUserCount();
        }).then(function(count){
            assert.equal(count, 6, "There are not 6 users");
        });
    });



    it("should create a new product correctly", function(){
        return OriginCore.deployed().then(function(instance){
            app = instance;
            return app.addProduct("ZARA Shirt", "shirt men", "white shirt for men", 100, "ZARA HQ, New York, USA", designer, {from:zaraInc});
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


    it("should create a second product correctly", function(){
        return OriginCore.deployed().then(function(instance){
            app = instance;
            return app.addProduct("ZARA Suit", "suit men", "Amazing slim suit for men", 100, "ZARA HQ, New York, USA", designer, {from:zaraInc});
        }).then(function(receipt){
            return app.getProductCount();
        }).then(function(count){
            assert.equal(count, 2, "Product not created correctly");
            return app.getProductInfoAt(1);
        }).then(function(info){
            assert.equal(info[0], zaraInc, "Owner not set correctly");
            assert.equal(info[1], "ZARA Suit", "Name not set correctly");
            assert.equal(info[2], "suit men", "Product typer not set correctly");
            assert.equal(info[3], 100, "Quantity not set correctly");
            assert.equal(info[4], "Amazing slim suit for men", "Description not set correctly");

            return app.numberActions();
        }).then(function(count){
            assert.equal(count, 2, "Action not added correctly");
            return app.getPathOfAt(1,0);
        }).then(function(res){
            assert.equal(res[0], zaraInc, "Actioner not set properly");
            assert.equal(res[1], "Creation of Product", "Comment not set properly");
            assert.equal(res[2], "ZARA HQ, New York, USA", "Place not set properly");
        });
    });


    it("should add new actions correctly", function(){
        return OriginCore.deployed().then(function(instance){
            app = instance;
            return app.addAction(0, "Zara Shirt designed and validated by Zara HQ", "ZARA Design Palace", farmInspector, {from:designer});
        }).then(function(receipt){
            return app.getPathOfAt(0,1);
        }).then(function(res){
            assert.equal(res[0], designer, "Actioner not set properly");
            assert.equal(res[1], "Zara Shirt designed and validated by Zara HQ", "Comment not set properly");
            assert.equal(res[2], "ZARA Design Palace", "Place not set properly");

            return app.addAction(0, "Zara Shirt is made with High quality cotton, organic and chemical-free. Really high quality fabric", "Cotton Farm, Egypt", productionInspector, {from:farmInspector});
        }).then(function(receipt){
            return app.getPathOfAt(0, 2);
        }).then(function(res){
            assert.equal(res[0], farmInspector, "Actioner not set properly");
            assert.equal(res[1], "Zara Shirt is made with High quality cotton, organic and chemical-free. Really high quality fabric", "Comment not set properly");
            assert.equal(res[2], "Cotton Farm, Egypt", "Place not set properly");

            return app.addAction(0, "ZARA Shirts are manufactured with high quality standards respecting human rights", "India Manufactory, India", transportInspector, {from:productionInspector});
        }).then(function(receipt){
            return app.addAction(0, "ZARA Shirts are transported from India to USA in XXX ship with blablabla....", "from:India to:USA", retailer, {from:transportInspector});
        });
    });


    it("should validate a product correctly", function(){
        return OriginCore.deployed().then(function(instance){
            app = instance;
            return app.validateProduct(0, "100 Zara shirts arrived. Supply chain ends. Finally!!!", "New York, USA", {from:retailer});
        }).then(function(receipt){
            return app.getPathOfAt(0, 5);
        }).then(function(res){
            assert.equal(res[0], retailer, "Actioner not set properly");
            assert.equal(res[1], "100 Zara shirts arrived. Supply chain ends. Finally!!!", "Comment not set properly");
            assert.equal(res[2], "New York, USA", "Place not set properly");
        });
    });




    it("should test a product consumption", function(){
        return OriginCore.deployed().then(function(instance){
            app = instance;
            return app.consumeProduct(0);
        }).then(function(receipt){
            return app.getProductInfoAt(0);
        }).then(function(info){
            assert.equal(info[5], true, "Product not consumed correctly");
        });
    });


    it("should set the notifications correctly", function(){
        return OriginCore.deployed().then(function(instance){
            app = instance;
            return app.getAllUserNotifications(designer);
        }).then(function(res){
            assert.equal(res[0], 1, "Notifications not set properly");
            return app.getAllUserNotifications(farmInspector);
        }).then(function(res){
            assert.equal(res[0], undefined, "Should be an empty array");
        });
    });


    it("should set the history correctly", function(){
        return OriginCore.deployed().then(function(instance){
            app = instance;
            return app.getUserHistory(designer);
        }).then(function(hist){
            assert.equal(hist[0], 0, "History not set properly");
            return app.getUserHistory(farmInspector);
        }).then(function(hist){
            assert.equal(hist[0], 0, "History not set properly");
            return app.getUserHistory(productionInspector);
        }).then(function(hist){
            assert.equal(hist[0], 0, "History not set properly");
            return app.getUserHistory(transportInspector);
        }).then(function(hist){
            assert.equal(hist[0], 0, "History not set properly");
            return app.getUserHistory(retailer);
        }).then(function(hist){
            assert.equal(hist[0], 0, "History not set properly");
            return app.getUserHistory(designer);
        }).then(function(hist){
            assert.equal(hist[1], undefined, "History not set properly");
            return app.addAction(1, "Zara Suit designed and validated by Zara HQ", "ZARA Design Palace", farmInspector, {from:designer});
        }).then(function(receipt){
            return app.getUserHistory(designer);
        }).then(function(hist){
            assert.equal(hist[1], 1, "History not set properly");
            return app.getAllUserNotifications(farmInspector);
        }).then(function(res){
            assert.equal(res[0], 1, "Should be product 1");
        });
    });

})