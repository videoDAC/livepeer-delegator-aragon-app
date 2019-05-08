import React from 'react'
import {Button} from "@aragon/ui";
import styled from "styled-components";

const TranscoderFunctions = styled.div`
    display: flex;
    flex-direction: row;
`
const DeclareTranscoderButton = styled(Button)`
    margin-right: 20px;
`

const TranscoderActionButtons = ({openDeclareTranscoderSidePanel, handleTranscoderReward, appState}) => {

    const {disableReward} = appState.transcoder

    console.log(disableReward)

    return (
        <TranscoderFunctions>
            <DeclareTranscoderButton mode="strong" onClick={openDeclareTranscoderSidePanel}>Declare
                Transcoder</DeclareTranscoderButton>

            <Button mode="strong" disabled={disableReward} onClick={handleTranscoderReward}>Reward</Button>
        </TranscoderFunctions>
    )
}

export default TranscoderActionButtons