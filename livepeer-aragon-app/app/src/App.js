import React, {useState} from 'react'
import {Main, AppView, TabBar} from '@aragon/ui'
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
    bondingManagerClaimEarnings
} from "../web3/LivepeerApp"

import Delegator from "./components/Delegator"
import Transcoder from "./components/Transcoder";

const AppContainer = styled(AppView)`
    display: flex;
    flex-direction: column;
`

// TODO: Add defaultProps and propTypes to components. Extract strings. Extract common spacing (px values).
function App() {

    const {api, appState} = useAragonApi()
    const [tabBarSelected, setTabBarSelected] = useState(0)

    const setController = (address) => setLivepeerController(api, address)

    const transferTokensIn = (amount) => transferToApp(api, amount)

    const transferTokensOut = (toAddress, amount) => transferFromApp(api, toAddress, amount)

    const approveTokens = (approveTokenCount) => livepeerTokenApprove(api, approveTokenCount)

    const bondTokens = (tokenCount, bondToAddress) => bondingManagerBond(api, tokenCount, bondToAddress)

    const approveAndBondTokens = (tokenCount, bondToAddress) => approveAndBond(api, tokenCount, bondToAddress)

    const unbondTokens = (tokenCount) => bondingManagerUnbond(api, tokenCount)

    const claimEarnings = (upToRound) => bondingManagerClaimEarnings(api, upToRound)

    const withdrawTokens = (unbondingLockId) => bondingManagerWithdraw(api, unbondingLockId)

    const tabs = [
        {
            tabName: "Delegator",
            tabComponent: (
                <Delegator appState={appState} setController={setController} transferTokensIn={transferTokensIn}
                           transferTokensOut={transferTokensOut} approveTokens={approveTokens} bondTokens={bondTokens}
                           approveAndBondTokens={approveAndBondTokens} unbondTokens={unbondTokens}
                           claimEarnings={claimEarnings} withdrawTokens={withdrawTokens}/>)
        },
        {
            tabName: "Transcoder",
            tabComponent: (<Transcoder appState={appState}/>)
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
        </Main>
    )
}

export default App