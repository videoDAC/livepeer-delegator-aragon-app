const bn = require("bn.js")
const ACL = artifacts.require("ACL.sol")
const Agent = artifacts.require("Agent.sol")

const ACL_ADDRESS = "0xed702e73a86dbf47a8fd1f56e1f006500a6905fe"
const LIVEPEER_APP_ADDRESS = "0xbe9edbce85249c0da94da7a1cc9b7fe13683141f"

const GRANT_TO_ADDRESS = "0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb"
const ANY_ADDRESS = "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"

// Function sigs:
// Bond: b78d27dc
// Approve: 095ea7b3
const FUNCTION_SIGNATURE = "b78d27dc"

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

    console.log(`Granting permission to execute ${FUNCTION_SIGNATURE} to ${LIVEPEER_APP_ADDRESS}...`)

    const permissionManager = (await web3.eth.getAccounts())[0]
    const acl = await ACL.at(ACL_ADDRESS)
    const app = await Agent.at(LIVEPEER_APP_ADDRESS)

    const param = createParam("0x02", "01", FUNCTION_SIGNATURE)
    const role = await app.EXECUTE_ROLE()

    const grantPermissionReceipt = await acl.grantPermissionP(GRANT_TO_ADDRESS, LIVEPEER_APP_ADDRESS, role, [param], { from: permissionManager })
    // const grantPermissionReceipt = await acl.revokePermission(GRANT_TO_ADDRESS, LIVEPEER_APP_ADDRESS, role)

    console.log(`Permission granted: ${grantPermissionReceipt.tx}`)

    process.exit()
}