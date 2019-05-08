import React from 'react'
import {Card, Text, Button} from "@aragon/ui"
import styled from "styled-components";

// TODO: Add pending values to UI.

const TranscoderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
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
    justify-content: space-evenly
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
const TranscoderFunctions = styled.div`
    display: flex;
    flex-direction: row;
`
const DetailCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 10px;
`
const InnerText = styled(Text.Block)`
    text-align: center;
`

const Transcoder = ({openDeclareTranscoderSidePanel, appState}) => {

    const { currentRound } = appState

    const {
        status,
        active,
        totalStake,
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
        <TranscoderContainer>
            <DetailsContainer>

                <DetailContainerRight>
                    <Text.Block weight="bold" size="normal">Total stake</Text.Block>
                    <DetailCard>
                        <InnerText size="normal">{`${totalStake} eth`}</InnerText>
                    </DetailCard>
                </DetailContainerRight>

                <DetailsRowContainer>
                    <DetailContainerLeft>
                        <Text.Block weight="bold" size="normal">Status</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{status}</InnerText>
                        </DetailCard>
                    </DetailContainerLeft>

                    <DetailContainerRight>
                        <Text.Block weight="bold" size="normal">Active</Text.Block>
                        <DetailCard>
                            <InnerText size="normal" style={{textTransform: 'capitalize'}}>{active.toString()}</InnerText>
                        </DetailCard>
                    </DetailContainerRight>
                </DetailsRowContainer>

                <DetailsRowContainer>
                    <DetailContainerLeft>
                        <Text.Block weight="bold" size="normal">Reward cut</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{rewardCutString}</InnerText>
                        </DetailCard>
                    </DetailContainerLeft>

                    <DetailContainerRight>
                        <Text.Block weight="bold" size="normal">Fee share</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{feeShareString}</InnerText>
                        </DetailCard>
                    </DetailContainerRight>
                </DetailsRowContainer>

                <DetailsRowContainer>
                    <DetailContainerLeft>
                        <Text.Block weight="bold" size="normal">Price per segment</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{pricePerSegmentString}</InnerText>
                        </DetailCard>
                    </DetailContainerLeft>

                    <DetailContainerRight>
                        <Text.Block weight="bold" size="normal">Last reward round (current: {currentRound})</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{lastRewardRound}</InnerText>
                        </DetailCard>
                    </DetailContainerRight>
                </DetailsRowContainer>

            </DetailsContainer>

            <TranscoderFunctions>
                <Button mode="strong" onClick={openDeclareTranscoderSidePanel}>Declare
                    Transcoder</Button>
            </TranscoderFunctions>

        </TranscoderContainer>
    )
}

export default Transcoder