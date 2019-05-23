import Addresses from "./Addresses";
import LivepeerBalance from "../account/LivepeerTokenBalance";
import ApproveTokens from "./ApproveTokens";
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

const Delegator = ({appState, setController, transferTokensIn, transferTokensOut, approveTokens, bondTokens,
                       approveAndBondTokens, unbondTokens, claimEarnings, withdrawTokens}) => {
    return (
        <div>
            <BondBalanceApprovalContainer>

                <Addresses appState={appState} handleNewController={setController}/>

                <LivepeerBalance appState={appState} handleTransferIn={transferTokensIn}
                                 handleTransferOut={transferTokensOut}/>

                <ApproveTokens appState={appState} handleApproveTokens={approveTokens}/>

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