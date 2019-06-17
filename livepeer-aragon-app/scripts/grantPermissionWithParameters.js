const bn = require("bn.js")
const ACL = artifacts.require("ACL.sol")
const Agent = artifacts.require("Agent.sol")
const { hash } = require('eth-ens-namehash')

const ACL_ADDRESS = "0x6419d92055cacd5e484552ae3eea414443ab83c3"
const AGENT_ADDRESS = "0x768188B6d051efDB6EcB75F5AEeDe499029E5912"
const LIVEPEER_APP_ADDRESS = "0x9de2f17ffaaf273cd8a58bc857728fb3235b72bb"

const ANY_ACCOUNT = "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const FUNCTION_SIGNATURES = {
    BOND: 'b78d27dc',
    APPROVE: '095ea7b3',
    CLAIM_EARNINGS: '24b1babf',
    WITHDRAW: '476343ee',
    UNBOND: '27de9e32',
    REBOND: 'eaffb3f9',
    REBOND_FROM_UNBONDED: '3a080e93',
    WIDTHDRAW_STAKE: '25d5971f',
    TRANSCODER: '85aaff62',
    REWARD: '228cb733',
    SET_SERVICE_URI: '5f11301b'
}

/**
 *
 * @param argId arg number in called function, in the case of execute(target, ethValue, data) from Agent.sol this is number 2, the data field.
 *              Note the data field is also reduced to the first 4 bytes of the passed data (the function sig) in Agent.sol
 * @param operation The Op enum number in ACL.sol. For the execute function use 1, 'equal to'.
 * @param functionSignature The functions signature
 */
const createParam = (argId, operation, functionSignature) => {
    const value = `0000000000000000000000000000000000000000000000000000${functionSignature}` // The functions signature
    return new bn(`${argId}${operation}${value}`, 16)
}

const grantPermissionToExecuteFunction = async (permissionManager, acl, agent, functionSignature) => {

    console.log(`Granting permission to execute ${functionSignature} to ${agent.address}...`)

    const param = createParam("0x02", "01", functionSignature)
    const executeRole = await agent.EXECUTE_ROLE()

    const executePermissionManager = await acl.getPermissionManager(agent.address, executeRole)

    if (executePermissionManager === ZERO_ADDRESS) {
        const createPermissionReceipt = await acl.createPermission(ZERO_ADDRESS, agent.address, executeRole, permissionManager)
        console.log(`Execute permission created: ${createPermissionReceipt.tx}`)
    }

    const grantPermissionReceipt = await acl.grantPermissionP(LIVEPEER_APP_ADDRESS, agent.address, executeRole, [param], { from: permissionManager })
    console.log(`Execute permission granted: ${grantPermissionReceipt.tx}`)

    const permissionGrantedToZeroAddress = await acl.hasPermission(ZERO_ADDRESS, agent.address, executeRole)
    if (permissionGrantedToZeroAddress) {
        const revokePermissionReceipt = await acl.revokePermission(ZERO_ADDRESS, agent.address, executeRole)
        console.log(`Execute permission revoked for ${ZERO_ADDRESS}: ${revokePermissionReceipt.tx}`)
    }
}

const grantRunScriptPermission = async (permissionManager, acl, agent) => {
    const runScriptRole = await agent.RUN_SCRIPT_ROLE()
    const runScriptPermissionManager = await acl.getPermissionManager(agent.address, runScriptRole)
    const hasRunScriptPermission = await acl.hasPermission(LIVEPEER_APP_ADDRESS, agent.address, runScriptRole)

    if (runScriptPermissionManager === ZERO_ADDRESS) {
        const createPermissionReceipt = await acl.createPermission(LIVEPEER_APP_ADDRESS, agent.address, runScriptRole, permissionManager)
        console.log(`Run script permission created: ${createPermissionReceipt.tx}`)
    } else if (!hasRunScriptPermission) {
        const grantPermissionReceipt = await acl.grantPermission(LIVEPEER_APP_ADDRESS, agent.address, runScriptRole, { from: permissionManager })
        console.log(`Run script permission granted: ${grantPermissionReceipt.tx}`)
    }
}

module.exports = async () => {

    try {
        const permissionManager = (await web3.eth.getAccounts())[0]
        const acl = await ACL.at(ACL_ADDRESS)
        const agent = await Agent.at(AGENT_ADDRESS)

        // await grantRunScriptPermission(permissionManager, acl, agent)

        // const functionSignature = FUNCTION_SIGNATURES.APPROVE
        // await grantPermissionToExecuteFunction(permissionManager, acl, agent, functionSignature)

        // TODO: Add and test revokePermission function.
        // const grantPermissionReceipt = await acl.revokePermission(GRANT_TO_ADDRESS, LIVEPEER_APP_ADDRESS, role)

        process.exit()

    } catch (error) {
        console.error(error)
    }
}