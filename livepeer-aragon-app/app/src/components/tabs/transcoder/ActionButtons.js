import React from 'react'
import {Button} from "@aragon/ui";
import styled from "styled-components";

const TranscoderFunctions = styled.div`
    display: flex;
    flex-direction: row;
`
const RightMarginButton = styled(Button)`
    margin-right: 20px;
`

const TranscoderActionButtons = ({handleDeclareTranscoder, handleTranscoderReward, handleSetServiceUri, appState}) => {

    const {disableReward} = appState.transcoder

    return (
        <TranscoderFunctions>
            <RightMarginButton mode="strong" onClick={handleDeclareTranscoder}>Declare
                Transcoder</RightMarginButton>

            <RightMarginButton mode="strong" disabled={disableReward} onClick={handleTranscoderReward}>Reward</RightMarginButton>

            <Button mode="strong" onClick={handleSetServiceUri}>Set Service URI</Button>

        </TranscoderFunctions>
    )
}

export default TranscoderActionButtons