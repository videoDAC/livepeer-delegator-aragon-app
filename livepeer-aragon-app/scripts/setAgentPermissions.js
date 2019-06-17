const bn = require("bn.js")
const { hash } = require('eth-ens-namehash')
const Kernel = artifacts.require("Kernel.sol")
const ACL = artifacts.require("ACL.sol")
const Agent = artifacts.require("Agent.sol")

const DAO_ADDRESS = "0x67C77B17CABBC841bF7c070f2D738CF3B1eF95AC"

const ANY_ACCOUNT = "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

// Will need to change this to '.open.aragonpm.eth' for live nets
const ENS_EXTENSION = '.aragonpm.eth'

const FUNCTION_SIGNATURES = {
    // BOND: 'b78d27dc',
    // APPROVE: '095ea7b3',
    // CLAIM_EARNINGS: '24b1babf',
    // WITHDRAW: '476343ee',
    UNBOND: '27de9e32',
    // REBOND: 'eaffb3f9',
    // REBOND_FROM_UNBONDED: '3a080e93',
    // WIDTHDRAW_STAKE: '25d5971f',
    // TRANSCODER: '85aaff62',
    // REWARD: '228cb733',
    // SET_SERVICE_URI: '5f11301b'
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

const grantPermissionWithParams = async (acl, agent, livepeerAppAddress, permissionManager, executeRole) => {
    const params = Object.values(FUNCTION_SIGNATURES)
        .map(functionSignature => createParam('0x02', '01', functionSignature))

    const grantPermissionReceipt = await acl.grantPermissionP(livepeerAppAddress, agent.address, executeRole, params, { from: permissionManager })
    console.log(`Execute permission with function params granted: ${grantPermissionReceipt.tx}`)
}

const grantExecutePermission = async (permissionManager, acl, agent, livepeerAppAddress) => {

    console.log(`Granting execution permission to ${agent.address}...`)

    const executeRole = await agent.EXECUTE_ROLE()

    const executePermissionManager = await acl.getPermissionManager(agent.address, executeRole)
    if (executePermissionManager === ZERO_ADDRESS) {
        const createPermissionReceipt = await acl.createPermission(ZERO_ADDRESS, agent.address, executeRole, permissionManager)
        console.log(`Execute permission created: ${createPermissionReceipt.tx}`)
    }

    const grantPermissionReceipt = await acl.grantPermission(livepeerAppAddress, agent.address, executeRole, { from: permissionManager })
    console.log(`Execute permission granted: ${grantPermissionReceipt.tx}`)

    const permissionGrantedToZeroAddress = await acl.hasPermission(ZERO_ADDRESS, agent.address, executeRole)
    if (permissionGrantedToZeroAddress) {
        const revokePermissionReceipt = await acl.revokePermission(ZERO_ADDRESS, agent.address, executeRole)
        console.log(`Execute permission revoked for ${ZERO_ADDRESS}: ${revokePermissionReceipt.tx}`)
    }
}

const grantRunScriptPermission = async (permissionManager, acl, agent, livepeerAppAddress) => {
    const runScriptRole = await agent.RUN_SCRIPT_ROLE()
    const runScriptPermissionManager = await acl.getPermissionManager(agent.address, runScriptRole)
    const hasRunScriptPermission = await acl.hasPermission(livepeerAppAddress, agent.address, runScriptRole)

    if (runScriptPermissionManager === ZERO_ADDRESS) {
        const createPermissionReceipt = await acl.createPermission(livepeerAppAddress, agent.address, runScriptRole, permissionManager)
        console.log(`Run script permission created: ${createPermissionReceipt.tx}`)
    } else if (!hasRunScriptPermission) {
        const grantPermissionReceipt = await acl.grantPermission(livepeerAppAddress, agent.address, runScriptRole, { from: permissionManager })
        console.log(`Run script permission granted: ${grantPermissionReceipt.tx}`)
    }
}

const getAppId = name => hash(name + ENS_EXTENSION)

const getAppAddress = async (kernel, appName) => {
    const appId = getAppId(appName)

    const events = await kernel.getPastEvents('NewAppProxy', {
        fromBlock: await kernel.getInitializationBlock(),
        toBlock: 'latest',
    })

    const mappedToAppAddress = events
        .filter(event => event.returnValues.appId === appId)
        .map(event => ({
            proxyAddress: event.returnValues.proxy
        }))

    return mappedToAppAddress[0].proxyAddress
}

module.exports = async () => {

    try {
        const kernel = await Kernel.at(DAO_ADDRESS)
        const permissionManager = (await web3.eth.getAccounts())[0]
        const acl = await ACL.at(await kernel.acl())

        const agent = await Agent.at(await getAppAddress(kernel,'agent'))
        const livepeerAppAddress = await getAppAddress(kernel,'livepeer')

        await grantRunScriptPermission(permissionManager, acl, agent, livepeerAppAddress)
        await grantExecutePermission(permissionManager, acl, agent, livepeerAppAddress)

        // TODO: Add and test revokePermission functions
        // const grantPermissionReceipt = await acl.revokePermission(GRANT_TO_ADDRESS, livepeerAppAddress, role)

        process.exit()

    } catch (error) {
        console.error(error)
    }
}