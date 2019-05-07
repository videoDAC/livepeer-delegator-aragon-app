import {bufferToHex} from "ethereumjs-util"
import ethAbi from "ethereumjs-abi"

export function contractId(name) {
    return bufferToHex(ethAbi.soliditySHA3(["string"], [name]))
}