import React from 'react'
import styled from "styled-components";
import {Text, Card, Button, SafeLink} from "@aragon/ui"
import {LivepeerAccountLink} from "../../../LivepeerExplorerLinks";

const AccountContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
const DetailsCard = styled(Card)`
    padding: 10px;
    height: auto;
    width: auto;
    margin-top: 10px;
`
const EthBalanceDetailsCard = styled(Card)`
    padding: 10px;
    height: auto;
    width: auto;
    margin-top: 10px;
    margin-bottom: 15px;
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

const Account = ({appState, handleTransferIn, handleTransferOut, handleTransferEthOut}) => {

    const {appAddress, appEthBalance, appsLptBalance} = appState

    const livepeerAccountLink = LivepeerAccountLink(appAddress)

    return (
        <AccountContainer>
            <div>

                <DetailContainer>
                    <Text.Block size="normal">Livepeer App Address</Text.Block>
                    <DetailsCard>
                        <Text.Block size="normal">{appAddress}</Text.Block>
                    </DetailsCard>
                </DetailContainer>

                <DetailContainer>
                    <Text.Block size="normal">ETH Balance</Text.Block>
                    <EthBalanceDetailsCard>
                        <Text.Block size="normal">{`${appEthBalance}`}</Text.Block>
                    </EthBalanceDetailsCard>

                    <div>
                        <TransferButton mode="strong" onClick={() => handleTransferEthOut()}>
                            Transfer From App
                        </TransferButton>
                    </div>
                </DetailContainer>

                <DetailContainer>
                    <Text.Block size="normal">LPT Balance</Text.Block>
                    <AppBalanceDetailsCard>
                        <Text.Block size="normal">{`${appsLptBalance}`}</Text.Block>
                    </AppBalanceDetailsCard>

                    <ButtonsContainer>
                        <TransferButton mode="strong" onClick={() => handleTransferIn()}>Transfer To
                            App</TransferButton>
                        <Button mode="strong" onClick={() => handleTransferOut()}>Transfer From App</Button>
                    </ButtonsContainer>
                </DetailContainer>

                <SafeLink href={livepeerAccountLink} target="_blank">
                    <Button mode="secondary">
                        View on Livepeer Explorer
                    </Button>
                </SafeLink>

            </div>

        </AccountContainer>
    )
}

export default Account
