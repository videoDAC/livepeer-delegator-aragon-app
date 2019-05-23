import React from "react"
import {Button, Text, Card} from "@aragon/ui"
import styled from 'styled-components'

const BondTokensContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px;
    margin-bottom: 30px;
`
const BondedTokensCard = styled(Card)`
    display: flex;
    white-space: nowrap;
    height: auto;
    width: auto;
    padding: 10px;
    margin-top: 10px;
`
const BondButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 15px;
`
const ApproveAndBondButton = styled(Button)`
    margin-right: 20px;
`

const DelegatedStake = ({handleApproveAndBond, handleUnbondTokens, appState}) => {

    const {disableUnbondTokens} = appState
    const {totalStake, delegateAddress} = appState.delegatorInfo

    return (
        <BondTokensContainer>

            <Text.Block size="normal">Delegated Stake</Text.Block>

            <BondedTokensCard>
                <Text.Block>{totalStake} LPT bonded to {delegateAddress}</Text.Block>
            </BondedTokensCard>

            <BondButtonContainer>
                <ApproveAndBondButton mode="strong" onClick={() => handleApproveAndBond()}>
                    Approve and bond to address
                </ApproveAndBondButton>

                <Button mode="strong" disabled={disableUnbondTokens} onClick={() => handleUnbondTokens()}>
                    Unbond tokens
                </Button>

            </BondButtonContainer>

        </BondTokensContainer>
    )
}

export default DelegatedStake