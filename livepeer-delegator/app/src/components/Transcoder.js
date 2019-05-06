import React from 'react'
import {Card, Text, Button} from "@aragon/ui"
import styled from "styled-components";


/**
 * @dev The sender is declaring themselves as a candidate for active transcoding.
 * @param _rewardCut % of reward paid to transcoder by a delegator
 * @param _feeShare % of fees paid to delegators by a transcoder
 * @param _pricePerSegment Price per segment (denominated in Wei) for a stream
 // */
// function transcoder(uint256 _rewardCut, uint256 _feeShare, uint256 _pricePerSegment)

const TranscoderContainer = styled.div`
    display: flex;
    flex-direction: column;
   
`
const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: auto;
    margin-right: 30px;
    margin-bottom: 30px;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px; 
`
const TranscoderFunctions = styled.div`
    display: flex;
    flex-direction: row;
`
const DetailCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    width: auto;
`
const DeclareTranscoderButton = styled(Button)`

`

const Transcoder = ({handleDeclareTranscoder, appState}) => {

    const {lastRewardRound, rewardCut, feeShare, pricePerSegment, totalStake} = appState.transcoder

    return (
        <TranscoderContainer>
            <DetailsContainer>

                <Text.Block weight="bold" size="normal">Last reward round</Text.Block>
                <DetailCard>
                    <Text.Block size="normal">{lastRewardRound}</Text.Block>
                </DetailCard>

                <Text.Block weight="bold" size="normal">Reward cut</Text.Block>
                <DetailCard>
                    <Text.Block size="normal">{rewardCut}</Text.Block>
                </DetailCard>

                <Text.Block weight="bold" size="normal">Fee share</Text.Block>
                <DetailCard>
                    <Text.Block size="normal">{feeShare}</Text.Block>
                </DetailCard>

                <Text.Block weight="bold" size="normal">Price per segment</Text.Block>
                <DetailCard>
                    <Text.Block size="normal">{pricePerSegment}</Text.Block>
                </DetailCard>

                <Text.Block weight="bold" size="normal">Total stake</Text.Block>
                <DetailCard>
                    <Text.Block size="normal">{totalStake}</Text.Block>
                </DetailCard>

            </DetailsContainer>

            <TranscoderFunctions>
                <DeclareTranscoderButton mode="strong" onClick={() => handleDeclareTranscoder()}>Declare
                    Transcoder</DeclareTranscoderButton>
            </TranscoderFunctions>

        </TranscoderContainer>
    )
}

export default Transcoder