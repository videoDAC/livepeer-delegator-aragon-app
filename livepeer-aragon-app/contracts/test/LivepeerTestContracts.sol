pragma solidity ^0.4.24;

import "../../../livepeer-protocol/contracts/Controller.sol";
import "../../../livepeer-protocol/contracts/test/GenericMock.sol";
import "../../../livepeer-protocol/contracts/bonding/BondingManager.sol";
import "../../../livepeer-protocol/contracts/token/LivepeerToken.sol";

// This is necessary to include these contracts in the build
// folder so they can be referenced with "artifacts.require()"

contract TestContracts {
    constructor() public {
    }
}
