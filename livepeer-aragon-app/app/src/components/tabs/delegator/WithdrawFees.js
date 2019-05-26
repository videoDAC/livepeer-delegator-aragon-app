import React from 'react'
import styled from 'styled-components'
import {Button, Text, Card} from "@aragon/ui";

const WithdrawFeesContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px;
    margin-bottom: 30px;
`
const WithdrawFeesCard = styled(Card)`
    height: auto;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 15px;
    width: auto;
`

const WithdrawFees = ({appState, handleWithdrawFees}) => {

    const { appEthBalance } = appState

    return (

        <WithdrawFeesContainer>

            <Text.Block size="normal">App ETH Balance</Text.Block>

            <WithdrawFeesCard>
                <Text.Block>{appEthBalance}</Text.Block>
            </WithdrawFeesCard>
            <div>
                <Button mode="strong" onClick={() => handleWithdrawFees()}>
                    Withdraw Fees
                </Button>
            </div>
        </WithdrawFeesContainer>

    )
}

export default WithdrawFees