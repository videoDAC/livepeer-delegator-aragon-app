import {toDecimals} from "../src/lib/math-utils";
import {livepeerTokenAddress$} from "./ExternalContracts";
import {mergeMap} from "rxjs/operators";
import {ETHER_TOKEN_FAKE_ADDRESS, TOKEN_DECIMALS} from "../SharedConstants";

const setLivepeerController = (api, address) => {
    api.setLivepeerController(address)
        .subscribe()
}

const livepeerTokenApprove = (api, tokenCount) => {
    const adjustedTokenCount = toDecimals(tokenCount, TOKEN_DECIMALS)
    api.livepeerTokenApprove(adjustedTokenCount)
        .subscribe()
}

const transferEthFromApp = (api, sendToAddress, amount) => {
    const adjustedAmount = toDecimals(amount, TOKEN_DECIMALS)
    api.transfer(ETHER_TOKEN_FAKE_ADDRESS, sendToAddress, adjustedAmount)
        .subscribe()
}

const transferLptFromApp = (api, sendToAddress, amount) => {
    const adjustedAmount = toDecimals(amount, TOKEN_DECIMALS)

    livepeerTokenAddress$(api).pipe(
        mergeMap(tokenAddress => api.transfer(tokenAddress, sendToAddress, adjustedAmount))
    ).subscribe()
}

const transferLptToApp = (api, amount) => {
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

const bondingManagerRebond = (api, unbondingLockId) => {
    api.rebond(unbondingLockId)
        .subscribe()
}

const bondingManagerRebondFromUnbonded = (api, to, unbondingLockId) => {
    api.rebondFromUnbonded(to, unbondingLockId)
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

const bondingManagerWithdrawFees = (api) => {
    api.withdrawFees()
        .subscribe()
}

const bondingManagerDeclareTranscoder = (api, rewardCut, feeShare, pricePerSegment) => {
    const rewardCutContractFormat = percentageAsContractFormat(rewardCut)
    const feeShareContractFormat = percentageAsContractFormat(feeShare)
    api.declareTranscoder(rewardCutContractFormat, feeShareContractFormat, pricePerSegment)
        .subscribe()
}

const percentageAsContractFormat = (percentage) => percentage * 10000

const bondingManagerTranscoderReward = (api) => {
    api.transcoderReward()
        .subscribe()
}

const serviceRegistrySetServiceUri = (api, serviceUri) => {
    api.setServiceUri(serviceUri)
        .subscribe()
}

export {
    setLivepeerController,
    livepeerTokenApprove,
    transferEthFromApp,
    transferLptFromApp,
    transferLptToApp,
    bondingManagerBond,
    approveAndBond,
    bondingManagerUnbond,
    bondingManagerRebond,
    bondingManagerRebondFromUnbonded,
    bondingManagerWithdraw,
    bondingManagerClaimEarnings,
    bondingManagerWithdrawFees,
    bondingManagerDeclareTranscoder,
    bondingManagerTranscoderReward,
    serviceRegistrySetServiceUri
}