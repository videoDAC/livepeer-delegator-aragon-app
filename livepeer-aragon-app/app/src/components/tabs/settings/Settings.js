import React from "react"
import {Text, Card, Button} from "@aragon/ui"
import styled from 'styled-components'

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const SettingsBorder = styled.div`
    display: flex;
    flex-direction: column;
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
const ChangeControllerButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 4px;
`

const Settings = ({handleNewController, appState}) => {
    const {appAddress, livepeerTokenAddress, livepeerControllerAddress} = appState

    return (
        <SettingsContainer>
            <SettingsBorder>

                <Text.Block size="normal">Livepeer App Address</Text.Block>
                <AddressCard>
                    <Text.Block size="normal">{appAddress}</Text.Block>
                </AddressCard>

                <Text.Block size="normal">Livepeer Token Address</Text.Block>
                <AddressCard>
                    <Text.Block size="normal">{livepeerTokenAddress}</Text.Block>
                </AddressCard>

                <Text.Block size="normal">Livepeer Controller Address</Text.Block>
                <AddressCard>
                    <Text.Block size="normal">{livepeerControllerAddress}</Text.Block>
                </AddressCard>

                <ChangeControllerButton mode="strong" onClick={() => handleNewController()}>
                    Change Livepeer Controller
                </ChangeControllerButton>

            </SettingsBorder>
        </SettingsContainer>
    )
}

export default Settings