
const LivepeerDelegatorLink = (livepeerAddress) => {
    return `https://explorer.livepeer.org/accounts/${livepeerAddress}/delegating`
}

const LivepeerTranscoderLink = (livepeerAddress) => {
    return `https://explorer.livepeer.org/accounts/${livepeerAddress}/transcoding`
}

const LivepeerAccountLink = (livepeerAddress) => {
    return `https://explorer.livepeer.org/accounts/${livepeerAddress}/overview`
}

export {
    LivepeerDelegatorLink,
    LivepeerTranscoderLink,
    LivepeerAccountLink
}