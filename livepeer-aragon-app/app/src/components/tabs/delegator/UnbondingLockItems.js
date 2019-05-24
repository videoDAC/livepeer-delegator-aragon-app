import React from "react"
import {Button, Table, TableRow, TableHeader, TableCell} from "@aragon/ui"
import styled from 'styled-components'

const StyledTableCell = styled(TableCell)`
    width: 25%;
`

const UnbondingLockItem = ({handleRebondTokens, handleWithdrawTokens, unbondingLockInfo}) => {

    const {id, amount, withdrawRound, disableWithdraw} = unbondingLockInfo

    const withdrawRoundCell = disableWithdraw ? withdrawRound :
        (
            <Button onClick={() => handleWithdrawTokens(id)}
                    disabled={disableWithdraw} mode="strong">Withdraw tokens</Button>
        )

    return (
        <TableRow>

            <StyledTableCell>
                {id}
            </StyledTableCell>

            <StyledTableCell>
                {amount} LPT
            </StyledTableCell>

            <StyledTableCell>
                {withdrawRoundCell}
            </StyledTableCell>

            <StyledTableCell>
                <Button onClick={() => handleRebondTokens(id)}
                        mode="strong">Rebond Tokens</Button>
            </StyledTableCell>

        </TableRow>
    )
}

export default function UnbondingLockItems({unbondingLockInfos, handleRebondTokens, handleWithdrawTokens, currentRound}) {
    return (
        <Table header={
            <TableRow>
                <TableHeader title="Lock ID"/>
                <TableHeader title="Livepeer Token Value"/>
                <TableHeader title={`Withdraw Round (current: ${currentRound})`}/>
            </TableRow>
        }>
            {unbondingLockInfos.map(unbondingLockInfo =>
                <UnbondingLockItem key={unbondingLockInfo.id}
                                   handleRebondTokens={handleRebondTokens}
                                   handleWithdrawTokens={handleWithdrawTokens}
                                   unbondingLockInfo={unbondingLockInfo}/>)}
        </Table>
    )
}

