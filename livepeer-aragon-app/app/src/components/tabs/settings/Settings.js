import React from "react"
import {Text, Card, Button} from "@aragon/ui"
import styled from 'styled-components'

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`
const AddressCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 35px;
    width: auto;
`
const ControllerAddressCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 15px;
    width: auto;
`
const ButtonContainer = styled.div`
    display: flex;
`

const Settings = ({handleNewController, appState}) => {
    const {appAddress, livepeerTokenAddress, livepeerControllerAddress} = appState

    return (
        <SettingsContainer>
            <div>

                <Text.Block size="normal">Livepeer App Address</Text.Block>
                <AddressCard>
                    <Text.Block size="normal">{appAddress}</Text.Block>
                </AddressCard>

                <Text.Block size="normal">Livepeer Token Address</Text.Block>
                <AddressCard>
                    <Text.Block size="normal">{livepeerTokenAddress}</Text.Block>
                </AddressCard>

                <Text.Block size="normal">Livepeer Controller Address</Text.Block>
                <ControllerAddressCard>
                    <Text.Block size="normal">{livepeerControllerAddress}</Text.Block>
                </ControllerAddressCard>

                <ButtonContainer>
                    <Button mode="strong" onClick={() => handleNewController()}>
                        Change Livepeer Controller
                    </Button>
                </ButtonContainer>

            </div>

        </SettingsContainer>
    )
}

export default Settings