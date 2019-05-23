import React, {useState} from "react"
import {Text, Card, TextInput, Field, Button} from "@aragon/ui"
import styled from 'styled-components'

const AddressContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 30px;
    margin-bottom: 30px;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px; 
`
const AddressCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    width: auto;
`
const NewController = styled(Field)`
    margin-right: 20px;
    margin-bottom: 20px;
`
const ChangeControllerButton = styled(Button)`
    margin-bottom: 4px;
    width: 50%;
`

const Addresses = ({handleNewController, appState}) => {
    const {appAddress, livepeerTokenAddress, livepeerControllerAddress} = appState

    return (
        <AddressContainer>

            <Text.Block weight="bold" size="normal">Livepeer App Address</Text.Block>
            <AddressCard>
                <Text.Block size="normal">{appAddress}</Text.Block>
            </AddressCard>

            <Text.Block weight="bold" size="normal">Livepeer Token Address</Text.Block>
            <AddressCard>
                <Text.Block size="normal">{livepeerTokenAddress}</Text.Block>
            </AddressCard>

            <Text.Block weight="bold" size="normal">Livepeer Controller Address</Text.Block>
            <AddressCard>
                <Text.Block size="normal">{livepeerControllerAddress}</Text.Block>
            </AddressCard>

            <ChangeControllerButton mode="strong" onClick={() => handleNewController()}>Set Livepeer
                Controller</ChangeControllerButton>

        </AddressContainer>
    )
}

export default Addresses