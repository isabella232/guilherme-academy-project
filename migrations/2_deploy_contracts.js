var ProofStorage = artifacts.require("./ProofStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(ProofStorage);
};
