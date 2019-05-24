import React from 'react'
import styled from 'styled-components'
import {Button, Text, Card} from "@aragon/ui";

const ClaimedEarningsContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px;
    margin-bottom: 30px;
`
const ClaimedEarningsRoundCard = styled(Card)`
    height: auto;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 15px;
    width: auto;
`

const ClaimedEarnings = ({appState, handleClaimEarnings}) => {

    const {currentRound} = appState
    const {lastClaimRound} = appState.delegatorInfo

    return (

        <ClaimedEarningsContainer>

            <Text.Block size="normal">Last Round Claimed (current round: {currentRound})</Text.Block>

            <ClaimedEarningsRoundCard>
                <Text.Block>{lastClaimRound}</Text.Block>
            </ClaimedEarningsRoundCard>
            <div>
                <Button mode="strong" onClick={() => handleClaimEarnings()}>
                    Claim Earnings
                </Button>
            </div>
        </ClaimedEarningsContainer>

    )
}

export default ClaimedEarnings