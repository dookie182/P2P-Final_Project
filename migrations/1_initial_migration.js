const Migrations = artifacts.require("Migrations");
const Lottery = artifacts.require("Lottery")
const LotteryMint = artifacts.require("LotteryMint")

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Lottery);
};
