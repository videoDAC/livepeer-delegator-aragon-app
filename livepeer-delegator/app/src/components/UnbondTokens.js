import React, {useState} from "react"
import {Button, observe, Text, TextInput, Field} from "@aragon/ui"
import styled from 'styled-components'
import {fromDecimals} from "../lib/math-utils";
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
const InputContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 10px;
    align-items: center;
    flex-wrap: wrap;
`
const UnbondInput = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const UnbondTokenField = styled(Field)`
    margin-right: 20px;
`
const UnbondTokenButton = styled(Button)`
    margin-right: 20px;
`
const ClaimEarningsInput = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const ClaimEarningsToRoundField = styled(Field)`
    margin-right: 20px;
`
const ClaimEarningsButton = styled(Button)`
    margin-right: 20px;
`

const UnbondTokens = ({handleUnbondTokens, handleWithdrawTokens, handleClaimEarnings, appState}) => {

    const {currentRound, disableUnbondTokens, unbondingLockInfos, delegatorInfo} = appState

    const [unbondTokenCount, setUnbondTokenCount] = useState(0)
    const [claimEarningsUpToRound, setClaimEarningsUpToRound] = useState(0)

    return (
        <UnbondTokensContainer>

            <UnbondInnerContainer>

                <Text.Block weight="bold" size="normal">Unbond Tokens</Text.Block>

                <InputContainer>

                    <UnbondInput>
                        <UnbondTokenField label="Unbond Tokens:">
                            <TextInput type="number"
                                       onChange={event => setUnbondTokenCount(event.target.value)}/>
                        </UnbondTokenField>

                        <UnbondTokenButton mode="strong" disabled={disableUnbondTokens} onClick={() => handleUnbondTokens(unbondTokenCount)}>Unbond
                            tokens</UnbondTokenButton>
                    </UnbondInput>

                    <ClaimEarningsInput>
                        <ClaimEarningsToRoundField label={`Up To Round: (last: ${delegatorInfo.lastClaimRound})`}>
                            <TextInput type="number"
                                       onChange={event => setClaimEarningsUpToRound(event.target.value)}/>
                        </ClaimEarningsToRoundField>

                        <ClaimEarningsButton mode="strong" onClick={() => handleClaimEarnings(claimEarningsUpToRound)}>Claim
                            Earnings</ClaimEarningsButton>
                    </ClaimEarningsInput>

                </InputContainer>

            </UnbondInnerContainer>

            <UnbondingLockItems handleWithdrawTokens={handleWithdrawTokens}
                                unbondingLockInfos={unbondingLockInfos}
                                currentRound={currentRound}/>

        </UnbondTokensContainer>
    )
}

export default UnbondTokens