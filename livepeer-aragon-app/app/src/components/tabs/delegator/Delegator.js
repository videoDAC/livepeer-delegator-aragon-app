import DelegatedStake from "./DelegatedStake";
import UnbondTokens from "./UnbondTokens";
import React from "react";
import ClaimedEarnings from "./ClaimedEarnings";

const Delegator = ({appState, approveAndBondTokens, unbondTokens, rebondTokens, claimEarnings, withdrawTokens}) => {
    return (
        <>
            <DelegatedStake appState={appState}
                            handleApproveAndBond={approveAndBondTokens}
                            handleUnbondTokens={unbondTokens}/>

            <ClaimedEarnings appState={appState}
                             handleClaimEarnings={claimEarnings}/>

            <UnbondTokens appState={appState}
                          handleRebondTokens={rebondTokens}
                          handleWithdrawTokens={withdrawTokens}/>
        </>
    )
}

export default Delegator