import React from "react";
import DelegatedStake from "./DelegatedStake";
import UnbondTokens from "./UnbondTokens";
import ClaimedEarnings from "./ClaimedEarnings";
import styled from 'styled-components'

const TopContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const Delegator = ({appState, approveAndBondTokens, unbondTokens, rebondTokens, claimEarnings, withdrawTokens}) => {
    return (
        <TopContainer>

            <div>

                <DelegatedStake appState={appState}
                                handleApproveAndBond={approveAndBondTokens}
                                handleUnbondTokens={unbondTokens}/>

                <ClaimedEarnings appState={appState}
                                 handleClaimEarnings={claimEarnings}/>


                <UnbondTokens appState={appState}
                              handleRebondTokens={rebondTokens}
                              handleWithdrawTokens={withdrawTokens}/>

            </div>
        </TopContainer>
    )
}

export default Delegator