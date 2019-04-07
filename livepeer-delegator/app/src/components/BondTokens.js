import React, {useState} from "react"
import {Button, observe, TextInput, Text, Field, Card} from "@aragon/ui"
import styled from 'styled-components'
import {fromDecimals} from "../lib/math-utils";

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

const BondInputFields = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
`

const BondedTokensCard = styled(Card)`
    display: flex;
    white-space: nowrap;
    height: auto;
    width: auto;
    padding: 10px;
    margin-top: 10px;
`

const BondButtons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const BondAndApproveButton = styled(Button)`
    margin-right: 20px;
`

const BondTokensField = styled(Field)`
    margin-right: 20px;
`

const BondToAddressField = styled(Field)`
    width: 100%;
`

const BondTokens = ({handleBondTokens, handleApproveAndBond, appState}) => {

    const {totalStake, delegateAddress} = appState.delegatorInfo

    const [bondTokenCount, setBondTokenCount] = useState(0)
    const [bondToAddress, setBondToAddress] = useState(0)

    return (
        <BondTokensContainer>

            <Text.Block size="normal" weight="bold">Bond Tokens</Text.Block>

            <BondedTokensCard>
                <Text.Block>{totalStake} LPT bonded to {delegateAddress}</Text.Block>
            </BondedTokensCard>

            <BondInputFields>
                <BondTokensField label="Bond Tokens:">
                    <TextInput type="number" onChange={event => setBondTokenCount(event.target.value)}/>
                </BondTokensField>

                <BondToAddressField label="Bond to Address:">
                    <TextInput wide="true" type="text" onChange={event => setBondToAddress(event.target.value)}/>
                </BondToAddressField>
            </BondInputFields>

            <BondButtons>
                <BondAndApproveButton mode="strong" onClick={() => handleApproveAndBond(bondTokenCount, bondToAddress)}>Approve
                    and bond to address</BondAndApproveButton>

                <Button mode="outline" onClick={() => handleBondTokens(bondTokenCount, bondToAddress)}>Bond to
                    address</Button>
            </BondButtons>

        </BondTokensContainer>
    )
}

export default BondTokens