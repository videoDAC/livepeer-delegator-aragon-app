# Livepeer Delegator Aragon App
An example installation can be found here: https://rinkeby.aragon.org/#/livepeerdelegator.aragonid.eth/0x4a7335f3ecb43b685526c1b39043bf696c78c641

Livepeer Delegator Aragon app for managing Livepeer Delegation actions.

This project uses a modified version of the Aragon Agent app (Agent.sol) for storing LPT and interacting with Livepeer contracts. 

Initial development includes functions for Livepeer interaction as a typical bonder/delegator. These include the ability to call the functions: approve, bond, claimEarnings, unbond, rebond and withdrawStake.

Further investigation may be made into creating a Livepeer Transcoder app, some discussion here: https://github.com/livepeer/research/issues/13 

## Project contents
#### aragon-livepeer-experiment
Initial Solidity tests to experiment with the interaction between the Aragon Agent.sol and the Livepeer BondingManager.sol. See the test file if interested.

#### livepeer-protocol
The full livepeer contract deployment for testing locally. Modified to compile with the current version of Truffle v5.0.6. Includes extra truffle scripts:  
- `initialiseFirstRound.js` for preparing the BondingManager to be bonded too after initial deployment.  
- `skipRoundAndInitialise.js` for skipping a specified number of Livepeer rounds, required for speeding up the protocol for testing.
- `rewardWithLpt.js` for declaring account[0] as a transcoder, doing the necessary setup and calling reward.  

#### livepeer-delegator
The Livepeer Delegator Aragon app. It uses a modified version of Agent.sol to workaround limitations with the aragonAPI, see the `LivepeerDelegator.sol` for more info. It was also initially based on the Aragon `react-kit` template. The template code has almost entirely been replaced. 

## Installation Instructions
### Installing to a deployed Aragon DAO 

Experimental versions of the Livepeer Aragon app have been published to Rinkeby using the aragonPM. 
Using the aragonCLI with access to Rinkeby through the staging environment you can install the current version of this app into an existing Aragon DAO on Rinkeby.  

1. To install the aragonCLI:
    ```sh
    npm install -g @aragon/cli 
    ```  

2. To get access to a staging environment you can download this project and `cd` into `/livepeer-delegator` then set the network endpoint and accounts as specified here: https://hack.aragon.org/docs/guides-faq#set-a-private-key.  


To see info about the published app:
```sh
aragon apm info livepeer.open.aragonpm.eth --environment staging
```  

To install the Livepeer Delegator Aragon app into an existing Aragon DAO:  
```sh
dao install <DAO Address> livepeer.open.aragonpm.eth --set-permissions open --environment staging --app-init-args 0x37dC71366Ec655093b9930bc816E16e6b587F968
```
Note the success of this call could be dependant on the permissions set in the DAO. Ensure the account connected can action the `Manage Apps` permission either directly or through a forwarder eg the Voting app. See Permissions -> Kernal in the UI to check.

If installed without `--set-permissions open` then create a permission for the app to appear in the DAO with:
```sh
dao acl create <DAO Address> <App Proxy Address> APPROVE_ROLE <Entity> <Manager> --environment staging
```


After app installation the permissions can be modified through the UI or through the CLI. Roles available include:  
- SET_CONTROLLER_ROLE
- APPROVE_ROLE
- BOND_ROLE
- APPROVE_AND_BOND_ROLE
- CLAIM_EARNINGS_ROLE
- UNBOND_ROLE
- WITHDRAW_STAKE_ROLE
- TRANSFER_ROLE  

Depending on your DAO's set up and intended usage, some permissions may require parameters to be set to restrict/allow access to certain functions. A preliminary script for modifying parameter permissions can be found at `/livepeer-delegator/scripts/grantPermissionWithParameters.js`


### Creating and installing to a Local Deployment

1. Install dependencies:  
    ```
    npm install -g truffle 
    npm install -g @aragon/cli 
    npm install (In /livepeer-delegator directory)
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

4. Compile with the local version of truffle, execute in the `/livepeer-delegator` directory (this is necessary as the Aragon CLI truffle config doesn't optimize Solidity compilation and the contract will not deploy unless optimized):  
    ```sh
    truffle compile --all
    ```
  
5. Deploy the Aragon Dao and Livepeer app, execute in the `/livepeer-delegator` directory (find the Livepeer Controller address after the `truffle migrate` in the `livepeer-protocol` directory):  
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
