# Livepeer Aragon App
An example installation can be found [here](https://rinkeby.aragon.org/#/livepeerdelegator.aragonid.eth/0x4a7335f3ecb43b685526c1b39043bf696c78c641).

Livepeer Aragon app for managing Livepeer interaction.

This project uses a modified version of the Aragon Agent app (Agent.sol) for storing LPT and interacting with Livepeer contracts. 

It currently includes the ability to call:  
- Delegator functions: approve, bond, claimEarnings, unbond, rebond and withdrawStake.
- Transcoder functions: transcoder, reward, setServiceURI

Further investigation is being made into modifying [go-livepeer](https://github.com/livepeer/go-livepeer) to interact with the livepeer protocol via the Aragon app. Some discussion can be found here: https://github.com/livepeer/research/issues/13 

## Project contents
### aragon-livepeer-experiment
Initial Solidity tests to experiment with the interaction between the Aragon Agent.sol and the Livepeer BondingManager.sol. See the test file if interested.

### livepeer-protocol
The full livepeer contract deployment for testing locally. Modified to compile with the current version of Truffle v5.0.6. Includes extra truffle scripts:  
- `initialiseFirstRound.js` for preparing the BondingManager to be bonded too after initial deployment.  
- `skipRoundAndInitialise.js` for skipping a specified number of Livepeer rounds, required for speeding up the protocol for testing.
- `rewardWithLpt.js` for declaring account[0] as a transcoder, doing the necessary setup and calling reward.  

### livepeer-aragon-app
The Livepeer Aragon app. It uses a modified version of Agent.sol to workaround limitations with the aragonAPI, see the `LivepeerAragonApp.sol` for more info. It was also initially based on the Aragon `react-kit` template. The template code has almost entirely been replaced. 

## Installation Instructions

### Introduction

The Livepeer Aragon application has been published to the aragonPM (Package Manager) under the ENS name livepeer.open.aragonpm.eth.

To see information about the published app, run `aragon apm info livepeer.open.aragonpm.eth` using aragonCLI.

### Pre-Requisites

**Installing this application requires using aragonCLI (Command Line Interface).** [Here is an introduction to aragonCLI](https://hack.aragon.org/docs/cli-intro.html), which includes instructions on how to install aragonCLI.

**These instructions also assume that there is an Aragon DAO already set up.** If you don't already have an Aragon DAO set up, I recommend following [these excellent instructions by @lkngtn from the AragonOne Team](https://forum.aragon.org/t/guide-custom-aragon-organization-deployment-using-the-cli/). Following these will also help you familiarise yourself with using the aragonCLI and the Aragon web interface, as well as introducing you to setting permissions in Aragon.

**The Ethereum account being used by aragonCLI must have the right permissions in the DAO**. 

The easiest way to do this is to assign this address the `Manage apps` permission on the `Kernel` and the `Create permissions` permission on the `ACL`. You can do this using the "Permissions" section of Aragon's browser-based UI. _This way, the aragonCLI can perform the actions without the DAO voting on it._

An alternative would be to provide a voting token to the account being used by aragonCLI. Alternatively, you can grant "Any account" the permission to "Create new votes" on the "Voting" App.  _Using either of these approaches will mean that every command run by the aragonCLI will need to be voted on by the DAO._

### Installing to an Aragon DAO on Rinkeby

**1. Install the app**

**Run the `install` command using aragonCLI:**

```
dao install <DAO-Address> livepeer.open.aragonpm.eth --app-init-args <Livepeer-Controller> --environment aragon:rinkeby
```

Where:

- `<DAO-Address>` is the address of the Aragon DAO you are installing on. This can be the full address or the ENS name.
- `<Livepeer-Controller>` address is `0x37dC71366Ec655093b9930bc816E16e6b587F968` for Rinkeby.

_This will create a vote on the Aragon DAO proposing to install the app._

**2. Pass the vote on the Aragon DAO to install the app.**

There should be a vote in the DAO's Voting app entitled

> Kernel: Create a new upgradeable instance of 0x668fe7ef9366b1f27e1e18a59fd2cdec041ad223e3506bf0cb6d1ab981781e75 app linked to the Kernel...

The app will be installed when this vote passes.

**3. Make a note of the App Proxy Addresses**

**Run the `apps` command using aragonCLI:**

```
dao apps <DAO-Address> --all --environment aragon:rinkeby
```

This will list the apps currently installed on the DAO, including:

- an `App` called `voting@v2.0.3` (or perhaps another version). This is the Voting App. **Make a note of the `<Voting-App-Proxy-Address>` for later steps**.

- a `Permissionless app` labelled `0x668fe7ef9366b1f27e1e18a59fd2cdec041ad223e3506bf0cb6d1ab981781e75`. This is the Livepeer App. **Make a note of the `<Livepeer-App-Proxy-Address>` for later steps**.

**4. Set the first Permission on the App**

**Run the `acl create` command using aragonCLI:**

```
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> APPROVE_AND_BOND_ROLE <Voting-App-Proxy-Address> <Manager-Address> --environment aragon:rinkeby
```

Where:

- `<Livepeer-App-Proxy-Address>` and `<Voting-App-Proxy-Address>` were noted in a previous step
- `<Manager-Address>` is the address of whatever entity will manage this permission. You can set this to the Ethereum account being used by aragonCLI until you are ready to assign to another entity.

***This will propose a vote to assign permissions such that any proposals for approving and bonding Livepeer Tokens must pass a vote.***

**5. Pass the vote to set the first Permission**

There should be a vote in the DAO's Voting app entitled

> ACL: Create a new permission granting 'Voting' the ability to perform actions of role 'Approve and Bond to address' on 'Livepeer' (setting <Manager-Address> as the permission manager)

The app will be visible through the Aragon Rinkeby web interface once this vote has passed. Check using the URL rinkeby.aragon.org/#/DAO-Address.

 🎉 🎉 🎉 🎉 ***The Livepeer App can now approve and bond Livepeer Tokens using Livepeer's Protocol.*** 🎉 🎉 🎉 🎉

The following roles can now be assigned using the same process as setting the first permission:

- APPROVE_AND_BOND_ROLE
- CLAIM_EARNINGS_ROLE
- UNBOND_ROLE
- WITHDRAW_STAKE_ROLE
- DECLARE_TRANSCODER_ROLE
- SET_SERVICE_URI_ROLE
- REWARD_ROLE
- APPROVE_ROLE *
- BOND_ROLE
- TRANSFER_ROLE  
- SET_CONTROLLER_ROLE

Depending on your DAO's set up and intended usage, some permissions may require parameters to be set to restrict/allow access to certain functions. A preliminary script for modifying parameter permissions can be found at `/livepeer-aragon-app/scripts/grantPermissionWithParameters.js`

* You may wish to set the APPROVE_ROLE to `0xffffffffffffffffffffffffffffffffffffffff` instead of the `<Voting-App-Proxy-Address>` so that calling reward does not need to be voted on every round of Livepeer's protocol.

### Installing to an Aragon DAO on Mainnet

As far as we are aware, at the time of writing, this application has not been installed on Mainnet.

***It has not yet passed a security audit, so if you install on Mainnet, you do so at your own risk.***

However, for those who like living on the edge, you can use the same instructions as for installing on Rinkeby, substituting `--environment aragon:rinkeby` with `--environment aragon:mainnet` for all the aragonCLI commands.

### Creating and installing to a Local Deployment

1. Install dependencies:  
    ```
    npm install -g truffle 
    npm install -g @aragon/cli 
    npm install (In /livepeer-aragon-app directory)
    npm install (In /livepeer-protocol directory)
    ```

2. Startup local chain and IPFS, in separate terminals run:  
    ```sh
    aragon devchain
    aragon ipfs
    ```

3. Prepare Livepeer contracts, execute in the `/livepeer-protocol` directory:  
    ```sh
    truffle migrate  
    truffle exec scripts/livepeerAragonApp/initialiseFirstRound.js
    ```

4. Compile with the local version of truffle, execute in the `/livepeer-aragon-app` directory (this is necessary as the Aragon CLI truffle config doesn't optimize Solidity compilation and the contract will not deploy unless optimized):  
    ```sh
    truffle compile --all
    ```
  
5. Deploy the Aragon Dao and Livepeer app, execute in the `/livepeer-aragon-app` directory (find the Livepeer Controller address after the `truffle migrate` in the `livepeer-protocol` directory):  
    ```sh
    aragon run --app-init-args <Livepeer Controller Address>
    ```
    
To test the bonded amount increases as expected after reward is executed, bond to the main account in your local chain (if using `aragon devchain` it will likely be `0xb4124cEB3451635DAcedd11767f004d8a28c6eE7`) and execute this in the `/livepeer-protocol` directory:
```sh
truffle exec scripts/livepeerAragonApp/rewardWithLpt.js
```

Finally, before unbonding or withdrawing, you must skip one or more Livepeer rounds and initialise the latest one. To do this, modify the constants as necessary and execute this in the `/livepeer-protocol` directory:  
```sh
truffle exec scripts/livepeerAragonApp/skipRoundAndInitialise.js
```
