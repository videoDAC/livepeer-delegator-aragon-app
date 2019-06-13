import '@babel/polyfill'
import AragonApi from '@aragon/api'
import {
    agentAddress$,
    agentApp$,
    controllerAddress$,
    livepeerTokenAddress$,
    livepeerToken$,
    bondingManagerAddress$,
    bondingManager$,
    roundsManager$,
    jobsManager$,
    serviceRegistry$
} from '../web3/ExternalContracts'
import {range, of} from "rxjs";
import {mergeMap, map, filter, toArray, zip, tap, merge, catchError} from "rxjs/operators"
import {ETHER_TOKEN_FAKE_ADDRESS} from "../SharedConstants";
import retryEvery from "./lib/retryEvery";

//TODO: Refactor out streams (probably pass api and appAddress to each)
//TODO: Refactor switch statement into actions related to certain tabs/areas of the app.
//TODO: More disabling of buttons/error handling when functions can't be called.
//TODO: Add syncing UI widget, add better input UI eg sliders.

const DEBUG = true; // set to false to disable debug messages.
const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const debugLog = message => {if (DEBUG) {console.log(message)}}

const api = new AragonApi()

// Wait until we can get the agents address (demonstrating we are connected to the app) before initializing the store.
retryEvery(retry => {
    api.call('agent').subscribe(
        () => initialize(),
        error => {
            console.error(
                'Could not start background script execution due to the contract not loading the agent address:',
                error
            )
            retry()
        }
    )
})

const initialize = () => {
    api.store(onNewEventCatchError,
        [
            of({ event: INITIALIZATION_TRIGGER }),
            agentApp$(api).pipe(mergeMap(agentApp => agentApp.events())),
            livepeerToken$(api).pipe(mergeMap(livepeerToken => livepeerToken.events())),
            bondingManager$(api).pipe(mergeMap(bondingManager => bondingManager.events())),
            roundsManager$(api).pipe(mergeMap(roundsManager => roundsManager.events())),
            jobsManager$(api).pipe(mergeMap(jobsManager => jobsManager.events()))
        ]
    )
}

const initialState = async (state) => {
    return {
        ...state,
        agentAddress: await agentAddress$(api).toPromise(),
        livepeerTokenAddress: await livepeerTokenAddress$(api).toPromise(),
        livepeerControllerAddress: await controllerAddress$(api).toPromise(),
        appEthBalance: await appEthBalance$().toPromise(),
        appsLptBalance: await appLptBalance$().toPromise(),
        appApprovedTokens: await appApprovedTokens$().toPromise(),
        currentRound: await currentRound$().toPromise(),
        delegatorInfo: {
            ...await delegatorInfo$().toPromise(),
            delegatorStatus: await delegatorStatus$().toPromise(),
            pendingFees: await delegatorPendingFees$().toPromise()
        },
        disableUnbondTokens: await disableUnbondTokens$().toPromise(),
        unbondingLockInfos: await unbondingLockInfos$().toPromise(),
        transcoder: {
            ...await transcoderDetails$().toPromise(),
            serviceUri: await transcoderServiceUri$().toPromise()
        }
    }
}

const onNewEventCatchError = async (state, event) => {
    try {
        return await onNewEvent(state, event)
    } catch (error) {
        console.error(`Caught error: ${error}`)
    }
}

const onNewEvent = async (state, storeEvent) => {

    const {event: eventName, returnValues, address: eventAddress} = storeEvent

    let delegatorInfo
    let transcoder

    if (state != null) {
        delegatorInfo = state.delegatorInfo
        transcoder = state.transcoder
    }

    switch (eventName) {
        case INITIALIZATION_TRIGGER:
            debugLog("APP INITIALISED")
            return initialState(state)
        case 'AppInitialized':
            debugLog("APP CONSTRUCTOR EVENT")
            api.identify(`Livepeer: ${eventAddress}`)
            return {
                ...state,
                appAddress: eventAddress
            }
        case 'NewAgentSet':
            debugLog("NEW AGENT SET")
            return {
                ...state,
                agentAddress: await agentAddress$(api).toPromise()
            }
        case 'NewControllerSet':
            debugLog("NEW CONTROLLER SET")
            return {
                ...state,
                livepeerControllerAddress: returnValues.livepeerController
            }
        case 'VaultTransfer':
        case 'VaultDeposit':
            debugLog("TRANSFER IN/OUT")
            return {
                ...state,
                appEthBalance: await appEthBalance$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise(),
            }
        case 'LivepeerAragonAppApproval':
            debugLog("APPROVAL")
            return {
                ...state,
                appApprovedTokens: await appApprovedTokens$().toPromise()
            }
        case 'LivepeerAragonAppBond':
            debugLog("BOND")
            return {
                ...state,
                appApprovedTokens: await appApprovedTokens$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise(),
                delegatorInfo: {
                    ...await delegatorInfo$().toPromise(),
                    delegatorStatus: await delegatorStatus$().toPromise(),
                    pendingFees: await delegatorPendingFees$().toPromise()
                },
                disableUnbondTokens: await disableUnbondTokens$().toPromise()
            }
        case 'Bond':
            debugLog("BONDING MANAGER BOND")
            return {
                ...state,
                delegatorInfo: {
                    ...delegatorInfo,
                    ...await delegatorInfo$().toPromise()
                },
            }
        case 'LivepeerAragonAppUnbond':
            debugLog("UNBOND")
            return {
                ...state,
                delegatorInfo: {
                    ...await delegatorInfo$().toPromise(),
                    delegatorStatus: await delegatorStatus$().toPromise(),
                    pendingFees: await delegatorPendingFees$().toPromise()
                },
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                transcoder: {
                    ...transcoder,
                    ...await transcoderDetails$().toPromise()
                }
            }
        case 'Unbond':
            debugLog("BONDING MANAGER UNBOND")
            return {
                ...state,
                delegatorInfo: {
                    ...delegatorInfo,
                    ...await delegatorInfo$().toPromise()
                }
            }
        case 'LivepeerAragonAppRebond':
        case 'LivepeerAragonAppRebondFromUnbonded':
            debugLog("REBOND")
            return {
                ...state,
                delegatorInfo: {
                    ...await delegatorInfo$().toPromise(),
                    delegatorStatus: await delegatorStatus$().toPromise(),
                    pendingFees: await delegatorPendingFees$().toPromise()
                },
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                transcoder: {
                    ...transcoder,
                    ...await transcoderDetails$().toPromise()
                }
            }
        case 'LivepeerAragonAppEarnings':
            debugLog("CLAIM EARNINGS")
            return {
                ...state,
                delegatorInfo: {
                    ...delegatorInfo,
                    ...await delegatorInfo$().toPromise(),
                    pendingFees: await delegatorPendingFees$().toPromise()
                }
            }
        case 'LivepeerAragonAppFees':
            debugLog('WITHDRAW FEES')
            return {
                ...state,
                appEthBalance: await appEthBalance$().toPromise(),
                delegatorInfo: {
                    ...delegatorInfo,
                    ...await delegatorInfo$().toPromise(),
                    pendingFees: await delegatorPendingFees$().toPromise()
                }
            }
        case 'LivepeerAragonAppWithdrawStake':
            debugLog("WITHDRAW STAKE")
            return {
                ...state,
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                appsLptBalance: await appLptBalance$().toPromise()
            }
        case 'DistributeFees':
            debugLog("DISTRIBUTE FEES")
            return {
                ...state,
                delegatorInfo: {
                    ...delegatorInfo,
                    pendingFees: await delegatorPendingFees$().toPromise()
                }
            }
        case 'LivepeerAragonAppDeclareTranscoder':
            debugLog("DECLARE TRANSCODER")
            return {
                ...state,
                transcoder: {
                    ...transcoder,
                    ...await transcoderDetails$().toPromise()
                }
            }
        case 'LivepeerAragonAppReward':
            debugLog("APP REWARD")
            return {
                ...state,
                delegatorInfo: {
                    ...delegatorInfo,
                    ...await delegatorInfo$().toPromise()
                },
                transcoder: {
                    ...transcoder,
                    ...await transcoderDetails$().toPromise()
                }
            }
        case 'LivepeerAragonAppSetServiceUri':
            debugLog("UPDATE SERVICE URI")
            return {
                ...state,
                transcoder: {
                    ...transcoder,
                    serviceUri: await transcoderServiceUri$().toPromise()
                }
            }
        case 'NewRound':
            debugLog("NEW ROUND")
            return {
                ...state,
                currentRound: await currentRound$().toPromise(),
                unbondingLockInfos: await unbondingLockInfos$().toPromise(),
                disableUnbondTokens: await disableUnbondTokens$().toPromise(),
                transcoder: {
                    ...transcoder,
                    ...await transcoderDetails$().toPromise()
                }
            }
        case 'Reward':
            debugLog("LIVEPEER REWARD")
            return {
                ...state,
                delegatorInfo: {
                    ...delegatorInfo,
                    ...await delegatorInfo$().toPromise()
                }
            }
        default:
            return state
    }
}

const onErrorReturnDefault = (errorContext, defaultReturnValue) =>
    catchError(error => {
        console.error(`Error fetching ${errorContext}: ${error}`)
        return of(defaultReturnValue)
    })

const appEthBalance$ = () =>
    agentApp$(api).pipe(
        mergeMap(agentApp => agentApp.balance(ETHER_TOKEN_FAKE_ADDRESS)),
        onErrorReturnDefault('appEthBalance', 0))

const appLptBalance$ = () =>
    livepeerToken$(api).pipe(
        zip(agentAddress$(api)),
        mergeMap(([token, agentAddress]) => token.balanceOf(agentAddress)),
        onErrorReturnDefault('appLptBalance', 0))

const appApprovedTokens$ = () =>
    livepeerToken$(api).pipe(
        zip(bondingManagerAddress$(api), agentAddress$(api)),
        mergeMap(([token, bondingManagerAddress, agentAddress]) => token.allowance(agentAddress, bondingManagerAddress)),
        onErrorReturnDefault('appApprovedTokens', 0))

const currentRound$ = () =>
    roundsManager$(api).pipe(
        mergeMap(roundsManager => roundsManager.currentRound()),
        onErrorReturnDefault('currentRound', 0))

const pendingStakeFallback$ = (delegator) =>
    currentRound$().pipe(
        filter((currentRound) => currentRound <= delegator.lastClaimRound),
        mergeMap(() => of(0)))

const pendingStakeSuccess$ = (delegator) =>
    currentRound$().pipe(
        filter((currentRound) => currentRound > delegator.lastClaimRound),
        zip(bondingManager$(api), agentAddress$(api)),
        mergeMap(([currentRound, bondingManager, agentAddress]) => bondingManager.pendingStake(agentAddress, currentRound)))

const pendingStake$ = (delegator) =>
    pendingStakeSuccess$(delegator).pipe(
        merge(pendingStakeFallback$(delegator)),
        onErrorReturnDefault('pendingStake', 0))

const delegatorInfo$ = () =>
    bondingManager$(api).pipe(
        zip(agentAddress$(api)),
        mergeMap(([bondingManager, agentAddress]) => bondingManager.getDelegator(agentAddress)),
        mergeMap(delegator => pendingStake$(delegator).pipe(
            map((pendingStake) => {
                return {
                    bondedAmount: delegator.bondedAmount,
                    fees: delegator.fees,
                    delegateAddress: delegator.delegateAddress,
                    delegatedAmount: delegator.delegatedAmount,
                    lastClaimRound: delegator.lastClaimRound,
                    pendingStake: pendingStake
                }
            }))),
        onErrorReturnDefault('delegatorInfo', {
            bondedAmount: 0,
            fees: 0,
            delegateAddress: 0x00,
            delegatedAmount: 0,
            lastClaimRound: 0,
            pendingStake: 0
        }))

const delegatorStatus$ = () =>
    bondingManager$(api).pipe(
        zip(agentAddress$(api)),
        mergeMap(([bondingManager, agentAddress]) => bondingManager.delegatorStatus(agentAddress)),
        onErrorReturnDefault('delegatorStatus', 0))

const delegatorPendingFees$ = () =>
    bondingManager$(api).pipe(
        zip(currentRound$(), agentAddress$(api)),
        mergeMap(([bondingManager, currentRound, agentAddress]) => bondingManager.pendingFees(agentAddress, currentRound)),
        catchError(error => of(0))) // Don't log error as pendingFees always reverts unless there are pending fees.

const mapBondingManagerToLockInfo = ([bondingManager, agentAddress]) =>
    bondingManager.getDelegator(agentAddress).pipe(
        zip(currentRound$()), // Zip here so we only get the current round once, if we did it after the range observable we would do it more times than necessary.
        mergeMap(([delegator, currentRound]) => range(0, delegator.nextUnbondingLockId).pipe(
            mergeMap(unbondingLockId => bondingManager.getDelegatorUnbondingLock(agentAddress, unbondingLockId).pipe(
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
        zip(agentAddress$(api)),
        mergeMap(mapBondingManagerToLockInfo),
        filter(unbondingLockInfo => parseInt(unbondingLockInfo.amount) !== 0),
        toArray(),
        map(unbondingLockInfos => unbondingLockInfos.sort(sortByLockId)),
        onErrorReturnDefault('unbondingLockInfos', []))

const disableUnbondTokens$ = () =>
    bondingManager$(api).pipe(
        mergeMap(bondingManager => bondingManager.maxEarningsClaimsRounds()),
        zip(currentRound$(), delegatorInfo$()),
        map(([maxRounds, currentRound, delegatorInfo]) => delegatorInfo.lastClaimRound <= currentRound - maxRounds),
        onErrorReturnDefault('disableUnbondTokens', false))

const transcoderStatus$ = () =>
    bondingManager$(api).pipe(
        zip(agentAddress$(api)),
        mergeMap(([bondingManager, agentAddress]) => bondingManager.transcoderStatus(agentAddress)),
        onErrorReturnDefault('transcoderStatus', 0))

const transcoderActive$ = () =>
    bondingManager$(api).pipe(
        zip(currentRound$(), agentAddress$(api)),
        mergeMap(([bondingManager, currentRound, agentAddress]) => bondingManager.isActiveTranscoder(agentAddress, currentRound)),
        onErrorReturnDefault('transcoderActive', false))

const transcoderServiceUri$ = () =>
    serviceRegistry$(api).pipe(
        zip(agentAddress$(api)),
        mergeMap(([serviceRegistry, agentAddress]) => serviceRegistry.getServiceURI(agentAddress)),
        onErrorReturnDefault('transcoderServiceUri', ''))

const transcoderDetails$ = () =>
    bondingManager$(api).pipe(
        zip(agentAddress$(api)),
        mergeMap(([bondingManager, agentAddress]) => bondingManager.getTranscoder(agentAddress)),
        zip(transcoderStatus$(), transcoderActive$()),
        map(([transcoderDetails, status, active]) => {
                return {
                    status: status,
                    active: active,
                    lastRewardRound: transcoderDetails.lastRewardRound,
                    rewardCut: transcoderDetails.rewardCut,
                    feeShare: transcoderDetails.feeShare,
                    pricePerSegment: transcoderDetails.pricePerSegment,
                    pendingRewardCut: transcoderDetails.pendingRewardCut,
                    pendingFeeShare: transcoderDetails.pendingFeeShare,
                    pendingPricePerSegment: transcoderDetails.pendingPricePerSegment
                }
            },
            onErrorReturnDefault('transcoderDetails', {
                status: 0,
                active: false,
                lastRewardRound: 0,
                rewardCut: 0,
                feeShare: 0,
                pricePerSegment: 0,
                pendingRewardCut: 0,
                pendingFeeShare: 0,
                pendingPricePerSegment: 0
            }))
    )
