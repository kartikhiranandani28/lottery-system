const DecentralizedLottery = artifacts.require("DecentralizedLottery");

module.exports = function (deployer) {
  // Deploy with ticket price of 0.01 ETH
  const ticketPrice = web3.utils.toWei("0.01", "ether");
  deployer.deploy(DecentralizedLottery, ticketPrice);
};