import {fromDecimals} from "./lib/math-utils";
import {BN} from "../../node_modules/bn.js/lib/bn";

const TOKEN_DECIMALS = 18;

const TRANSCODER_STATUS = {
    0: "Not Registered",
    1: "Registered"
}

let defaultState = {
    appAddress: "0x0000000000000000000000000000000000000000",
    livepeerTokenAddress: "0x0000000000000000000000000000000000000000",
    userLptBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0,
    currentRound: 0,
    delegatorInfo: {
        bondedAmount: 0,
        delegateAddress: "",
        lastClaimRound: 0,
        pendingStake: 0
    },
    disableUnbondTokens: false,
    unbondingLockInfos: [],
    transcoder: {
        status: TRANSCODER_STATUS[0],
        active: false,
        totalStake: 0,
        lastRewardRound: 0,
        rewardCut: 0,
        feeShare: 0,
        pricePerSegment: 0,
        pendingRewardCut: 0,
        pendingFeeShare: 0,
        pendingPricePerSegment: 0,
        disableReward: false
    },
    tabBarSelected: 0
}

const reducer = state => {
    if (state === null) {
        return defaultState
    } else {
        return {
            ...defaultState,
            ...state,
            userLptBalance: fromDecimals(state.userLptBalance.toString(), TOKEN_DECIMALS),
            appsLptBalance: fromDecimals(state.appsLptBalance.toString(), TOKEN_DECIMALS),
            appApprovedTokens: fromDecimals(state.appApprovedTokens.toString(), TOKEN_DECIMALS),
            delegatorInfo: {
                ...state.delegatorInfo,
                totalStake: calculateTotalStake(state.delegatorInfo)
            },
            unbondingLockInfos: state.unbondingLockInfos.map(unbondingLockInfo => {
                return {
                    ...unbondingLockInfo,
                    amount: fromDecimals(unbondingLockInfo.amount, TOKEN_DECIMALS)
                }
            }),
            transcoder: {
                ...state.transcoder,
                status: TRANSCODER_STATUS[state.transcoder.status],
                rewardCut: state.transcoder.rewardCut / 1000,
                feeShare: state.transcoder.feeShare / 1000,
                pendingRewardCut: state.transcoder.pendingRewardCut / 1000,
                pendingFeeShare: state.transcoder.pendingFeeShare / 1000,
                totalStake: fromDecimals(state.transcoder.totalStake, TOKEN_DECIMALS),
                disableReward: state.transcoder.lastRewardRound === state.currentRound
            }
        }
    }
}

const calculateTotalStake = (delegatorInfo) => {
    const bondedAmountBn = new BN(delegatorInfo.bondedAmount ? delegatorInfo.bondedAmount : 0)
    const pendingStakeBn = new BN(delegatorInfo.pendingStake ? delegatorInfo.pendingStake : 0)
    const totalStake = bondedAmountBn.gt(pendingStakeBn) ? bondedAmountBn : pendingStakeBn
    return fromDecimals(totalStake.toString(), TOKEN_DECIMALS)
}

export default reducer