import React, {useState} from "react"
import {Button, TextInput, Text, Field, Card, Info} from "@aragon/ui"
import styled from 'styled-components'

const ApproveTokensContainer = styled.div`
    margin-right: 30px;   
    margin-bottom: 30px;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px; 
`
const ApprovedTokensCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
`
const ApproveAndButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
`
const ApproveInput = styled(Field)`
    margin-right: 20px;
`

const ApproveTokens = ({handleApproveTokens, appState}) => {

    const {appApprovedTokens} = appState

    const [approveTokenCount, setApproveTokenCount] = useState(0)

    return (
        <ApproveTokensContainer>
            <Text.Block size="normal" weight="bold">Bonding Manager Approved Tokens</Text.Block>

            <ApprovedTokensCard>
                <Text.Block size="normal">{appApprovedTokens}</Text.Block>
            </ApprovedTokensCard>

            <ApproveAndButton>

                <ApproveInput label="Approve Tokens:">
                    <TextInput type="number"
                               onChange={event => setApproveTokenCount(event.target.value)}/>
                </ApproveInput>

                <Button mode="outline" onClick={() => handleApproveTokens(approveTokenCount)}>Approve Tokens</Button>

            </ApproveAndButton>
        </ApproveTokensContainer>
    )
}

export default ApproveTokens