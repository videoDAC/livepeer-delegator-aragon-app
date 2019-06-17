## Livepeer Aragon Application - Installation Instructions

### Introduction

The Livepeer Aragon Application has been published to the aragonPM (Package Manager) under the ENS name livepeer.open.aragonpm.eth.

To see information about the published app, run `aragon apm info livepeer.open.aragonpm.eth` using aragonCLI.

### Pre-Requisites

- **Installing this application requires using aragonCLI (Command Line Interface).**

  - [Here is an introduction to aragonCLI](https://hack.aragon.org/docs/cli-intro.html), which includes instructions on how to install aragonCLI.

- **These instructions also assume that there is an Aragon DAO already set up.**
  - If you don't already have an Aragon DAO set up, I recommend following [these excellent instructions by @lkngtn from the AragonOne Team](https://hack.aragon.org/docs/guides-custom-deploy).
  - Following these will also help you familiarise yourself with using the aragonCLI and the Aragon web interface, as well as introducing you to setting permissions in Aragon.

- **The Ethereum account being used by aragonCLI must have the right permissions in the DAO**.
  - The easiest way to do this is to assign this address the `Manage apps` permission on the `Kernel` and the `Create permissions` permission on the `ACL`.
  - You can do this using the "Permissions" section of Aragon's browser-based UI.
  - _This way, the aragonCLI can perform the actions without the DAO voting on it._
  
  - One alternative would be to provide a voting token to the account being used by aragonCLI.
  - Another alternative is to grant "Any account" the permission to "Create new votes" on the "Voting" App.
  - _Using either of these alternative approaches will require every command run by the aragonCLI will need to be voted on by the DAO._
  
- `aragon ipfs` is running in your environment.
  - Open a new Terminal window
  - Type `aragon ipfs` and press return
  - Wait for it to start up, and then you are ready to go

### Installing to an Aragon DAO on Rinkeby

**1. Install the app**

**Run the `install` command using aragonCLI:**

```
dao install <DAO-Address> livepeer.open.aragonpm.eth --app-init-args <Livepeer-Controller> --environment aragon:rinkeby
```

Where:

- `<DAO-Address>` is the address of the Aragon DAO you are installing on. This can be the full address or the ENS name.
- `<Livepeer-Controller>` address is `0x37dC71366Ec655093b9930bc816E16e6b587F968` for Rinkeby.

**2. Pass the vote on the Aragon DAO to install the app.**

_This step is only required if the aragonCLI does not have permission to Manage apps._

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

**5. Pass the vote to set the first Permission**

_This step is only required if the aragonCLI does not have permission to Create permissions._

There should be a vote in the DAO's Voting app entitled

> ACL: Create a new permission granting 'Voting' the ability to perform actions of role 'Approve and Bond to address' on 'Livepeer' (setting <Manager-Address> as the permission manager)

The app will be visible through the Aragon Rinkeby web interface once this vote has passed. Check using the URL http://rinkeby.aragon.org/#/DAO-Address.

 🎉 🎉 🎉 🎉 ***The Livepeer App can now approve and bond Livepeer Tokens using Livepeer's Protocol.*** 🎉 🎉 🎉 🎉

### IMPORTANT THING to know about operating this app on Rinkeby

Something you need to be aware of is that nothing will work on Livepeer Protocol unless the protocol is "running".

You can tell if it's "running" by **setting your browser's signer to use Rinkeby**, then going to [Livepeer's Procol Explorer](https://explorer.livepeer.org/transcoders) - if the icon in the top left is green, then the Protocol is "running".

![image](https://user-images.githubusercontent.com/2212651/57988140-6c21c380-7a82-11e9-96c3-7f9ac07fb175.png)

If it is NOT running, you can click the orange panel in the top left and then "Initialise Round". This will allow you to submit a transaction to initialize the round, which will run for (currently) 50 blocks.

![image](https://user-images.githubusercontent.com/2212651/57988132-4ac0d780-7a82-11e9-9e74-75bad8883897.png)

So things might not work because the Livepeer Protocol isn't running, and therefore the protocol can't take requests.

### Granting permissions for roles on the app

The following roles can now be assigned using the same process as setting the first permission:

- APPROVE_AND_BOND_ROLE
- CLAIM_EARNINGS_ROLE
- UNBOND_ROLE
- WITHDRAW_STAKE_ROLE
- DECLARE_TRANSCODER_ROLE
- SET_SERVICE_URI_ROLE
- REWARD_ROLE
- APPROVE_ROLE
- BOND_ROLE
- TRANSFER_ROLE  
- SET_CONTROLLER_ROLE

Depending on your DAO's set up and intended usage, some permissions may require parameters to be set to restrict/allow access to certain functions.

[A sample set of permissions can be found in this DAO on Rinkeby](https://rinkeby.aragon.org/#/video.aragonid.eth/permissions?p=app.0x0069ee94a2c6964221c45a402d8b1ff0c45224b6). [Here is a list of CLI commands to run to set the permissions as per this example](https://github.com/videoDAC/livepeer-aragon/blob/master/recommended-permissions.md).

A script for setting the agent parameter permissions can be found at `/livepeer-aragon-app/scripts/setAgentPermissions.js`

### Installing to an Aragon DAO on Mainnet

As far as we are aware, at the time of writing, this application has not been installed on Mainnet.

***It has not yet passed a security audit, so if you install on Mainnet, you do so at your own risk.***

However, for those who like living on the edge, you can use the same instructions as for installing on Rinkeby, with the following changes:

1. Substitute `--environment aragon:rinkeby` with `--environment aragon:mainnet` for all the aragonCLI commands.

2. Use `<Livepeer-Controller>` address as `0xf96d54e490317c557a967abfa5d6e33006be69b3` for Mainnet when you install the app.
