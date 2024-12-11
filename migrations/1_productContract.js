const productContract = artifacts.require("productTrace.sol");

module.exports = function (deployer) {
  deployer.deploy(productContract);
};