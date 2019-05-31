import React, {useState} from 'react'
import {Main, TabBar, SidePanel} from '@aragon/ui'
import {useAragonApi} from '@aragon/api-react'

import {
    setLivepeerController,
    transferLptFromApp,
    transferLptToApp,
    approveAndBond,
    bondingManagerUnbond,
    bondingManagerRebond,
    bondingManagerRebondFromUnbonded,
    bondingManagerWithdraw,
    bondingManagerClaimEarnings,
    bondingManagerWithdrawFees,
    bondingManagerDeclareTranscoder,
    bondingManagerTranscoderReward,
    serviceRegistrySetServiceUri, transferEthFromApp
} from '../web3/LivepeerApp'

import Delegator from './components/tabs/delegator/Delegator'
import Transcoder from './components/tabs/transcoder/Transcoder';
import DeclareTranscoder from './components/side-panel-input/transcoder/DeclareTranscoder';
import SetServiceUri from './components/side-panel-input/transcoder/SetServiceUri';
import Account from './components/tabs/account/Account';
import GenericInputPanel from './components/side-panel-input/GenericInputPanel';
import Settings from './components/tabs/settings/Settings';
import RebondFromUnbonded from "./components/side-panel-input/RebondFromUnbonded";
import {DELEGATOR_STATUS} from "./app-state-reducer";
import AppLayout from "./components/AppLayout";

// TODO: Convert App() to a class. Add defaultProps and propTypes to components. Extract strings. Extract common spacing (px values).
function App() {

    const {api, appState} = useAragonApi()
    const [tabBarSelected, setTabBarSelected] = useState(0)
    const [sidePanel, setSidePanel] = useState(undefined)

    const setController = (address) => {
        closeSidePanel()
        setLivepeerController(api, address)
    }

    const transferEthOut = (toAddress, amount) => {
        closeSidePanel()
        transferEthFromApp(api, toAddress, amount)
    }

    const transferTokensIn = (amount) => {
        closeSidePanel()
        transferLptToApp(api, amount)
    }

    const transferTokensOut = (toAddress, amount) => {
        closeSidePanel()
        transferLptFromApp(api, toAddress, amount)
    }

    const approveAndBondTokens = (tokenCount, bondToAddress) => {
        closeSidePanel()
        approveAndBond(api, tokenCount, bondToAddress)
    }

    const unbondTokens = (tokenCount) => {
        closeSidePanel()
        bondingManagerUnbond(api, tokenCount)
    }

    const rebondTokens = (unbondingLockId) => {
        if (appState.delegatorInfo.delegatorStatus === DELEGATOR_STATUS.UNBONDED) {
            setSidePanel(sidePanels.REBOND_FROM_UNBONDED(unbondingLockId))
        } else {
            bondingManagerRebond(api, unbondingLockId)
        }
    }

    const rebondFromUnbonded = (to, unbondingLockId) => {
        closeSidePanel()
        bondingManagerRebondFromUnbonded(api, to, unbondingLockId)
    }

    const claimEarnings = (upToRound) => {
        closeSidePanel()
        bondingManagerClaimEarnings(api, upToRound)
    }

    const withdrawFees = () => bondingManagerWithdrawFees(api)

    const withdrawTokens = (unbondingLockId) => bondingManagerWithdraw(api, unbondingLockId)

    const declareTranscoder = (rewardCut, feeShare, pricePerSegment) => {
        closeSidePanel()
        bondingManagerDeclareTranscoder(api, rewardCut, feeShare, pricePerSegment)
    }

    const transcoderReward = () => bondingManagerTranscoderReward(api)

    const setServiceUri = (serviceUri) => {
        closeSidePanel()
        serviceRegistrySetServiceUri(api, serviceUri)
    }

    const closeSidePanel = () => setSidePanel(undefined)

    const sidePanels = {
        APPROVE_AND_BOND: {
            title: 'Approve and Bond',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Livepeer Action'}
                                   actionDescription={`This action will approve the specified number of Livepeer tokens on
                                    the Livepeer Token contract then bond them to the specified address. To change the address
                                    bonded too, set the amount to 0 and specify the new address.`}
                                   inputFieldList={[
                                       {id: 1, label: 'token amount', type: 'number'},
                                       {id: 2, label: 'bond to address', type: 'text'}]}
                                   submitLabel={'Approve and Bond'}
                                   handleSubmit={approveAndBondTokens}/>
            )
        },
        UNBOND: {
            title: 'Unbond Tokens',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Livepeer Action'}
                                   actionDescription={`This action will unbond the specified number of tokens, creating an
                                    unbonding lock which can be withdrawn at a later time.`}
                                   inputFieldList={[
                                       {id: 1, label: 'token amount', type: 'number'}]}
                                   submitLabel={'Unbond'}
                                   handleSubmit={unbondTokens}/>
            )
        },
        REBOND_FROM_UNBONDED: (unbondingLockId) => {
            return {
                title: 'Rebond Tokens',
                sidePanelComponent: (
                    <RebondFromUnbonded unbondingLockId={unbondingLockId}
                                        handleRebondFromUnbonded={rebondFromUnbonded}/>
                )
            }
        },
        CLAIM_EARNINGS: {
            title: 'Claim Earnings',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Livepeer Action'}
                                   actionDescription={`This action will claim earnings up to the specified round. This is necessary
                                   when unbonding is not possible due to not having called claim earnings for some time.`}
                                   inputFieldList={[
                                       {id: 1, label: 'up to round', type: 'number'}]}
                                   submitLabel={'Claim Earnings'}
                                   handleSubmit={claimEarnings}/>
            )
        },
        DECLARE_TRANSCODER: {
            title: 'Declare Transcoder',
            sidePanelComponent: (
                <DeclareTranscoder handleDeclareTranscoder={declareTranscoder}/>
            )
        },
        SET_SERVICE_URI: {
            title: 'Set Service URI',
            sidePanelComponent: (
                <SetServiceUri handleSetServiceUri={setServiceUri}/>
            )
        },
        TRANSFER_ETH_OUT: {
            title: 'Transfer Ethereum From App',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Transfer Action'}
                                   actionDescription={`This action will transfer the specified amount of Ethereum (ETH)
                                   from the Livepeer App to the address specified`}
                                   inputFieldList={[
                                       {id: 1, label: 'address', type: 'text'},
                                       {id: 2, label: 'amount', type: 'number'}]}
                                   submitLabel={'Transfer Out'}
                                   handleSubmit={transferEthOut}/>
            )
        },
        TRANSFER_IN: {
            title: 'Transfer Livepeer Tokens To App',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Transfer Action'}
                                   actionDescription={`This action will transfer the specified amount of Livepeer Tokens
                                                       (LPT) from your wallet to the Livepeer App.`}
                                   inputFieldList={[
                                       {id: 1, label: 'amount', type: 'number'}]}
                                   submitLabel={'Transfer In'}
                                   handleSubmit={transferTokensIn}/>
            )
        },
        TRANSFER_OUT: {
            title: 'Transfer Livepeer Tokens From App',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Transfer Action'}
                                   actionDescription={`This action will transfer the specified amount of Livepeer Tokens
                                    (LPT) from the Livepeer App to the address specified.`}
                                   inputFieldList={[
                                       {id: 1, label: 'address', type: 'text'},
                                       {id: 2, label: 'amount', type: 'number'}]}
                                   submitLabel={'Transfer Out'}
                                   handleSubmit={transferTokensOut}/>
            )
        },
        CHANGE_CONTROLLER: {
            title: 'Change the Livepeer Controller',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Livepeer Action'}
                                   actionDescription={`This action will change the Livepeer Controller which is responsible
                                    for defining the addresses of the Livepeer Contracts`}
                                   inputFieldList={[
                                       {id: 1, label: 'address', type: 'text'}]}
                                   submitLabel={'Change controller'}
                                   handleSubmit={setController}/>
            )
        }
    }

    const tabs = [
        {
            tabName: 'Delegator',
            tabComponent: (
                <Delegator appState={appState}
                           approveAndBondTokens={() => setSidePanel(sidePanels.APPROVE_AND_BOND)}
                           unbondTokens={() => setSidePanel(sidePanels.UNBOND)}
                           claimEarnings={() => setSidePanel(sidePanels.CLAIM_EARNINGS)}
                           rebondTokens={rebondTokens}
                           withdrawFees={withdrawFees}
                           withdrawTokens={withdrawTokens}
                />)
        },
        {
            tabName: 'Transcoder',
            tabComponent: (
                <Transcoder appState={appState}
                            handleDeclareTranscoder={() => setSidePanel(sidePanels.DECLARE_TRANSCODER)}
                            handleTranscoderReward={transcoderReward}
                            handleSetServiceUri={() => setSidePanel(sidePanels.SET_SERVICE_URI)}
                />)
        },
        {
            tabName: 'Account',
            tabComponent: (
                <Account appState={appState}
                         handleTransferIn={() => setSidePanel(sidePanels.TRANSFER_IN)}
                         handleTransferOut={() => setSidePanel(sidePanels.TRANSFER_OUT)}
                         handleTransferEthOut={() => setSidePanel(sidePanels.TRANSFER_ETH_OUT)}
                />)
        },
        {
            tabName: 'Settings',
            tabComponent: (
                <Settings appState={appState}
                          handleNewController={() => setSidePanel(sidePanels.CHANGE_CONTROLLER)}
                />)
        }
    ]
    const tabsNames = tabs.map(tab => tab.tabName)
    const selectedTabComponent = tabs[tabBarSelected].tabComponent


    return (
        <Main>

            <AppLayout title='Livepeer'
                       tabs={(<TabBar
                           items={tabsNames}
                           selected={tabBarSelected}
                           onChange={setTabBarSelected}/>)}>
                
                {selectedTabComponent}

            </AppLayout>

            <SidePanel title={sidePanel ? sidePanel.title : ''} opened={sidePanel !== undefined}
                       onClose={() => closeSidePanel()}>
                {sidePanel ? sidePanel.sidePanelComponent : <div/>}
            </SidePanel>
        </Main>
    )
}

export default App