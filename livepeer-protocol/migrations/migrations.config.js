const BN = require("bn.js")

const TOKEN_UNIT = new BN(10).pow(new BN(18))

module.exports = {
    bondingManager: {
        numTranscoders: 20,
        numActiveTranscoders: 10,
        unbondingPeriod: 7,
        maxEarningsClaimsRounds: 100
    },
    jobsManager: {
        verificationRate: 1000,
        verificationPeriod: 100,
        verificationSlashingPeriod: 100,
        failedVerificationSlashAmount: 1,
        missedVerificationSlashAmount: 5000,
        doubleClaimSegmentSlashAmount: 30000,
        finderFee: 50000
    },
    roundsManager: {
        roundLength: 5760,
        roundLockAmount: 100000
    },
    faucet: {
        requestAmount: new BN(10).mul(TOKEN_UNIT),
        requestWait: 1,
        whitelist: []
    },
    minter: {
        inflation: 137,
        inflationChange: 3,
        targetBondingRate: 500000
    },
    verifier: {
        verificationCodeHash: "QmUMk1wF6YmFLFyydhSVgeNCSKk4J8G38DzTzcx6FdYSzV",
        solver: "0xc613674f1876eeb89821bcaa9CfC5B9299BACBF2",
        gasPrice: 20000000000,
        gasLimit: 3000000
    }
}
