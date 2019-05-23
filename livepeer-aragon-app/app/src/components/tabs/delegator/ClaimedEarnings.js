import React from 'react'
import styled from 'styled-components'
import {Button, Text, Card} from "@aragon/ui";

const ClaimedEarningsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 30px;
`
const ClaimedEarningsInner = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px;
`
const ClaimedEarningsRoundCard = styled(Card)`
    display: flex;
    white-space: nowrap;
    height: auto;
    width: auto;
    padding: 10px;
    margin-top: 10px;
`
const ClaimEarningsButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 15px;
`

const ClaimedEarnings = ({appState, handleClaimEarnings}) => {

    const {currentRound} = appState
    const {lastClaimRound} = appState.delegatorInfo

    return (

        <ClaimedEarningsContainer>
            <ClaimedEarningsInner>

                <Text.Block size="normal">Last Round Claimed (current round: {currentRound})</Text.Block>

                <ClaimedEarningsRoundCard>
                    <Text.Block>{lastClaimRound}</Text.Block>
                </ClaimedEarningsRoundCard>

                <ClaimEarningsButtonContainer>
                    <Button mode="strong" onClick={() => handleClaimEarnings()}>
                        Claim Earnings
                    </Button>
                </ClaimEarningsButtonContainer>
            </ClaimedEarningsInner>

        </ClaimedEarningsContainer>
    )
}

export default ClaimedEarnings