import {fromDecimals} from "./lib/math-utils";
import {BN} from "../../node_modules/bn.js/lib/bn";

const TOKEN_DECIMALS = 18;

let defaultState = {
    appAddress: "0x0000000000000000000000000000000000000000",
    livepeerTokenAddress: "0x0000000000000000000000000000000000000000",
    userLptBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0,
    delegatorInfo: {bondedAmount: 0, delegateAddress: "", lastClaimRound: 0, pendingStake: 0},
    currentRound: 0,
    disableUnbondTokens: false,
    unbondingLockInfos: []
}

const reducer = state => {
    if (state === null) {
        return defaultState
    } else {
        return {
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
            })
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