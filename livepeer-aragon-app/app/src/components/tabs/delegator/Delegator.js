import React from "react";
import DelegatedStake from "./DelegatedStake";
import UnbondTokens from "./UnbondTokens";
import ClaimedEarnings from "./ClaimedEarnings";
import styled from 'styled-components'
import WithdrawFees from "./WithdrawFees";

const TopContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const Delegator = ({appState, approveAndBondTokens, unbondTokens, rebondTokens, claimEarnings, withdrawFees, withdrawTokens}) => {
    return (
        <TopContainer>

            <div>

                <DelegatedStake appState={appState}
                                handleApproveAndBond={approveAndBondTokens}
                                handleUnbondTokens={unbondTokens}/>

                <ClaimedEarnings appState={appState}
                                 handleClaimEarnings={claimEarnings}/>

                <WithdrawFees appState={appState}
                              handleWithdrawFees={withdrawFees}/>

                <UnbondTokens appState={appState}
                              handleRebondTokens={rebondTokens}
                              handleWithdrawTokens={withdrawTokens}/>

            </div>
        </TopContainer>
    )
}

export default Delegator