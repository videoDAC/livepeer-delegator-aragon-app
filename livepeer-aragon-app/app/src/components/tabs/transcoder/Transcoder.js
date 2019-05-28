import React from 'react'
import styled from "styled-components";
import TranscoderDetails from "./Details";
import ServiceUri from "./ServiceUri";
import TotalStake from "./TotalStake";
import {Button, SafeLink} from "@aragon/ui";
import {LivepeerTranscoderLink} from "../../../LivepeerExplorerLinks";

const TranscoderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const Transcoder = ({handleDeclareTranscoder, handleTranscoderReward, handleSetServiceUri, appState}) => {

    const {appAddress} = appState

    const livepeerTranscoderLink = LivepeerTranscoderLink(appAddress)

    return (
        <TranscoderContainer>

            <div>

                <TotalStake appState={appState}/>

                <TranscoderDetails appState={appState}
                                   handleDeclareTranscoder={handleDeclareTranscoder}
                                   handleTranscoderReward={handleTranscoderReward}/>

                <ServiceUri appState={appState}
                            handleSetServiceUri={handleSetServiceUri}/>

                <SafeLink href={livepeerTranscoderLink} target="_blank">
                    <Button mode="secondary">
                        View on Livepeer Explorer
                    </Button>
                </SafeLink>

            </div>

        </TranscoderContainer>
    )
}

export default Transcoder