import React from 'react'
import styled from "styled-components";
import TranscoderDetails from "./Details";
import TranscoderActionButtons from "./ActionButtons";

const TranscoderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Transcoder = ({openDeclareTranscoderSidePanel, handleTranscoderReward, appState}) => {

    return (
        <TranscoderContainer>
            <TranscoderDetails appState={appState}/>

            <TranscoderActionButtons appState={appState}
                                     openDeclareTranscoderSidePanel={openDeclareTranscoderSidePanel}
                                     handleTranscoderReward={handleTranscoderReward}/>
        </TranscoderContainer>
    )
}

export default Transcoder