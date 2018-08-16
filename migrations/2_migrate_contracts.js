var Ownable = artifacts.require("./Ownable.sol");
var OriginUser = artifacts.require("./OriginUser.sol");
var OriginProduct = artifacts.require("./OriginProduct.sol");


module.exports = function(deployer) {
  deployer.deploy(Ownable).then(function(){
    return deployer.deploy(OriginUser);
  }).then(function(){
    return deployer.deploy(OriginProduct);
  });
};
