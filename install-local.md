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
