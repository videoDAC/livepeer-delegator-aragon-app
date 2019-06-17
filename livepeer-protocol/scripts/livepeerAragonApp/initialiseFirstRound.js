const Controller = artifacts.require("Controller")
const AdjustableRoundsManager = artifacts.require("AdjustableRoundsManager")

const {contractId} = require("../../utils/helpers")

const roundLength = 10 // blocks. Actual value is 5760 ~ 24 hours

module.exports = async () => {

    try {

        let controller
        let roundsManager

        console.log("Initialising round...")

        controller = await Controller.deployed()

        if (await controller.paused()) {
            const unpauseReceipt = await controller.unpause()
            console.log("Livepeer unpaused: " + unpauseReceipt.tx)
        }

        const roundsManagerAddr = await controller.getContract(contractId("RoundsManager"))
        roundsManager = await AdjustableRoundsManager.at(roundsManagerAddr)

        const setRoundReceipt = await roundsManager.setRoundLength(roundLength)
        console.log("Round length set to: " + roundLength + " tx: " + setRoundReceipt.tx)

        const mineBlocksReceipt = await roundsManager.mineBlocks(roundLength)
        console.log("Skip forward blocks: " + mineBlocksReceipt.tx)

        const initializeRoundTxHash = await roundsManager.initializeRound()
        console.log("Round initialized: " + initializeRoundTxHash.tx)

        process.exit()

    } catch (error) {
        console.log(error)
    }
}
