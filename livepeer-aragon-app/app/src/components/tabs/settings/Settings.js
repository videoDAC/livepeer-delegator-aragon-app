import React from "react"
import {Text, Card, Button} from "@aragon/ui"
import styled from 'styled-components'

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`
const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px;
    margin-bottom: 30px;
`
const AddressCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
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

const Settings = ({handleNewController, hendleNewAgent, appState}) => {
    const {appAddress, livepeerTokenAddress, agentAddress, livepeerControllerAddress} = appState

    return (
        <SettingsContainer>
            <div>
                <DetailContainer>
                    <Text.Block size="normal">Livepeer App Address</Text.Block>
                    <AddressCard>
                        <Text.Block size="normal">{appAddress}</Text.Block>
                    </AddressCard>
                </DetailContainer>

                <DetailContainer>
                    <Text.Block size="normal">Agent Address</Text.Block>
                    <ControllerAddressCard>
                        <Text.Block size="normal">{agentAddress}</Text.Block>
                    </ControllerAddressCard>

                    <ButtonContainer>
                        <Button mode="strong" onClick={() => hendleNewAgent()}>
                            Change Agent
                        </Button>
                    </ButtonContainer>
                </DetailContainer>

                <DetailContainer>
                    <Text.Block size="normal">Livepeer Token Address</Text.Block>
                    <AddressCard>
                        <Text.Block size="normal">{livepeerTokenAddress}</Text.Block>
                    </AddressCard>
                </DetailContainer>

                <DetailContainer>
                    <Text.Block size="normal">Livepeer Controller Address</Text.Block>
                    <ControllerAddressCard>
                        <Text.Block size="normal">{livepeerControllerAddress}</Text.Block>
                    </ControllerAddressCard>

                    <ButtonContainer>
                        <Button mode="strong" onClick={() => handleNewController()}>
                            Change Livepeer Controller
                        </Button>
                    </ButtonContainer>
                </DetailContainer>

            </div>

        </SettingsContainer>
    )
}

export default Settings