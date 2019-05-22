import '@babel/polyfill'
import AragonApi from '@aragon/api'
import {
    controllerAddress$,
    livepeerTokenAddress$,
    livepeerToken$,
    bondingManagerAddress$,
    bondingManager$,
    roundsManager$,
    serviceRegistry$
} from '../web3/ExternalContracts'
import {range, of} from "rxjs";
import {first, mergeMap, map, filter, toArray, zip, tap, merge} from "rxjs/operators"

const ACCOUNT_CHANGED_EVENT = Symbol("ACCOUNT_CHANGED")

const api = new AragonApi()
let livepeerAppAddress = "0x0000000000000000000000000000000000000000"

//TODO: Add retryEvery function
//TODO: Add rebond functions.
//TODO: Add withdraw fees function.
//TODO: Rearrange UI, make actions appear in slide in menu.
//TODO: More disabling of buttons/error handling when functions can't be called.
//TODO: Add menu hamburger to smaller view.

const initialState = async (state) => {
    return {
        ...state,
        livepeerTokenAddress: await livepeerTokenAddress$(api).toPromise(),
        livepeerControllerAddress: await controllerAddress$(api).toPromise(),
        userLptBalance: await userLptBalance$().toPromise(),
        appsLptBalance: await appLptBalance$().toPromise(),
        appApprovedTokens: await appApprovedTokens$().toPromise(),
        currentRound: await currentRound$().toPromise(),
        delegatorInfo: await delegatorInfo$().toPromise(),
        disableUnbondTokens: await disableUnbondTokens$().toPromise(),
        unbondingLockInfos: await unbondingLockInfos$().toPromise(),
        transcoder: {
            ...await transcoderDetails$().toPromise(),
            serviceUri: await transcoderServiceUri$().toPromise()
        }
    }
}

const onNewEvent = async (state, storeEvent) => {

    const { event, returnValues, address } = storeEvent

    switch (event) {
        case 'AppInitialized':
            console.log("APP INITIALIZED")
            livepeerAppAddress = address

            const initState = await initialState(state)

            return {
                ...initState,
                appAddress: livepeerAppAddress
            }
        case 'NewControllerSet':
            console.log("NEW CONTROLLER SET")
            return {
                ...state,
                livepeerControllerAddress: returnValues.livepeerController
            }
        case 'Transfer':
            console.log("LPT TRANSFER")
            const account = (await api.accounts().pipe(first()).toPromise())[0]

            if (account === returnValues.from || account === returnValues.to) {
                return {
                    ...state,
                    userLptBalance: await userLptBalance$().toPromise()
                }
            } else {
                return state
            }
        case 'VaultTransfer':
        case 'VaultDeposit':
            console.log("TRANSFER IN/OUT")
            return {
                ...state,
                userLptBalance: await userLptBalance$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise()
            }
        case 'LivepeerAragonAppApproval':
            console.log("APPROVAL")
            return {
                ...state,
                appApprovedTokens: await appApprovedTokens$().toPromise()
            }
        case 'LivepeerAragonAppBond':
            console.log("BOND")
            return {
                ...state,
                appApprovedTokens: await appApprovedTokens$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise(),
                delegatorInfo: await delegatorInfo$().toPromise(),
                disableUnbondTokens: await disableUnbondTokens$().toPromise(),
                transcoder: {
                    ...state.transcoder,
                    totalStake: await transcoderStake$().toPromise()
                }
            }
        case 'LivepeerAragonAppEarnings':
            console.log("CLAIM EARNINGS")
            return {
                ...state,
                delegatorInfo: await delegatorInfo$().toPromise()
            }
        case 'LivepeerAragonAppUnbond':
            console.log("UNBOND")
            return {
                ...state,
                delegatorInfo: await delegatorInfo$().toPromise(),
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                transcoder: {
                    ...state.transcoder,
                    ...await transcoderDetails$().toPromise()
                }
            }
        case 'LivepeerAragonAppWithdrawStake':
            console.log("WITHDRAW STAKE")
            return {
                ...state,
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise()
            }
        case 'LivepeerAragonAppDeclareTranscoder':
            console.log("DECLARE TRANSCODER")
            return {
                ...state,
                transcoder: {
                    ...state.transcoder,
                    ...await transcoderDetails$().toPromise()
                }
            }
        case 'LivepeerAragonAppReward':
            console.log("APP REWARD")
            return {
                ...state,
                delegatorInfo: await delegatorInfo$().toPromise(),
                transcoder: {
                    ...state.transcoder,
                    ...await transcoderDetails$().toPromise()
                }
            }
        case 'LivepeerAragonAppSetServiceUri':
            console.log("UPDATE SERVICE URI")
            return {
                ...state,
                transcoder: {
                    ...state.transcoder,
                    serviceUri: await transcoderServiceUri$().toPromise()
                }
            }
        case 'NewRound':
            console.log("NEW ROUND")
            return {
                ...state,
                currentRound: await currentRound$().toPromise(),
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                disableUnbondTokens: await disableUnbondTokens$().toPromise(),
                transcoder: {
                    ...state.transcoder,
                    ...await transcoderDetails$().toPromise()
                }
            }
        case 'Reward':
            console.log("LIVEPEER REWARD")
            return {
                ...state,
                delegatorInfo: await delegatorInfo$().toPromise()
            }
        case ACCOUNT_CHANGED_EVENT:
            console.log("ACCOUNT CHANGED")
            return {
                ...state,
                userLptBalance: await userLptBalance$().toPromise()
            }
        default:
            return state
    }
}

const onNewEventCatchError = async (state, event) => {
    try {
        return await onNewEvent(state, event)
    } catch (error) {
        console.error(`Caught error: ${error}`)
    }
}

const accountChangedEvent$ = () =>
    api.accounts().pipe(
        map(account => {
            return {event: ACCOUNT_CHANGED_EVENT, account: account}
        }))

api.store(onNewEventCatchError,
    [
        accountChangedEvent$(),
        livepeerToken$(api).pipe(mergeMap(livepeerToken => livepeerToken.events())),
        bondingManager$(api).pipe(mergeMap(bondingManager => bondingManager.events())),
        roundsManager$(api).pipe(mergeMap(roundsManager => roundsManager.events()))
    ]
)

const userLptBalance$ = () =>
    api.accounts().pipe(
        first(),
        zip(livepeerToken$(api)),
        mergeMap(([accounts, token]) => token.balanceOf(accounts[0])))

const appLptBalance$ = () =>
    livepeerToken$(api).pipe(
        mergeMap(token => token.balanceOf(livepeerAppAddress)))

const appApprovedTokens$ = () =>
    livepeerToken$(api).pipe(
        zip(bondingManagerAddress$(api)),
        mergeMap(([token, bondingManagerAddress]) => token.allowance(livepeerAppAddress, bondingManagerAddress)))

const currentRound$ = () =>
    roundsManager$(api).pipe(
        mergeMap(roundsManager => roundsManager.currentRound()))

const pendingStakeFallback$ = (delegator) =>
    currentRound$().pipe(
        filter((currentRound) => currentRound <= delegator.lastClaimRound),
        mergeMap(() => of(0)))

const pendingStakeSuccess$ = (delegator) =>
    currentRound$().pipe(
        filter((currentRound) => currentRound > delegator.lastClaimRound),
        zip(bondingManager$(api)),
        mergeMap(([currentRound, bondingManager]) => bondingManager.pendingStake(livepeerAppAddress, currentRound)))

const pendingStake$ = (delegator) =>
    pendingStakeSuccess$(delegator).pipe(
        merge(pendingStakeFallback$(delegator)))

const delegatorInfo$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.getDelegator(livepeerAppAddress)),
        mergeMap(delegator => pendingStake$(delegator).pipe(
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

const transcoderStatus$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.transcoderStatus(livepeerAppAddress)))

const transcoderActive$ = () =>
    bondingManager$(api).pipe(
        zip(currentRound$()),
        mergeMap(([bondingManager, currentRound]) => bondingManager.isActiveTranscoder(livepeerAppAddress, currentRound)))

const transcoderServiceUri$ = () =>
    serviceRegistry$(api).pipe(
        mergeMap(serviceRegistry => serviceRegistry.getServiceURI(livepeerAppAddress)))

const transcoderDetails$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.getTranscoder(livepeerAppAddress)),
        zip(transcoderStake$(), transcoderStatus$(), transcoderActive$()),
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
