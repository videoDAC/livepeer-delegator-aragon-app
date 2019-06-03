import LivepeerFixture from "../../livepeer-protocol/test/unit/helpers/Fixture"
import DaoDeployment from './helpers/DaoDeployment'
import {deployedContract} from "./helpers/helpers"
const LivepeerAragonApp = artifacts.require('LivepeerAragonApp')


contract('LivepeerAragonApp', ([root]) => {

    let livepeerFixture = new LivepeerFixture(web3)
    let daoDeployment = new DaoDeployment()
    let livepeerAragonAppBase, livepeerAragonApp

    const ANY_ADDR = '0xffffffffffffffffffffffffffffffffffffffff'

    before(async () => {
        await livepeerFixture.deploy()
        await daoDeployment.deployBefore()
        livepeerAragonAppBase = await LivepeerAragonApp.new()
    })

    beforeEach(async () => {
        await livepeerFixture.setUp()
        await daoDeployment.deployBeforeEach(root)
        await createLivepeerAragonAppProxy()
        await createAppPermissions()
    })

    const createLivepeerAragonAppProxy = async () => {
        const newAppReceipt = await daoDeployment.kernel.newAppInstance('0x1234', livepeerAragonAppBase.address)
        livepeerAragonApp = await LivepeerAragonApp.at(deployedContract(newAppReceipt))
        await livepeerAragonApp.initialize(livepeerFixture.controller.address)
    }

    async function createAppPermissions() {
        const SET_CONTROLLER_ROLE = await livepeerAragonAppBase.SET_CONTROLLER_ROLE()
        const APPROVE_ROLE = await livepeerAragonAppBase.APPROVE_ROLE()
        const BOND_ROLE = await livepeerAragonAppBase.BOND_ROLE()
        const APPROVE_AND_BOND_ROLE = await livepeerAragonAppBase.APPROVE_AND_BOND_ROLE()
        const CLAIM_EARNINGS_ROLE = await livepeerAragonAppBase.CLAIM_EARNINGS_ROLE()
        const WITHDRAW_FEES_ROLE = await livepeerAragonAppBase.WITHDRAW_FEES_ROLE()
        const UNBOND_ROLE = await livepeerAragonAppBase.UNBOND_ROLE()
        const REBOND_ROLE = await livepeerAragonAppBase.REBOND_ROLE()
        const WITHDRAW_STAKE_ROLE = await livepeerAragonAppBase.WITHDRAW_STAKE_ROLE()
        const DECLARE_TRANSCODER_ROLE = await livepeerAragonAppBase.DECLARE_TRANSCODER_ROLE()
        const REWARD_ROLE = await livepeerAragonAppBase.REWARD_ROLE()
        const SET_SERVICE_URI_ROLE = await livepeerAragonAppBase.SET_SERVICE_URI_ROLE()

        // await daoDeployment.acl.createPermission(ANY_ADDR, agent.address, EXECUTE_ROLE, owner, {from: owner})
    }

    afterEach(async () => {
        await livepeerFixture.tearDown()
    })

    it("gets to test", async () => {

    })
})