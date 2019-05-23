import React from 'react'
import styled from "styled-components";
import {Text} from "@aragon/ui"
import TokenTransfer from "./TokenTransfer";

const AccountContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const TextDetails = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 600px;
    margin-bottom: 20px;
`
const TextLabel = styled(Text)`

`
const TextData = styled(Text)`

`

const Account = ({appState, handleTransferIn, handleTransferOut}) => {

    const { appAddress, appsLptBalance, userLptBalance } = appState

    return (
        <AccountContainer>

            <TextDetails>
                <Text>Livepeer App Address: </Text>
                <Text>{appAddress}</Text>
            </TextDetails>

            <TextDetails>
                <Text>Livepeer App Balance: </Text>
                <Text>{appsLptBalance}</Text>
            </TextDetails>

            <TextDetails>
                <Text>Your Balance: </Text>
                <Text>{userLptBalance}</Text>
            </TextDetails>

            <TokenTransfer appState={appState} handleTransferIn={handleTransferIn}
                           handleTransferOut={handleTransferOut}/>

        </AccountContainer>
    )
}

export default Account
