const bn = require("bn.js")
const ACL = artifacts.require("ACL.sol")
const Agent = artifacts.require("Agent.sol")

const ACL_ADDRESS = "0x184c81675e89b6445befad31f9dfbd63b8c95a36"
const AGENT_ADDRESS = "0xfBCBa648Dff9dB0d8aA472bA9CD3e24fEe7B041D"

const LIVEPEER_APP_ADDRESS = "0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb"
const ANY_ADDRESS = "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const FUNCTION_SIGNATURES = {
    BOND: 'b78d27dc',
    APPROVE: '095ea7b3'
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

module.exports = async () => {

    try {
        const functionSignature = FUNCTION_SIGNATURES.BOND

        console.log(`Granting permission to execute ${functionSignature} to ${AGENT_ADDRESS}...`)

        const permissionManager = (await web3.eth.getAccounts())[0]
        const acl = await ACL.at(ACL_ADDRESS)
        const agent = await Agent.at(AGENT_ADDRESS)

        const param = createParam("0x02", "01", functionSignature)
        const role = await agent.EXECUTE_ROLE()

        const rolePermissionManager = await acl.getPermissionManager(agent.address, role)

        if (rolePermissionManager === ZERO_ADDRESS) {
            const createPermissionReceipt = await acl.createPermission(ZERO_ADDRESS, agent.address, role, permissionManager)
        }

        const grantPermissionReceipt = await acl.grantPermissionP(LIVEPEER_APP_ADDRESS, AGENT_ADDRESS, role, [param], { from: permissionManager })
        // const grantPermissionReceipt = await acl.revokePermission(GRANT_TO_ADDRESS, LIVEPEER_APP_ADDRESS, role)

        console.log(`Permission granted: ${grantPermissionReceipt.tx}`)

        process.exit()

    } catch (error) {
        console.error(error)
    }
}