import React, {useState} from 'react'
import {Main, AppView, TabBar, SidePanel} from '@aragon/ui'
import styled from 'styled-components'
import {useAragonApi} from '@aragon/api-react'

import {
    setLivepeerController,
    livepeerTokenApprove,
    transferFromApp,
    transferToApp,
    bondingManagerBond,
    approveAndBond,
    bondingManagerUnbond,
    bondingManagerWithdraw,
    bondingManagerClaimEarnings,
    bondingManagerDeclareTranscoder,
    bondingManagerTranscoderReward
} from "../web3/LivepeerApp"

import Delegator from "./components/tabs/delegator/Delegator"
import Transcoder from "./components/tabs/transcoder/Transcoder";
import DeclareTranscoder from "./components/side-panel/DeclareTranscoder";
import SetServiceUri from "./components/side-panel/SetServiceUri";

const AppContainer = styled(AppView)`
    display: flex;
    flex-direction: column;
`

// TODO: Convert App() to a class. Add defaultProps and propTypes to components. Extract strings. Extract common spacing (px values).
function App() {

    const {api, appState} = useAragonApi()
    const [tabBarSelected, setTabBarSelected] = useState(0)
    const [sidePanel, setSidePanel] = useState(undefined)

    const setController = (address) => setLivepeerController(api, address)

    const transferTokensIn = (amount) => transferToApp(api, amount)

    const transferTokensOut = (toAddress, amount) => transferFromApp(api, toAddress, amount)

    const approveTokens = (approveTokenCount) => livepeerTokenApprove(api, approveTokenCount)

    const bondTokens = (tokenCount, bondToAddress) => bondingManagerBond(api, tokenCount, bondToAddress)

    const approveAndBondTokens = (tokenCount, bondToAddress) => approveAndBond(api, tokenCount, bondToAddress)

    const unbondTokens = (tokenCount) => bondingManagerUnbond(api, tokenCount)

    const claimEarnings = (upToRound) => bondingManagerClaimEarnings(api, upToRound)

    const withdrawTokens = (unbondingLockId) => bondingManagerWithdraw(api, unbondingLockId)

    const declareTranscoder = (rewardCut, feeShare, pricePerSegment) => {
        setSidePanel(undefined)
        bondingManagerDeclareTranscoder(api, rewardCut, feeShare, pricePerSegment)
    }

    const transcoderReward = () => bondingManagerTranscoderReward(api)

    const setServiceUri = (serviceUri) => {
        setSidePanel(undefined)
        serviceRegistrySetServiceUri(api, serviceUri)
    }

    const sidePanels = {
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
        }
    }

    const tabs = [
        {
            tabName: "Delegator",
            tabComponent: (
                <Delegator appState={appState}
                           setController={setController}
                           transferTokensIn={transferTokensIn}
                           transferTokensOut={transferTokensOut}
                           approveTokens={approveTokens}
                           bondTokens={bondTokens}
                           approveAndBondTokens={approveAndBondTokens}
                           unbondTokens={unbondTokens}
                           claimEarnings={claimEarnings}
                           withdrawTokens={withdrawTokens}
                />)
        },
        {
            tabName: "Transcoder",
            tabComponent: (
                <Transcoder appState={appState}
                            handleDeclareTranscoder={() => setSidePanel(sidePanels.DECLARE_TRANSCODER)}
                            handleTranscoderReward={transcoderReward}
                            handleSetServiceUri={() => setSidePanel(sidePanels.SET_SERVICE_URI)}
                />)
        }
    ]
    const tabsNames = tabs.map(tab => tab.tabName)
    const selectedTabComponent = tabs[tabBarSelected].tabComponent


    return (
        <Main>
            <AppContainer title="Livepeer"
                          tabs={<TabBar
                              items={tabsNames}
                              selected={tabBarSelected}
                              onChange={setTabBarSelected}
                          />}
            >
                {selectedTabComponent}
            </AppContainer>

            <SidePanel title={sidePanel ? sidePanel.title : ""} opened={sidePanel !== undefined}
                       onClose={() => setSidePanel(undefined)}>
                {sidePanel ? sidePanel.sidePanelComponent : <div/>}
            </SidePanel>
        </Main>
    )
}

export default App