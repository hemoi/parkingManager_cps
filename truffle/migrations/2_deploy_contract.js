var parkingManager = artifacts.require("./parkingManager.sol");

module.exports = function(deployer) {
  deployer.deploy(parkingManager);
};