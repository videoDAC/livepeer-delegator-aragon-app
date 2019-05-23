import React, {useState} from 'react'
import {Button, Field, TextInput, Info} from "@aragon/ui";
import styled from "styled-components";

const SetServiceUriContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const ServiceUriField = styled(Field)`
    margin-top: 20px;
`

const SetServiceUri = ({handleSetServiceUri}) => {

    const [serviceUri, setServiceUri] = useState("")

    return (
        <SetServiceUriContainer>

            <Info.Action title="Livepeer action">
                This action will set the service URI which is used to send requests to the transcoder off-chain.
            </Info.Action>

            <ServiceUriField label="Service URI">
                <TextInput type="text" wide
                           onChange={event => setServiceUri(event.target.value)}/>
            </ServiceUriField>

            <Button mode="strong" onClick={() => handleSetServiceUri(serviceUri)}>
                Set Service URI
            </Button>

        </SetServiceUriContainer>
    )

}

export default SetServiceUri
