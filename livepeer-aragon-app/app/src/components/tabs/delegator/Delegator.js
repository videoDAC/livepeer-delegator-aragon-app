import BondTokens from "./BondTokens";
import UnbondTokens from "./UnbondTokens";
import React from "react";
import styled from "styled-components";

const BondBalanceApprovalContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
`

const Delegator = ({appState, bondTokens, approveAndBondTokens, unbondTokens, claimEarnings, withdrawTokens}) => {
    return (
        <div>
            <BondBalanceApprovalContainer>

                <BondTokens appState={appState} handleBondTokens={bondTokens}
                            handleApproveAndBond={approveAndBondTokens}/>

            </BondBalanceApprovalContainer>

            <UnbondTokens appState={appState} handleUnbondTokens={unbondTokens}
                          handleClaimEarnings={claimEarnings}
                          handleWithdrawTokens={withdrawTokens}/>
        </div>
    )
}

export default Delegator