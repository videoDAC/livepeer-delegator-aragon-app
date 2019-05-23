import React from 'react'
import styled from 'styled-components'
import {Text, Button} from '@aragon/ui'

const TokenTransferContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
`
const TextContainer = styled(Text.Block)`
    margin-bottom: 10px;
`
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
`
const TransferButton = styled(Button)`
    margin-right: 20px;
`

const TokenTransfer = ({handleTransferIn, handleTransferOut}) => {

    return (
        <TokenTransferContainer>

            <TextContainer>Livepeer Token Transfer</TextContainer>

            <ButtonsContainer>

                <TransferButton mode="strong" onClick={() => handleTransferIn()}>Transfer In</TransferButton>

                <Button mode="strong" onClick={() => handleTransferOut()}>Transfer Out</Button>

            </ButtonsContainer>

        </TokenTransferContainer>
    )
}

export default TokenTransfer