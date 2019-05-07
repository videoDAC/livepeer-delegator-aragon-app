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

    const {lastRewardRound, rewardCut, feeShare, pricePerSegment, totalStake} = appState.transcoder

    return (
        <TranscoderContainer>
            <DetailsContainer>

                <DetailsRowContainer>
                    <DetailContainerLeft>
                        <Text.Block weight="bold" size="normal">Reward cut</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{`${rewardCut}%`}</InnerText>
                        </DetailCard>
                    </DetailContainerLeft>

                    <DetailContainerRight>
                        <Text.Block weight="bold" size="normal">Fee share</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{`${feeShare}%`}</InnerText>
                        </DetailCard>
                    </DetailContainerRight>
                </DetailsRowContainer>

                <DetailsRowContainer>
                    <DetailContainerLeft>
                        <Text.Block weight="bold" size="normal">Price per segment</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{`${pricePerSegment} wei`}</InnerText>
                        </DetailCard>
                    </DetailContainerLeft>

                    <DetailContainerRight>
                        <Text.Block weight="bold" size="normal">Last reward round</Text.Block>
                        <DetailCard>
                            <InnerText size="normal">{lastRewardRound}</InnerText>
                        </DetailCard>
                    </DetailContainerRight>
                </DetailsRowContainer>

                <DetailContainerRight>
                    <Text.Block weight="bold" size="normal">Total stake</Text.Block>
                    <DetailCard>
                        <InnerText size="normal">{`${totalStake} eth`}</InnerText>
                    </DetailCard>
                </DetailContainerRight>

            </DetailsContainer>

            <TranscoderFunctions>
                <Button mode="strong" onClick={openDeclareTranscoderSidePanel}>Declare
                    Transcoder</Button>
            </TranscoderFunctions>

        </TranscoderContainer>
    )
}

export default Transcoder