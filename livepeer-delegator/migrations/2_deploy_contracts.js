const LivepeerDelegator = artifacts.require('LivepeerDelegator.sol')

module.exports = function (deployer) {
  deployer.deploy(LivepeerDelegator)
}
