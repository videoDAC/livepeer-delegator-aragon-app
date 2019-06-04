import LivepeerFixture from "./helpers/LivepeerFixture"
import DaoDeployment from './helpers/DaoDeployment'
import {deployedContract} from "./helpers/helpers"
const LivepeerAragonApp = artifacts.require('LivepeerAragonApp')

// TODO: Create app specific child class of DaoDeployment to abstract some of the setup
contract('LivepeerAragonApp', ([root, livepeerControllerMock]) => {

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

        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, SET_CONTROLLER_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, APPROVE_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, BOND_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, APPROVE_AND_BOND_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, CLAIM_EARNINGS_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, WITHDRAW_FEES_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, UNBOND_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, REBOND_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, WITHDRAW_STAKE_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, DECLARE_TRANSCODER_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, REWARD_ROLE, root)
        await daoDeployment.acl.createPermission(ANY_ADDR, livepeerAragonApp.address, SET_SERVICE_URI_ROLE, root)
    }

    afterEach(async () => {
        await livepeerFixture.tearDown()
    })

    describe('initialize(address _livepeerController)', () => {

        beforeEach(async () => {
            await livepeerAragonApp.initialize(livepeerFixture.controller.address)
        })

        it("sets the livepeer controller address", async () => {
            const expectedLivepeerControllerAdddress = livepeerFixture.controller.address
            const actualLivepeerControllerAddress = await livepeerAragonApp.livepeerController()
            assert.strictEqual(actualLivepeerControllerAddress, expectedLivepeerControllerAdddress)
        })

        describe('setLivepeerController(address _address)', () => {

            it('sets the livepeer controller address', async () => {
                await livepeerAragonApp.setLivepeerController(livepeerControllerMock)

                const actualLivepeerControllerAddress = await livepeerAragonApp.livepeerController()
                assert.strictEqual(actualLivepeerControllerAddress, livepeerControllerMock)
            })
        })

        describe('livepeerTokenApprove(uint256 _value)', () => {

            it()
        })
    })

})