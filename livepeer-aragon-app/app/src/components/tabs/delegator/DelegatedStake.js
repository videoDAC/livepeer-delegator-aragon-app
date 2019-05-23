import React from "react"
import {Button, Text, Card} from "@aragon/ui"
import styled from 'styled-components'

const BondTokensContainer = styled.div`
    display: flex;
`
const BondTokensInnerContainer = styled.div`
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
const BondButtonsContainer = styled.div`
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
            <BondTokensInnerContainer>

                <Text.Block size="normal">Delegated Stake</Text.Block>

                <BondedTokensCard>
                    <Text.Block>{totalStake} LPT bonded to {delegateAddress}</Text.Block>
                </BondedTokensCard>

                <BondButtonsContainer>
                    <ApproveAndBondButton mode="strong" onClick={() => handleApproveAndBond()}>
                        Approve And Bond To Address
                    </ApproveAndBondButton>

                    <Button mode="strong" disabled={disableUnbondTokens} onClick={() => handleUnbondTokens()}>
                        Unbond Tokens
                    </Button>

                </BondButtonsContainer>

            </BondTokensInnerContainer>
        </BondTokensContainer>
    )
}

export default DelegatedStake