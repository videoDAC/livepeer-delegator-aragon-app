import React from 'react'
import styled from "styled-components";
import TranscoderDetails from "./Details";
import ServiceUri from "./ServiceUri";
import TotalStake from "./TotalStake";

const TranscoderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const Transcoder = ({handleDeclareTranscoder, handleTranscoderReward, handleSetServiceUri, appState}) => {

    return (
        <TranscoderContainer>

            <div>

                <TotalStake appState={appState}/>

                <TranscoderDetails appState={appState}
                                   handleDeclareTranscoder={handleDeclareTranscoder}
                                   handleTranscoderReward={handleTranscoderReward}/>

                <ServiceUri appState={appState}
                            handleSetServiceUri={handleSetServiceUri}/>
            </div>

        </TranscoderContainer>
    )
}

export default Transcoder