var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProofStorage = artifacts.require("./ProofStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(ProofStorage);
};
