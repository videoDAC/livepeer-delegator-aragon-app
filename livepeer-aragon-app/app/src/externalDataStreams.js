import {filter, first, map, merge, mergeMap, toArray, zip} from "rxjs/operators";
import {
    bondingManager$,
    bondingManagerAddress$,
    livepeerToken$,
    roundsManager$,
    serviceRegistry$
} from "../web3/ExternalContracts";
import {of, range} from "rxjs";

export default class ExternalDataStreams {

    constructor(api, livepeerAppAddress) {
        this.api = api
        this.livepeerAppAddress = livepeerAppAddress
    }

    userLptBalance$() {
        return this.api.accounts().pipe(
            first(),
            zip(livepeerToken$(this.api)),
            mergeMap(([accounts, token]) => token.balanceOf(accounts[0])))
    }



}




const appLptBalance$ = (api, livepeerAppAddress) =>
    livepeerToken$(api).pipe(
        mergeMap(token => token.balanceOf(livepeerAppAddress)))

const appApprovedTokens$ = (api, livepeerAppAddress) =>
    livepeerToken$(api).pipe(
        zip(bondingManagerAddress$(api)),
        mergeMap(([token, bondingManagerAddress]) => token.allowance(livepeerAppAddress, bondingManagerAddress)))

const currentRound$ = (api) =>
    roundsManager$(api).pipe(
        mergeMap(roundsManager => roundsManager.currentRound()))

const pendingStakeFallback$ = (api, delegator) =>
    currentRound$(api).pipe(
        filter((currentRound) => currentRound <= delegator.lastClaimRound),
        mergeMap(() => of(0)))

const pendingStakeSuccess$ = (api, livepeerAppAddress, delegator) =>
    currentRound$(api).pipe(
        filter((currentRound) => currentRound > delegator.lastClaimRound),
        zip(bondingManager$(api)),
        mergeMap(([currentRound, bondingManager]) => bondingManager.pendingStake(livepeerAppAddress, currentRound)))

const pendingStake$ = (api, livepeerAppAddress, delegator) =>
    pendingStakeSuccess$(api, livepeerAppAddress, delegator).pipe(
        merge(pendingStakeFallback$(api, delegator)))

const delegatorInfo$ = (api, livepeerAppAddress) =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.getDelegator(livepeerAppAddress)),
        mergeMap(delegator => pendingStake$(api, livepeerAppAddress, delegator).pipe(
            map((pendingStake) => {
                return {
                    bondedAmount: delegator.bondedAmount,
                    delegateAddress: delegator.delegateAddress,
                    lastClaimRound: delegator.lastClaimRound,
                    pendingStake: pendingStake}
            }))))

const mapBondingManagerToLockInfo = bondingManager =>
    bondingManager.getDelegator(livepeerAppAddress).pipe(
        zip(currentRound$()), // Zip here so we only get the current round once, if we did it after the range observable we would do it more times than necessary.
        mergeMap(([delegator, currentRound]) => range(0, delegator.nextUnbondingLockId).pipe(
            mergeMap(unbondingLockId => bondingManager.getDelegatorUnbondingLock(livepeerAppAddress, unbondingLockId).pipe(
                map(unbondingLockInfo => {
                    return {...unbondingLockInfo, id: unbondingLockId}
                }))),
            map(unbondingLockInfo => {
                return {
                    ...unbondingLockInfo,
                    disableWithdraw: parseInt(currentRound) < parseInt(unbondingLockInfo.withdrawRound)
                }
            }))))

const sortByLockId = (first, second) => first.id > second.id ? 1 : -1

const unbondingLockInfos$ = () =>
    bondingManager$(api).pipe(
        mergeMap(mapBondingManagerToLockInfo),
        filter(unbondingLockInfo => parseInt(unbondingLockInfo.amount) !== 0),
        toArray(),
        map(unbondingLockInfos => unbondingLockInfos.sort(sortByLockId)))

const disableUnbondTokens$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.maxEarningsClaimsRounds()),
        zip(currentRound$(), delegatorInfo$()),
        map(([maxRounds, currentRound, delegatorInfo]) => delegatorInfo.lastClaimRound <= currentRound - maxRounds))

const transcoderStake$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.transcoderTotalStake(livepeerAppAddress)))

const transcoderStatus$ = (api, livepeerAppAddress) =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.transcoderStatus(livepeerAppAddress)))

const transcoderActive$ = (api, livepeerAppAddress) =>
    bondingManager$(api).pipe(
        zip(currentRound$()),
        mergeMap(([bondingManager, currentRound]) => bondingManager.isActiveTranscoder(livepeerAppAddress, currentRound)))

const transcoderServiceUri$ = (api, livepeerAppAddress) =>
    serviceRegistry$(api).pipe(
        mergeMap(serviceRegistry => serviceRegistry.getServiceURI(livepeerAppAddress)))

const transcoderDetails$ = (api, livepeerAppAddress) =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.getTranscoder(livepeerAppAddress)),
        zip(transcoderStake$(api, livepeerAppAddress), transcoderStatus$(api, livepeerAppAddress), transcoderActive$(api, livepeerAppAddress)),
        map(([transcoderDetails, totalStake, status, active]) => {
            return {
                status: status,
                active: active,
                totalStake: totalStake,
                lastRewardRound: transcoderDetails.lastRewardRound,
                rewardCut: transcoderDetails.rewardCut,
                feeShare: transcoderDetails.feeShare,
                pricePerSegment: transcoderDetails.pricePerSegment,
                pendingRewardCut: transcoderDetails.pendingRewardCut,
                pendingFeeShare: transcoderDetails.pendingFeeShare,
                pendingPricePerSegment: transcoderDetails.pendingPricePerSegment
            }
        })
    )
