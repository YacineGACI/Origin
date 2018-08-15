var Ownable = artifacts.require("./Ownable.sol");
var OriginUser = artifacts.require("./OriginUser.sol");


module.exports = function(deployer) {
  deployer.deploy(Ownable).then(function(){
    return deployer.deploy(OriginUser);
  });
};
