const Controller = artifacts.require("Controller")
const JobsManager = artifacts.require("JobsManager")
const BondingManager = artifacts.require("BondingManager")
const LivepeerToken = artifacts.require("LivepeerToken")
const AdjustableRoundsManager = artifacts.require("AdjustableRoundsManager")
const {contractId} = require("../../utils/helpers")
const {createTranscodingOptions} = require("../../utils/videoProfile");
const BigNumber = require("BigNumber.js")

const JOB_ID = 0 // Needs to change with each new job.
const STREAM_ID = 'foo'
const BOND_AMOUNT = 100000000000000000000 // 100 LPT
const MAX_PRICE_PER_SEGMENT = 10000
const REWARD_CUT = 15000 // 1.5%
const FEE_SHARE = 500000 // 50%
const WEI_VALUE = 100

module.exports = async () => {

    try {

        let controller
        let jobsManager
        let bondingManager
        let livepeerToken
        let roundsManager

        const accounts = await web3.eth.getAccounts()
        const transcoder = accounts[0]
        const broadcaster = accounts[1]
        const bondAmountBn = new BigNumber(BOND_AMOUNT)
        const weiValueBn = new BigNumber(WEI_VALUE)
        const transcodingOptions = createTranscodingOptions([STREAM_ID])
        const segmentRange = [0, 3]
        const claimRoot = web3.utils.sha3(STREAM_ID)

        console.log("Generating fees for transcoder...")



        controller = await Controller.deployed()

        const livepeerTokenAddress = await controller.getContract(contractId("LivepeerToken"))
        livepeerToken = await LivepeerToken.at(livepeerTokenAddress)

        const jobsManagerAddr = await controller.getContract(contractId("JobsManager"))
        jobsManager = await JobsManager.at(jobsManagerAddr)

        const bondingManagerAddress = await controller.getContract(contractId("BondingManager"))
        bondingManager = await BondingManager.at(bondingManagerAddress)

        const roundsManagerAddr = await controller.getContract(contractId("RoundsManager"))
        roundsManager = await AdjustableRoundsManager.at(roundsManagerAddr)


        const setBlockNumReceipt = await roundsManager.setBlockNum(await web3.eth.getBlockNumber())
        console.log(`Set block number: ${setBlockNumReceipt.tx}`)

        const approveReceipt = await livepeerToken.approve(bondingManagerAddress, bondAmountBn, {from: transcoder})
        console.log(`Approved ${BOND_AMOUNT} LPT for bonding manager to spend: ${approveReceipt.tx}`)

        const bondToTranscoder = await bondingManager.bond(bondAmountBn, transcoder, {from: transcoder})
        console.log(`Bonded ${BOND_AMOUNT} LPT to transcoder: ${bondToTranscoder.tx}`)

        const transcoderReceipt = await bondingManager.transcoder(REWARD_CUT, FEE_SHARE, weiValueBn, {from: transcoder}) // (1.5%, 50%, 150 Gwei)
        console.log(`Declare ${transcoder} as transcoder: ${transcoderReceipt.tx}`)

        const depositReceipt = await jobsManager.deposit({from: broadcaster, value: 1000})
        console.log(`Deposit completed: ${depositReceipt.tx}`)

        const jobReceipt = await jobsManager.job(STREAM_ID, transcodingOptions, MAX_PRICE_PER_SEGMENT, await web3.eth.getBlockNumber() + 20, {from: broadcaster})
        console.log(`Job created: ${jobReceipt.tx}`)

        // const claimWorkReceipt = await jobsManager.claimWork(JOB_ID, segmentRange, claimRoot, {from: transcoder})
        // console.log(`Worked claimed: ${claimWorkReceipt.tx}`)
        //
        // const distributeFeesReceipt = await jobsManager.distributeFees(JOB_ID, 0, {from: transcoder})
        // console.log(`Fees distributed: ${distributeFeesReceipt.tx}`)



        process.exit()

    } catch (error) {
        console.log(error)
    }
}
