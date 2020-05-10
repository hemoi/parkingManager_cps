const parkingContract = artifacts.require("./parkingContract.sol");

module.exports = function(deployer) {
  deployer.deploy(parkingContract);
};