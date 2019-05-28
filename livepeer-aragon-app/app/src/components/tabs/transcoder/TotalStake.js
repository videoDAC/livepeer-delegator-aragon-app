import React from 'react'
import {Card, Text} from "@aragon/ui";
import styled from "styled-components";

const TotalStakeContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px;
    margin-bottom: 30px;
`
const DetailCard = styled(Card)`
    padding: 10px;
    height: auto;
    width: auto;
    margin-top: 10px;
`

const TotalStake = ({appState}) => {

    const {delegatedAmount} = appState.delegatorInfo

    return (
        <TotalStakeContainer>

            <DetailContainer>

                <Text.Block size="normal">Delegated To The Livepeer App</Text.Block>
                <DetailCard>
                    <Text.Block size="normal">{delegatedAmount} LPT</Text.Block>
                </DetailCard>

            </DetailContainer>

        </TotalStakeContainer>
    )
}

export default TotalStake