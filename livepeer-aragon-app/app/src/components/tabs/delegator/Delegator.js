import React from "react";
import DelegatedStake from "./DelegatedStake";
import UnbondTokens from "./UnbondTokens";
import ClaimedEarnings from "./ClaimedEarnings";
import styled from 'styled-components'
import WithdrawFees from "./WithdrawFees";
import {Button, SafeLink} from "@aragon/ui";
import {LivepeerDelegatorLink} from "../../../LivepeerExplorerLinks";

const TopContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`
const ExplorerLink = styled(Button)`
    margin-top: 30px;
`

const Delegator = ({appState, approveAndBondTokens, unbondTokens, rebondTokens, claimEarnings, withdrawFees, withdrawTokens}) => {

    const {agentAddress} = appState

    const livepeerDelegatorLink = LivepeerDelegatorLink(agentAddress)

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

                <SafeLink href={livepeerDelegatorLink} target="_blank">
                    <ExplorerLink mode="secondary">
                        View on Livepeer Explorer
                    </ExplorerLink>
                </SafeLink>

            </div>
        </TopContainer>
    )
}

export default Delegator