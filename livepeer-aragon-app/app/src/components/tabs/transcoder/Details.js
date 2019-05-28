import React from 'react'
import {Card, Text,} from "@aragon/ui"
import styled from "styled-components";
import TranscoderActionButtons from "./ActionButtons";

const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    margin-bottom: 30px;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px; 
`
const DetailsRowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`
const DetailContainerLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
`
const DetailContainerRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const DetailCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 15px;
`
const InnerText = styled(Text.Block)`
    text-align: center;
`

const TranscoderDetails = ({appState, handleDeclareTranscoder, handleTranscoderReward}) => {

    const {currentRound} = appState

    const {
        status,
        active,
        lastRewardRound,
        rewardCut,
        feeShare,
        pricePerSegment,
        pendingRewardCut,
        pendingFeeShare,
        pendingPricePerSegment,
    } = appState.transcoder

    const rewardCutString = rewardCut === pendingRewardCut ? `${rewardCut}%` : `${rewardCut}% (${pendingRewardCut}% pending)`

    const feeShareString = feeShare === pendingFeeShare ? `${feeShare}%` : `${feeShare}% (${pendingFeeShare}% pending)`

    const pricePerSegmentString = pricePerSegment === pendingPricePerSegment ? `${pricePerSegment} wei` : `${pricePerSegment} wei (${pendingPricePerSegment} wei pending)`

    return (
        <div>

            <DetailsContainer>


                <DetailsRowContainer>
                    <DetailContainerLeft>
                        <Text.Block size="normal">Status</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{status}</InnerText>
                        </DetailCard>
                    </DetailContainerLeft>

                    <DetailContainerRight>
                        <Text.Block size="normal">Active</Text.Block>
                        <DetailCard>
                            <InnerText size="normal"
                                       style={{textTransform: 'capitalize'}}>{active.toString()}</InnerText>
                        </DetailCard>
                    </DetailContainerRight>
                </DetailsRowContainer>

                <DetailsRowContainer>
                    <DetailContainerLeft>
                        <Text.Block size="normal">Reward Cut</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{rewardCutString}</InnerText>
                        </DetailCard>
                    </DetailContainerLeft>

                    <DetailContainerRight>
                        <Text.Block size="normal">Fee Share</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{feeShareString}</InnerText>
                        </DetailCard>
                    </DetailContainerRight>
                </DetailsRowContainer>

                <DetailsRowContainer>
                    <DetailContainerLeft>
                        <Text.Block size="normal">Price Per Segment</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{pricePerSegmentString}</InnerText>
                        </DetailCard>
                    </DetailContainerLeft>

                    <DetailContainerRight>
                        <Text.Block size="normal">Last Reward Round (current: {currentRound})</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{lastRewardRound}</InnerText>
                        </DetailCard>
                    </DetailContainerRight>
                </DetailsRowContainer>

                <TranscoderActionButtons appState={appState}
                                         handleDeclareTranscoder={handleDeclareTranscoder}
                                         handleTranscoderReward={handleTranscoderReward}/>

            </DetailsContainer>
        </div>
    )
}

export default TranscoderDetails
