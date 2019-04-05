import '@babel/polyfill'
import AragonApi from '@aragon/api'
import {
    controllerAddress$,
    livepeerTokenAddress$,
    livepeerToken$,
    bondingManagerAddress$,
    bondingManager$,
    roundsManager$
} from '../web3/ExternalContracts'
import {range} from "rxjs";
import {first, mergeMap, map, filter, toArray, zip} from "rxjs/operators"

const ACCOUNT_CHANGED_EVENT = Symbol("ACCOUNT_CHANGED")

const api = new AragonApi()
let livepeerAppAddress = "0x0000000000000000000000000000000000000000"

//TODO: Add rebond functions.
//TODO: Add withdraw fees function.
//TODO: Rearrange UI, make actions appear in slide in menu.
//TODO: More disabling of buttons/error handling when functions can't be called.

const initialState = async (state) => {
    return {
        ...state,
        livepeerTokenAddress: await livepeerTokenAddress$(api).toPromise(),
        livepeerControllerAddress: await controllerAddress$(api).toPromise(),
        userLptBalance: await userLptBalance$().toPromise(),
        appsLptBalance: await appLptBalance$().toPromise(),
        appApprovedTokens: await appApprovedTokens$().toPromise(),
        delegatorInfo: await delegatorInfo$().toPromise(),
        currentRound: await currentRound$().toPromise(),
        disableUnbondTokens: await disableUnbondTokens$().toPromise(),
        unbondingLockInfos: await unbondingLockInfos$().toPromise()
    }
}

const onNewEvent = async (state, event) => {

    console.log(event)

    switch (event.event) {
        // TODO: Work out when the store emits, and why it emits lots of events on init (it isn't due to cache/cookies)
        case 'AppInitialized':
            console.log("APP INITIALIZED OR EXECUTE")
            livepeerAppAddress = event.address

            const initState = await initialState(state)

            return {
                ...initState,
                appAddress: livepeerAppAddress
            }
        case 'NewControllerSet':
            console.log("NEW CONTROLLER SET")
            return {
                ...state,
                livepeerControllerAddress: event.returnValues.livepeerController
            }
        case 'Transfer':
            console.log("LPT TRANSFER")
            const account = (await api.accounts().pipe(first()).toPromise())[0]

            if (account === event.returnValues.from || account === event.returnValues.to) {
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
        case 'LivepeerDelegatorApproval':
            console.log("APPROVAL")
            return {
                ...state,
                appApprovedTokens: event.returnValues.value
            }
        case 'LivepeerDelegatorBond':
            console.log("BOND")
            return {
                ...state,
                appApprovedTokens: await appApprovedTokens$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise(),
                delegatorInfo: await delegatorInfo$().toPromise(),
                disableUnbondTokens: await disableUnbondTokens$().toPromise()
            }
        case 'LivepeerDelegatorClaimEarnings':
            console.log("CLAIM EARNINGS")
            return {
                ...state,
                delegatorInfo: await delegatorInfo$().toPromise()
            }
        case 'LivepeerDelegatorUnbond':
            console.log("UNBOND")
            return {
                ...state,
                delegatorInfo: await delegatorInfo$().toPromise(),
                unbondingLockInfos: await unbondingLockInfos$().toPromise()
            }
        case 'LivepeerDelegatorWithdrawStake':
            console.log("WITHDRAW STAKE")
            return {
                ...state,
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise()
            }
        case 'NewRound':
            console.log("NEW ROUND")
            return {
                ...state,
                currentRound: await currentRound$().toPromise(),
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                disableUnbondTokens: await disableUnbondTokens$().toPromise()
            }
        case 'Reward':
            console.log("REWARD")
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

const accountChangedEvent$ = () =>
    api.accounts().pipe(
        map(account => {
            return {event: ACCOUNT_CHANGED_EVENT, account: account}
        }))

api.store(onNewEvent,
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

const pendingStake$ = () =>
    bondingManager$(api).pipe(
        zip(currentRound$()),
        mergeMap(([bondingManager, currentRound]) => bondingManager.pendingStake(livepeerAppAddress, currentRound)))

const delegatorInfo$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.getDelegator(livepeerAppAddress)),
        zip(pendingStake$()),
        map(([delegator, pendingStake]) => {
            return {
                bondedAmount: delegator.bondedAmount,
                delegateAddress: delegator.delegateAddress,
                lastClaimRound: delegator.lastClaimRound,
                pendingStake: pendingStake
            }
        }))

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
