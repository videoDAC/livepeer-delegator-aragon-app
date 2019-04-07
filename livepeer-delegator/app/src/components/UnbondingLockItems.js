import React from "react"
import {Button, Table, TableRow, TableHeader, TableCell} from "@aragon/ui"
import styled from 'styled-components'

const StyledTableCell = styled(TableCell)`
    width: 25%;
`

const UnbondingLockItem = props => {
    return (

        <TableRow>

            <StyledTableCell>
                {props.unbondingLockInfo.id}
            </StyledTableCell>

            <StyledTableCell>
                {props.unbondingLockInfo.amount} LPT
            </StyledTableCell>

            <StyledTableCell>
                {props.unbondingLockInfo.withdrawRound}
            </StyledTableCell>

            <StyledTableCell>
                <Button onClick={() => props.handleWithdrawTokens(props.unbondingLockInfo.id)}
                        disabled={props.unbondingLockInfo.disableWithdraw} mode="strong">Withdraw tokens</Button>
            </StyledTableCell>

        </TableRow>
    )
}

export default function UnbondingLockItems({unbondingLockInfos, handleWithdrawTokens, currentRound}) {
    return (
        <Table header={
            <TableRow>
                <TableHeader title="Unbonding Lock ID"/>
                <TableHeader title="Livepeer Token Value"/>
                <TableHeader title={`Withdraw Round (current: ${currentRound})`}/>
            </TableRow>
        }>
            {unbondingLockInfos.map(unbondingLockInfo =>
                <UnbondingLockItem key={unbondingLockInfo.id} handleWithdrawTokens={handleWithdrawTokens}
                                   unbondingLockInfo={unbondingLockInfo}/>)}
        </Table>
    )
}

