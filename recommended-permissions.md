### Introduction

This document contains the recommended set of permissions for configuration of the Livepeer Aragon DAO.

The permissions are as set on the [video.aragonid.eth DAO on Rinkeby](https://rinkeby.aragon.org/#/video.aragonid.eth/permissions?p=app.0x0069ee94a2c6964221c45a402d8b1ff0c45224b6).

If your DAO is on Rinkeby, you must add `--environment aragon:rinkeby` to each command.

If your DAO is on Mainnet, you must add `--environment aragon:mainnet` to each command.

#### Roles which control functions which are recommended to pass a vote of the DAO

The following commands set the roles to be managed fully by the Voting app.

```
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> APPROVE_AND_BOND_ROLE <Voting-Address> <Voting-Address>
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> DECLARE_TRANSCODER_ROLE <Voting-Address> <Voting-Address>
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> SET_SERVICE_URI_ROLE <Voting-Address> <Voting-Address>
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> UNBOND_ROLE <Voting-Address> <Voting-Address>
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> TRANSFER_ROLE <Voting-Address> <Voting-Address>
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> APPROVE_ROLE <Voting-Address> <Voting-Address>
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> BOND_ROLE <Voting-Address> <Voting-Address>
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> SET_CONTROLLER_ROLE <Voting-Address> <Voting-Address>
```

#### Roles which control functions which could be performed by anyone

The following commands set the roles which can be performed by "Any account", with any changes to role permissions managed by the Voting app:

```
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> REWARD_ROLE 0xffffffffffffffffffffffffffffffffffffffff <Voting-Address>
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> WITHDRAW_STAKE_ROLE 0xffffffffffffffffffffffffffffffffffffffff <Voting-Address>
dao acl create <DAO-Address> <Livepeer-App-Proxy-Address> CLAIM_EARNINGS_ROLE 0xffffffffffffffffffffffffffffffffffffffff <Voting-Address>
```

REWARD_ROLE allows the entity to call `reward` on behalf of app when it is acting as a Transcoder.

CLAIM_EARNINGS_ROLE allowsthe entity to claim earnings on behalf of a Delegator. There is no economic incentive to call this, other than to be able to unbond the tokens earned, and is merely a way to update the accounting in the protocol.

WITHDRAW_STAKE_ROLE allows the entity to withdraw stake on behalf of the Delegator, after the stake has been unbonding, and the appropriate unbonding period has lapsed.
