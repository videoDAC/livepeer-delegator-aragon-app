import React from "react"
import {Text} from "@aragon/ui"
import styled from 'styled-components'
import UnbondingLockItems from "./UnbondingLockItems"

const UnbondTokensContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px;
`
const UnbondInnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const UnbondTokens = ({handleRebondTokens, handleWithdrawTokens, appState}) => {

    const {currentRound, unbondingLockInfos} = appState


    return (
        <UnbondTokensContainer>

            <UnbondInnerContainer>

                <Text.Block weight="bold" size="normal">Unbonding Locks</Text.Block>

            </UnbondInnerContainer>

            <UnbondingLockItems handleRebondTokens={handleRebondTokens}
                                handleWithdrawTokens={handleWithdrawTokens}
                                unbondingLockInfos={unbondingLockInfos}
                                currentRound={currentRound}/>

        </UnbondTokensContainer>
    )
}

export default UnbondTokens