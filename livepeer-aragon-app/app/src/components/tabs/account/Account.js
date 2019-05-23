import React from 'react'
import styled from "styled-components";
import {Text, Card, Button} from "@aragon/ui"
import TokenTransfer from "./TokenTransfer";

const AccountContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`
const AccountInnerContainer = styled.div`
    display:flex;
    flex-direction: column;
`
const DetailsCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 35px;
    width: auto;
`
const AppBalanceDetailsCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 15px;
    width: auto;
`
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
`
const TransferButton = styled(Button)`
    margin-right: 20px;
`

const Account = ({appState, handleTransferIn, handleTransferOut}) => {

    const {appAddress, appsLptBalance, userLptBalance} = appState

    return (
        <AccountContainer>
            <AccountInnerContainer>

                <Text.Block size="normal">Livepeer App Address</Text.Block>
                <DetailsCard>
                    <Text.Block size="normal">{appAddress}</Text.Block>
                </DetailsCard>

                <Text.Block size="normal">Livepeer App Balance</Text.Block>
                <AppBalanceDetailsCard>
                    <Text.Block size="normal">{`${appsLptBalance} LPT`}</Text.Block>
                </AppBalanceDetailsCard>

                <ButtonsContainer>
                    <TransferButton mode="strong" onClick={() => handleTransferIn()}>Transfer To App</TransferButton>
                    <Button mode="strong" onClick={() => handleTransferOut()}>Transfer From App</Button>
                </ButtonsContainer>

            </AccountInnerContainer>

        </AccountContainer>
    )
}

export default Account
