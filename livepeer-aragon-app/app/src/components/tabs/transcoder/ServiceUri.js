import React from 'react'
import {Button, Card, Text} from "@aragon/ui";
import styled from "styled-components";

const ServiceUriContainer = styled.div`
    display: flex;
    flex-direction: column;
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
const DetailCard = styled(Card)`
    padding: 10px;
    height: auto;
    width: auto;
    margin-top: 10px;
    margin-bottom: 10px;
`

const ServiceUri = ({appState, handleSetServiceUri}) => {

    const {serviceUri} = appState.transcoder

    return (
        <ServiceUriContainer>

            <DetailContainer>

                <Text.Block size="normal">Service URI</Text.Block>
                <DetailCard>
                    <Text.Block size="normal">{serviceUri}</Text.Block>
                </DetailCard>

                <div>
                    <Button mode="strong" onClick={handleSetServiceUri}>Set Service URI</Button>
                </div>

            </DetailContainer>

        </ServiceUriContainer>
    )
}

export default ServiceUri