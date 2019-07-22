const Kernel = artifacts.require("Kernel.sol")
const ACL = artifacts.require("ACL.sol")
const LivepeerAragonApp = artifacts.require("LivepeerAragonApp")

const KERNEL_ADDRESS = '0xa5Ba2D129eEAd7723b27C0864110dc99a149fac0'
const LIVEPEER_APP_ADDRESS = '0xa47b04c807ad903f1e00810dd67d63fed5939d12'
const ANY_ENTITY = '0xffffffffffffffffffffffffffffffffffffffff'

module.exports = async () => {

    try {
        const kernel = await Kernel.at(KERNEL_ADDRESS)
        const acl = await ACL.at(await kernel.acl())
        const livepeerAragonApp = await LivepeerAragonApp.at(LIVEPEER_APP_ADDRESS)

        const livepeerAragonAppRoles = [
            await livepeerAragonApp.SET_CONTROLLER_ROLE(),
            await livepeerAragonApp.APPROVE_ROLE(),
            await livepeerAragonApp.BOND_ROLE(),
            await livepeerAragonApp.APPROVE_AND_BOND_ROLE(),
            await livepeerAragonApp.CLAIM_EARNINGS_ROLE(),
            await livepeerAragonApp.WITHDRAW_FEES_ROLE(),
            await livepeerAragonApp.UNBOND_ROLE(),
            await livepeerAragonApp.REBOND_ROLE(),
            await livepeerAragonApp.WITHDRAW_STAKE_ROLE(),
            await livepeerAragonApp.DECLARE_TRANSCODER_ROLE(),
            await livepeerAragonApp.REWARD_ROLE(),
            await livepeerAragonApp.SET_SERVICE_URI_ROLE()
        ]

        for (let i = 0; i < livepeerAragonAppRoles.length; i++) {
            await acl.revokePermission(ANY_ENTITY, livepeerAragonApp, livepeerAragonAppRoles[i])
        }

    } catch (error) {
        console.log(error)
    }
}