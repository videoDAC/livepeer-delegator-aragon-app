This script will use aragonCLI to:

- Create a new Aragon DAO on Rinkeby with token and basic apps
- Install the Livepeer Aragon App
- Set the Livepeer Aragon App's permissions as recommended

You must be running `aragon ipfs` in another window.

The following parameter is required to start this:

- `<Your-AragonCLI-Address>` = the address for the private key being used by your aragonCLI to sign transactions.

During this script, new addresses will be created which will be required for further commands.

### Create a new Aragon DAO on Rinkeby with token and basic apps

```
dao new --environment aragon:rinkeby
```

> This returns `Created DAO: <DAO-Address>` for use in future commands.

```
dao token new "LivepeerDAOToken" "LPDAO" 0 --environment aragon:rinkeby
```

> This returns `Successfully deployed the token at <DAO-Token-Address>` for use in future commands.

```
dao install <DAO-Address> token-manager --app-init none --environment aragon:rinkeby
```

> This returns the address where the `token-manager` has been installed, which can be used as the `<Token-Manager-Proxy-Address>` in future commands.

```
dao token change-controller <DAO-Token-Address> <Token-Manager-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Token-Manager-Proxy-Address> MINT_ROLE <Your-AragonCLI-Address> <Your-AragonCLI-Address> --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> initialize <DAO-Token-Address> true 0 --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> mint <Your-AragonCLI-Address> 1 --environment aragon:rinkeby
dao install <DAO-Address> voting --app-init-args <DAO-Token-Address> 500000000000000000 500000000000000000 86400 --environment aragon:rinkeby
```

> This displays the proxy address where the `voting` app has been installed, which can be used as the `<Voting-App-Proxy-Address>` in future commands.

```
dao acl create <DAO-Address> <Voting-App-Proxy-Address> CREATE_VOTES_ROLE <Token-Manager-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

You have now created a basic DAO on Aragon, with a token and basic apps.

### Install the Aragon Agent App

The Agent App is an application which acts on behalf of the DAO. The Livepeer Aragon App will transact via this application.

```
dao install <DAO-Address> agent --environment aragon:rinkeby
```

> This returns the proxy address where the `agent` app has been installed, which can be used as the `<Agent-App-Proxy-Address>` for use in future commands.

### Install the Livepeer Aragon App

```
dao install <DAO-Address> livepeer.open.aragonpm.eth "8.3.0" --app-init-args <Agent-App-Proxy-Address> 0x37dC71366Ec655093b9930bc816E16e6b587F968 --environment aragon:rinkeby
```

> This returns the address where `livepeer.open.aragonpm.eth` is installed, which will be used as the `<Livepeer-App-Proxy-Address>` for use in future commands.

### Set the Agent App's permissions

In order for the Livepeer Aragon App to transact via the Agent, the following commands need to be run, to set the permissions on the Agent app:

```
dao acl create <DAO-Address> <Agent-App-Proxy-Address> EXECUTE_ROLE <Livepeer-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Agent-App-Proxy-Address> RUN_SCRIPT_ROLE <Livepeer-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

### Set the Livepeer Aragon App's permissions as recommended

Complete this script by setting the permissions as per [recommended set of permissions for configuration of the Livepeer Aragon DAO](https://github.com/videoDAC/livepeer-aragon/blob/master/recommended-permissions.md).
