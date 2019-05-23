import DelegatedStake from "./DelegatedStake";
import UnbondTokens from "./UnbondTokens";
import React from "react";
import ClaimedEarnings from "./ClaimedEarnings";

const Delegator = ({appState, bondTokens, approveAndBondTokens, unbondTokens, claimEarnings, withdrawTokens}) => {
    return (
        <>
            <DelegatedStake appState={appState} handleBondTokens={bondTokens}
                            handleApproveAndBond={approveAndBondTokens}
                            handleUnbondTokens={unbondTokens}/>

            <ClaimedEarnings appState={appState}
                             handleClaimEarnings={claimEarnings}/>

            <UnbondTokens appState={appState} handleUnbondTokens={unbondTokens}
                          handleClaimEarnings={claimEarnings}
                          handleWithdrawTokens={withdrawTokens}/>
        </>
    )
}

export default Delegator