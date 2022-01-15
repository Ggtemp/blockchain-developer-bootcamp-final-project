

const DonateCharity = artifacts.require("Donate")

module.exports = function (deployer) {
  deployer.deploy(DonateCharity, 0);
}
