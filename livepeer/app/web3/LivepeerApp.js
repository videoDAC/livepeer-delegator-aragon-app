import {toDecimals} from "../src/lib/math-utils";
import {livepeerTokenAddress$} from "./ExternalContracts";
import {mergeMap} from "rxjs/operators";

const TOKEN_DECIMALS = 18;

const setLivepeerController = (api, address) => {
    api.setLivepeerController(address)
        .subscribe()
}

const livepeerTokenApprove = (api, tokenCount) => {
    const adjustedTokenCount = toDecimals(tokenCount, TOKEN_DECIMALS)
    api.livepeerTokenApprove(adjustedTokenCount)
        .subscribe()
}

const transferFromApp = (api, sendToAddress, amount) => {
    const adjustedAmount = toDecimals(amount, TOKEN_DECIMALS)

    livepeerTokenAddress$(api).pipe(
        mergeMap(tokenAddress => api.transfer(tokenAddress, sendToAddress, adjustedAmount))
    ).subscribe()
}

const transferToApp = (api, amount) => {
    const adjustedAmount = toDecimals(amount, TOKEN_DECIMALS)

    livepeerTokenAddress$(api).pipe(
        mergeMap(tokenAddress => api.deposit(tokenAddress, adjustedAmount, {
            token: {
                address: tokenAddress,
                value: adjustedAmount
            }
        }))
    ).subscribe()
}

const bondingManagerBond = (api, numberOfTokens, bondToAddress) => {
    const convertedTokenCount = toDecimals(numberOfTokens, TOKEN_DECIMALS)
    api.bond(convertedTokenCount, bondToAddress)
        .subscribe()
}

const approveAndBond = (api, tokenCount, bondToAddress) => {
    const convertedTokenCount = toDecimals(tokenCount, TOKEN_DECIMALS)
    api.approveAndBond(convertedTokenCount, bondToAddress)
        .subscribe()
}

const bondingManagerUnbond = (api, numberOfTokens) => {
    const convertedTokenCount = toDecimals(numberOfTokens, TOKEN_DECIMALS)
    api.unbond(convertedTokenCount)
        .subscribe()
}

const bondingManagerWithdraw = (api, unbondingLockId) => {
    api.withdrawStake(unbondingLockId)
        .subscribe()
}

const bondingManagerClaimEarnings = (api, upToRound) => {
    api.claimEarnings(upToRound)
        .subscribe()
}

export {
    setLivepeerController,
    livepeerTokenApprove,
    transferFromApp,
    transferToApp,
    bondingManagerBond,
    approveAndBond,
    bondingManagerUnbond,
    bondingManagerWithdraw,
    bondingManagerClaimEarnings
}