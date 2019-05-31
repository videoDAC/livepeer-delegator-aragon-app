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
dao apps <DAO-Address> --all --environment aragon:rinkeby
```

> This returns the `<Token-Manager-Proxy-Address>` for use in future commands.

```
dao token change-controller <DAO-Token-Address> <Token-Manager-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Token-Manager-Proxy-Address> MINT_ROLE <Your-AragonCLI-Address> <Your-AragonCLI-Address> --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> initialize <DAO-Token-Address> true 0 --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> mint <Your-AragonCLI-Address> 1 --environment aragon:rinkeby
dao install <DAO-Address> voting --app-init-args <DAO-Token-Address> 500000000000000000 250000000000000000 86400 --environment aragon:rinkeby
dao apps <DAO-Address> --all --environment aragon:rinkeby
```

> This returns `<Voting-App-Proxy-Address>` for use in future commands.

```
dao acl create <DAO-Address> <Voting-App-Proxy-Address> CREATE_VOTES_ROLE <Token-Manager-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

You have now created a basic app on Aragon, with a token and basic apps.

### Install the Livepeer Aragon App

```
dao install <DAO-Address> livepeer.open.aragonpm.eth --app-init-args 0x37dC71366Ec655093b9930bc816E16e6b587F968 --environment aragon:rinkeby
dao apps <DAO-Address> --all --environment aragon:rinkeby
```

> This returns  the `Proxy address` for an app named `0x668fe7ef9366b1f27e1e18a59fd2cdec041ad223e3506bf0cb6d1ab981781e75` as the `<Livepeer-App-Proxy-Address>` for use in future commands.

### Set the Livepeer Aragon App's permissions as recommended

Complete this script by setting the permissions as per [recommended set of permissions for configuration of the Livepeer Aragon DAO.](https://github.com/videoDAC/livepeer-aragon/blob/master/recommended-permissions.md).
