## Livepeer Aragon Application - Installation Instructions

### Introduction

The Livepeer Aragon Application has been published to the aragonPM (Package Manager) under the ENS name livepeer.open.aragonpm.eth.

To see information about the published app, run `aragon apm info livepeer.open.aragonpm.eth` using aragonCLI.

### Pre-Requisites

**Installing this application requires using aragonCLI (Command Line Interface).** [Here is an introduction to aragonCLI](https://hack.aragon.org/docs/cli-intro.html), which includes instructions on how to install aragonCLI.

**These instructions also assume that there is an Aragon DAO already set up.** If you don't already have an Aragon DAO set up, I recommend following [these excellent instructions by @lkngtn from the AragonOne Team](https://forum.aragon.org/t/guide-custom-aragon-organization-deployment-using-the-cli/). Following these will also help you familiarise yourself with using the aragonCLI and the Aragon web interface, as well as introducing you to setting permissions in Aragon.

**The Ethereum account being used by aragonCLI must have the right permissions in the DAO**. The easiest way to do this is to assign this address the `Manage apps` permission on the `Kernel` and the `Create permissions` permission on the `ACL`. You can do this using the "Permissions" section of Aragon's browser-based UI. _This way, the aragonCLI can perform the actions without the DAO voting on it._ One alternative would be to provide a voting token to the account being used by aragonCLI. Another alternative is to grant "Any account" the permission to "Create new votes" on the "Voting" App.  _Using either of these alternative approaches will require every command run by the aragonCLI will need to be voted on by the DAO._

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

The app will be visible through the Aragon Rinkeby web interface once this vote has passed. Check using the URL http://rinkeby.aragon.org/#/DAO-Address.

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

However, for those who like living on the edge, you can use the same instructions as for installing on Rinkeby, with the following changes:

1. Substitute `--environment aragon:rinkeby` with `--environment aragon:mainnet` for all the aragonCLI commands.

2. Use `<Livepeer-Controller>` address as `0xf96d54e490317c557a967abfa5d6e33006be69b3` for Mainnet when you install the app.
