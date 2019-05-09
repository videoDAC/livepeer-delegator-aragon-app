pragma solidity ^0.4.24;

import "./Agent.sol";
import "./IController.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

/*
 This fairly hacky contract was originally a workaround for some limitations with using Agent.sol directly and the aragonAPI,
 outlined below, and has become somewhat necessary.
 1) We cannot access functions on inherited contracts in the aragonAPI so we need to hoist some functions into this child contract.
 2) Since we can't set permission params using the UI, necessary to appropriately restrict access to Agent.sol functions, we must create
    custom permissions applied to the custom hoisted functions, which can be modified in the UI.
 3) We can't get the apps address from aragonAPI so we use this child contract to add an initialized event, which we can
    use to get the app's address in the front-end during init.
 4) It enables us to add relevant radspec strings to functions that use execute or forward from Agent.sol, which can't be customised
    that much using the aragonAPI. In particular we can't currently include the function parameter values, necessary for voters to see
    details about what they're voting for.

 On a side note this contract also allows us to secure the Livepeer Controller address. If this is specified in the web app and passed in,
  there might be risk of the Livepeer Controller address being changed by an attacker before execution of a function.

 LivepeerDelegator includes a reference to a modified Agent contract which includes a reference to a modified Vault contract.

 TODO: Get decimal numbers from LPT contract in Radspec strings
 TODO: Remove trailing zeros from fractional token amount (not sure how)
 TODO: Write tests
 */
contract LivepeerAragonApp is Agent {

    bytes32 public constant SET_CONTROLLER_ROLE = keccak256("SET_CONTROLLER_ROLE");
    bytes32 public constant APPROVE_ROLE = keccak256("APPROVE_ROLE");
    bytes32 public constant BOND_ROLE = keccak256("BOND_ROLE");
    bytes32 public constant APPROVE_AND_BOND_ROLE = keccak256("APPROVE_AND_BOND_ROLE");
    bytes32 public constant CLAIM_EARNINGS_ROLE = keccak256("CLAIM_EARNINGS_ROLE");
    bytes32 public constant UNBOND_ROLE = keccak256("UNBOND_ROLE");
    bytes32 public constant WITHDRAW_STAKE_ROLE = keccak256("WITHDRAW_STAKE_ROLE");
    bytes32 public constant DECLARE_TRANSCODER_ROLE = keccak256("DECLARE_TRANSCODER_ROLE");
    bytes32 public constant REWARD_ROLE = keccak256("REWARD_ROLE");
    bytes32 public constant SET_SERVICE_URI_ROLE = keccak256("SET_SERVICE_URI_ROLE");

    IController public livepeerController;

    event AppInitialized(address livepeerController);
    event NewControllerSet(address livepeerController);
    event LivepeerAragonAppApproval(uint256 value);
    event LivepeerAragonAppBond(uint256 amount, address to);
    event LivepeerAragonAppEarnings(uint256 upToRound);
    event LivepeerAragonAppUnbond(uint256 amount);
    event LivepeerAragonAppWithdrawStake(uint256 unbondingLockId);
    event LivepeerAragonAppDeclareTranscoder(uint256 rewardCut, uint256 feeShare, uint256 pricePerSegment);
    event LivepeerAragonAppReward();
    event LivepeerAragonAppSetServiceUri(string serviceURI);

    /**
    * @notice Initialize the LivepeerHack contract
    * @param _livepeerController The Livepeer Controller contract address
    */
    function initialize(address _livepeerController) external onlyInit {
        initialized();
        livepeerController = IController(_livepeerController);
        setDepositable(true);

        emit AppInitialized(_livepeerController);
    }

    /**
    * @notice Update the Livepeer Controller address to `_address`
    * @param _address New Livepeer Controller address
    */
    function setLivepeerController(address _address) external auth(SET_CONTROLLER_ROLE) {
        livepeerController = IController(_address);
        emit NewControllerSet(_address);
    }

    /**
    * @notice Approve the Bonding Manager to spend
              `_value / 10^18``_value % 10^18 > 0 ? '.' + _value % 10^18 : ''` LPT tokens from the Livepeer App.
    * @param _value The amount of tokens to approve
    */
    function livepeerTokenApprove(uint256 _value) external auth(APPROVE_ROLE) {
        address livepeerTokenAddress = _getLivepeerContractAddress("LivepeerToken");
        address bondingManagerAddress = _getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "approve(address,uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, bondingManagerAddress, _value);

        emit LivepeerAragonAppApproval(_value);

        _execute(livepeerTokenAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Bond `_amount / 10^18``_amount % 10^18 > 0 ? '.' + _amount % 10^18 : ''` LPT tokens to `_to`
    * @param _amount The amount of tokens to bond
    * @param _to The address to bond to
    */
    function bond(uint256 _amount, address _to) external auth(BOND_ROLE) {
        address bondingManagerAddress = _getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "bond(uint256,address)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _amount, _to);

        emit LivepeerAragonAppBond(_amount, _to);

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Approve and Bond `_amount / 10^18``_amount % 10^18 > 0 ? '.' + _amount % 10^18 : ''` LPT tokens to `_to`
    * @param _amount The amount of tokens to approve and bond
    * @param _to The address to bond to
    */
    function approveAndBond(uint256 _amount, address _to) external auth(APPROVE_AND_BOND_ROLE) {
        bytes memory spec1 = hex"00000001";
        address livepeerTokenAddress = _getLivepeerContractAddress("LivepeerToken");
        address bondingManagerAddress = _getLivepeerContractAddress("BondingManager");

        bytes memory approveEncoded = abi.encodeWithSignature("approve(address,uint256)", bondingManagerAddress, _amount);
        bytes memory bondEncoded = abi.encodeWithSignature("bond(uint256,address)", _amount, _to);

        bytes memory approveScript = _createForwarderScript(livepeerTokenAddress, approveEncoded);
        bytes memory bondScript = _createForwarderScript(bondingManagerAddress, bondEncoded);

        bytes memory specAndApprove = BytesLib.concat(spec1, approveScript);
        bytes memory specAndApproveAndBond = BytesLib.concat(specAndApprove, bondScript);

        emit LivepeerAragonAppApproval(_amount);
        emit LivepeerAragonAppBond(_amount, _to);

        _forward(specAndApproveAndBond);
    }

    /**
    * @notice Claim earnings up to round `_endRound`
    * @param _endRound Last round to claim earnings up to
    */
    function claimEarnings(uint256 _endRound) external auth(CLAIM_EARNINGS_ROLE) {
        address bondingManagerAddress = _getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "claimEarnings(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _endRound);

        emit LivepeerAragonAppEarnings(_endRound);

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Unbond `_amount / 10^18``_amount % 10^18 > 0 ? '.' + _amount % 10^18 : ''` LPT tokens
    * @param _amount The amount of tokens to unbond
    */
    function unbond(uint256 _amount) external auth(UNBOND_ROLE) {
        address bondingManagerAddress = _getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "unbond(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _amount);

        emit LivepeerAragonAppUnbond(_amount);

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Withdraw stake for unbonding lock `_unbondingLockId` to the Livepeer app
    * @param _unbondingLockId The unbonding lock ID
    */
    function withdrawStake(uint256 _unbondingLockId) external auth(WITHDRAW_STAKE_ROLE) {
        address bondingManagerAddress = _getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "withdrawStake(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _unbondingLockId);

        emit LivepeerAragonAppWithdrawStake(_unbondingLockId);

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Declare the Livepeer App as a Transcoder with Reward Cut: `_rewardCut / 10000``_rewardCut % 10000 > 0 ? '.' + _rewardCut % 10000 : ''`%
              Fee Share: `_feeShare / 10000``_feeShare % 10000 > 0 ? '.' + _feeShare % 10000 : ''`% Price Per Segment: `_pricePerSegment` wei
    * @param _rewardCut Reward cut % in whole number format
    * @param _feeShare Fee share % in whole number format
    * @param _pricePerSegment Price per segment in wei
    */
    function declareTranscoder(uint256 _rewardCut, uint256 _feeShare, uint256 _pricePerSegment) external auth(DECLARE_TRANSCODER_ROLE) {
        address bondingManagerAddress = _getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "transcoder(uint256,uint256,uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _rewardCut, _feeShare, _pricePerSegment);

        emit LivepeerAragonAppDeclareTranscoder(_rewardCut, _feeShare, _pricePerSegment);

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Claim reward for operating the transcoder and reward the transcoder's delegates
    */
    function transcoderReward() external auth(REWARD_ROLE) {
        address bondingManagerAddress = _getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "reward()";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature);

        emit LivepeerAragonAppReward();

        _execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Set the transcoders service URI to `_serviceUri`
    * @param _serviceUri New service URI
    */
    function setServiceUri(string _serviceUri) external auth(SET_SERVICE_URI_ROLE) {
        address serviceRegistryAddress = _getLivepeerContractAddress("ServiceRegistry");

        string memory functionSignature = "setServiceURI(string)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _serviceUri);

        emit LivepeerAragonAppSetServiceUri(_serviceUri);

        _execute(serviceRegistryAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Transfer `_value / 10^18``_value % 10^18 > 0 ? '.' + _value % 10^18 : ''` `_token` tokens from the Livepeer App to `_to`
    * @param _token Address of the token being transferred
    * @param _to Address of the recipient of tokens
    * @param _value Amount of tokens being transferred
    */
    /* solium-disable-next-line function-order */
    function transfer(address _token, address _to, uint256 _value) external authP(TRANSFER_ROLE, arr(_token, _to, _value)) {
        _transfer(_token, _to, _value);
    }

    /**
    * @notice Deposit `_value / 10^18``_value % 10^18 > 0 ? '.' + _value % 10^18 : ''` `_token` tokens to the Livepeer App
    * @param _token Address of the token being transferred
    * @param _value Amount of tokens being transferred
    */
    function deposit(address _token, uint256 _value) external payable isInitialized {
        _deposit(_token, _value);
    }

    function _getLivepeerContractAddress(string memory livepeerContract) internal view returns (address) {
        bytes32 contractId = keccak256(livepeerContract);
        return livepeerController.getContract(contractId);
    }

    function _createForwarderScript(address toAddress, bytes memory functionCall) internal pure returns (bytes) {
        bytes memory toAddressBytes = abi.encodePacked(toAddress);
        bytes memory functionCallLength = abi.encodePacked(bytes4(functionCall.length));

        bytes memory addressAndLength = BytesLib.concat(toAddressBytes, functionCallLength);
        bytes memory addressAndLengthAndCall = BytesLib.concat(addressAndLength, functionCall);

        return addressAndLengthAndCall;
    }

}
