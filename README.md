![Screenshot from 2019-05-18 00-30-30](https://user-images.githubusercontent.com/2212651/57961027-32c34980-7904-11e9-85b1-8e4bf543fe85.png)

# Livepeer Aragon App

## Overview

Livepeer is a delegated-proof-of-stake protocol which governs the operation of a network of Transcoder nodes through Ethereum.

Aragon is a project to empower freedom by creating tools for decentralized organizations to thrive - also on Ethereum blockchain.

This app empowers a "Decentralized Autonomous Organisation" (DAO) on Aragon's platform to govern the roles of **Delegator** and **Transcoder** in Livepeer's protocol.

Follow these [instructions to install this app in any Aragon DAO.](https://github.com/videoDAC/livepeer-aragon/blob/master/install-nets.md)

### Implementation Details

This project uses a modified version of the [Aragon Agent App](https://blog.aragon.one/aragon-agent-beta-release/) ([Agent.sol](https://github.com/aragon/aragon-apps/blob/master/apps/agent/contracts/Agent.sol)) for storing LPT and interacting with Livepeer smart contracts.

It currently includes the ability to call the following smart contract functions on Livepeer's protocol, and for the functions' execution to be governed by a vote of the DAO:

- **Delegator** functions: `approve`, `bond`, `claimEarnings`, `unbond`, and `withdraw`.
- **Transcoder** functions: `transcoder`, `reward`, `setServiceURI`

![image](https://user-images.githubusercontent.com/2212651/57960970-d4966680-7903-11e9-9c7b-a92aed0461d8.png)

### Reference Implementation and Installation

A reference implementation of this application can be found [in this Aragon DAO running on Rinkeby Ethereum testnet](https://rinkeby.aragon.org/#/livepeerdelegator.aragonid.eth/0x4a7335f3ecb43b685526c1b39043bf696c78c641).

Follow these [instructions to install this application on your local environment](https://github.com/videoDAC/livepeer-aragon/blob/master/install-local.md).

Follow these [instructions to install this app in any Aragon DAO.](https://github.com/videoDAC/livepeer-aragon/blob/master/install-nets.md)

### Future Scope

The project is currently researching how it would be possible to modify [go-livepeer](https://github.com/livepeer/go-livepeer) to enable Livepeer's node software to interact with the livepeer protocol *via the Livepeer Aragon App*. Initial discussions on this can be found here: https://github.com/livepeer/research/issues/13.

In addition to this, further changes will likely be required as part of the [Livepeer project's Streamflow release](https://github.com/livepeer/wiki/blob/master/STREAMFLOW.md).

## Project Contents

### aragon-livepeer-experiment

Initial Solidity tests to experiment with the interaction between the Aragon Agent.sol and the Livepeer BondingManager.sol. See the test file if interested.

### livepeer-protocol

The full livepeer contract deployment for testing locally. Modified to compile with the current version of Truffle v5.0.6. Includes extra truffle scripts:  
- `initialiseFirstRound.js` for preparing the BondingManager to be bonded too after initial deployment.  
- `skipRoundAndInitialise.js` for skipping a specified number of Livepeer rounds, required for speeding up the protocol for testing.
- `rewardWithLpt.js` for declaring account[0] as a transcoder, doing the necessary setup and calling reward.  

### livepeer-aragon-app

The Livepeer Aragon app. It uses a modified version of Agent.sol to workaround limitations with the aragonAPI, see the `LivepeerAragonApp.sol` for more info. It was also initially based on the Aragon `react-kit` template. The template code has almost entirely been replaced. 
