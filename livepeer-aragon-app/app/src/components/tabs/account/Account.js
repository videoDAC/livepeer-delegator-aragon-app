import React from 'react'
import styled from "styled-components";
import {Text, Card, Button} from "@aragon/ui"

const AccountContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`
const DetailsCard = styled(Card)`
    padding: 10px;
    height: auto;
    width: auto;
    margin-top: 10px;
    margin-bottom: 35px;
`
const AppBalanceDetailsCard = styled(Card)`
    padding: 10px;
    height: auto;
    width: auto;
    margin-top: 10px;
    margin-bottom: 15px;
`
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
`
const TransferButton = styled(Button)`
    margin-right: 20px;
`

const Account = ({appState, handleTransferIn, handleTransferOut}) => {

    const {appAddress, appEthBalance, appsLptBalance} = appState

    return (
        <AccountContainer>
            <div>

                <Text.Block size="normal">Livepeer App Address</Text.Block>
                <DetailsCard>
                    <Text.Block size="normal">{appAddress}</Text.Block>
                </DetailsCard>

                <Text.Block size="normal">ETH Balance</Text.Block>
                <DetailsCard>
                    <Text.Block size="normal">{`${appEthBalance}`}</Text.Block>
                </DetailsCard>

                <Text.Block size="normal">LPT Balance</Text.Block>
                <AppBalanceDetailsCard>
                    <Text.Block size="normal">{`${appsLptBalance}`}</Text.Block>
                </AppBalanceDetailsCard>

                <ButtonsContainer>
                    <TransferButton mode="strong" onClick={() => handleTransferIn()}>Transfer To App</TransferButton>
                    <Button mode="strong" onClick={() => handleTransferOut()}>Transfer From App</Button>
                </ButtonsContainer>

            </div>

        </AccountContainer>
    )
}

export default Account
