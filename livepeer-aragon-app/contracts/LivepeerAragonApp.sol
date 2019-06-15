pragma solidity ^0.4.24;

import "@aragon/apps-agent/contracts/Agent.sol";
import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/common/SafeERC20.sol";
import "@aragon/os/contracts/lib/token/ERC20.sol";
import "./IController.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

// TODO: Get decimal numbers from LPT contract in Radspec strings
// TODO: Write tests
contract LivepeerAragonApp is AragonApp {

    using SafeERC20 for ERC20;

    address internal constant ETH = address(0);

    string private constant ERROR_VALUE_MISMATCH = "LIVEPEERARAGONAPP_VALUE_MISMATCH";
    string private constant ERROR_TOKEN_TRANSFER_FROM_REVERTED = "LIVEPEERARAGONAPP_TOKEN_TRANSFER_FROM_REVERT";
    string private constant ERROR_TOKEN_APPROVE_REVERTED = "LIVEPEERARAGONAPP_TOKEN_APPROVE_REVERT";

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant SET_CONTROLLER_ROLE = keccak256("SET_CONTROLLER_ROLE");
    bytes32 public constant APPROVE_ROLE = keccak256("APPROVE_ROLE");
    bytes32 public constant BOND_ROLE = keccak256("BOND_ROLE");
    bytes32 public constant APPROVE_AND_BOND_ROLE = keccak256("APPROVE_AND_BOND_ROLE");
    bytes32 public constant CLAIM_EARNINGS_ROLE = keccak256("CLAIM_EARNINGS_ROLE");
    bytes32 public constant WITHDRAW_FEES_ROLE = keccak256("WITHDRAW_FEES_ROLE");
    bytes32 public constant UNBOND_ROLE = keccak256("UNBOND_ROLE");
    bytes32 public constant REBOND_ROLE = keccak256("REBOND_ROLE");
    bytes32 public constant WITHDRAW_STAKE_ROLE = keccak256("WITHDRAW_STAKE_ROLE");
    bytes32 public constant DECLARE_TRANSCODER_ROLE = keccak256("DECLARE_TRANSCODER_ROLE");
    bytes32 public constant REWARD_ROLE = keccak256("REWARD_ROLE");
    bytes32 public constant SET_SERVICE_URI_ROLE = keccak256("SET_SERVICE_URI_ROLE");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");

    Agent public agent;
    IController public livepeerController;

    event AppInitialized(address livepeerController);
    event NewAgentSet(address agent);
    event NewControllerSet(address livepeerController);
    event LivepeerAragonAppApproval(uint256 value);
    event LivepeerAragonAppBond(uint256 amount, address to);
    event LivepeerAragonAppEarnings(uint256 upToRound);
    event LivepeerAragonAppFees();
    event LivepeerAragonAppUnbond(uint256 amount);
    event LivepeerAragonAppRebond(uint256 unbondingLockId);
    event LivepeerAragonAppRebondFromUnbonded(address to, uint256 unbondingLockId);
    event LivepeerAragonAppWithdrawStake(uint256 unbondingLockId);
    event LivepeerAragonAppDeclareTranscoder(uint256 rewardCut, uint256 feeShare, uint256 pricePerSegment);
    event LivepeerAragonAppReward();
    event LivepeerAragonAppSetServiceUri(string serviceURI);

    /**
    * @notice Initialize the LivepeerAragonApp
    * @param _agent The Agent contract address
    * @param _livepeerController The Livepeer Controller contract address
    */
    function initialize(address _agent, address _livepeerController) external onlyInit {
        initialized();

        agent = Agent(_agent);
        livepeerController = IController(_livepeerController);

        // We can't get the apps address from aragonAPI so we listen for this initialized event in the script.
        emit AppInitialized(_livepeerController);
    }

    /**
    * @notice Update the Agent address to `_address`
    * @param _address New Agent address
    */
    function setAgent(address _address) external auth(SET_AGENT_ROLE) {
        agent = Agent(_address);
        emit NewAgentSet(_address);
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
    * @notice Approve the Bonding Manager to spend `@tokenAmount(self.getLivepeerContractAddress("LivepeerToken"): address, _value, true, 18)`
              `self.getLivepeerContractAddress("LivepeerToken"): address` from the Livepeer App.
    * @param _value The amount of tokens to approve
    */
    function livepeerTokenApprove(uint256 _value) external auth(APPROVE_ROLE) {
        address livepeerTokenAddress = getLivepeerContractAddress("LivepeerToken");
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "approve(address,uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, bondingManagerAddress, _value);

        emit LivepeerAragonAppApproval(_value);

        agent.execute(livepeerTokenAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Bond `@tokenAmount(self.getLivepeerContractAddress("LivepeerToken"): address, _amount, true, 18)`
              `self.getLivepeerContractAddress("LivepeerToken"): address` to `_to`
    * @param _amount The amount of tokens to bond
    * @param _to The address to bond to
    */
    function bond(uint256 _amount, address _to) external auth(BOND_ROLE) {
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "bond(uint256,address)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _amount, _to);

        emit LivepeerAragonAppBond(_amount, _to);

        agent.execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Approve and Bond `@tokenAmount(self.getLivepeerContractAddress("LivepeerToken"): address, _amount, true, 18)`
              `self.getLivepeerContractAddress("LivepeerToken"): address` to `_to`
    * @param _amount The amount of tokens to approve and bond
    * @param _to The address to bond to
    */
    function approveAndBond(uint256 _amount, address _to) external auth(APPROVE_AND_BOND_ROLE) {
        bytes memory spec1 = hex"00000001";
        address livepeerTokenAddress = getLivepeerContractAddress("LivepeerToken");
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        bytes memory approveEncoded = abi.encodeWithSignature("approve(address,uint256)", bondingManagerAddress, _amount);
        bytes memory bondEncoded = abi.encodeWithSignature("bond(uint256,address)", _amount, _to);

        bytes memory approveScript = _createForwarderScript(livepeerTokenAddress, approveEncoded);
        bytes memory bondScript = _createForwarderScript(bondingManagerAddress, bondEncoded);

        bytes memory specAndApprove = BytesLib.concat(spec1, approveScript);
        bytes memory specAndApproveAndBond = BytesLib.concat(specAndApprove, bondScript);

        emit LivepeerAragonAppApproval(_amount);
        emit LivepeerAragonAppBond(_amount, _to);

        agent.forward(specAndApproveAndBond);
    }

    /**
    * @notice Claim earnings up to round `_endRound`
    * @param _endRound Last round to claim earnings up to
    */
    function claimEarnings(uint256 _endRound) external auth(CLAIM_EARNINGS_ROLE) {
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "claimEarnings(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _endRound);

        emit LivepeerAragonAppEarnings(_endRound);

        agent.execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Withdraw transcoder fees to the Livepeer app
    */
    function withdrawFees() external auth(WITHDRAW_FEES_ROLE) {
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "withdrawFees()";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature);

        emit LivepeerAragonAppFees();

        agent.execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Unbond `@tokenAmount(self.getLivepeerContractAddress("LivepeerToken"): address, _amount, true, 18)`
              `self.getLivepeerContractAddress("LivepeerToken"): address`
    * @param _amount The amount of tokens to unbond
    */
    function unbond(uint256 _amount) external auth(UNBOND_ROLE) {
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "unbond(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _amount);

        emit LivepeerAragonAppUnbond(_amount);

        agent.execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Rebond unbonding lock with ID `_unbondingLockId`
    * @param _unbondingLockId The unbonding lock Id
    */
    function rebond(uint256 _unbondingLockId) external auth(REBOND_ROLE) {
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "rebond(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _unbondingLockId);

        emit LivepeerAragonAppRebond(_unbondingLockId);

        agent.execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Rebond unbonding lock with ID `_unbondingLockId` to `_to`
    * @param _unbondingLockId The unbonding lock Id
    */
    function rebondFromUnbonded(address _to, uint256 _unbondingLockId) external auth(REBOND_ROLE) {
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "rebondFromUnbonded(address,uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _to, _unbondingLockId);

        emit LivepeerAragonAppRebondFromUnbonded(_to, _unbondingLockId);

        agent.execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Withdraw stake for unbonding lock `_unbondingLockId` to the Livepeer app
    * @param _unbondingLockId The unbonding lock ID
    */
    function withdrawStake(uint256 _unbondingLockId) external auth(WITHDRAW_STAKE_ROLE) {
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "withdrawStake(uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _unbondingLockId);

        emit LivepeerAragonAppWithdrawStake(_unbondingLockId);

        agent.execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Declare the Livepeer App as a Transcoder with Reward Cut: `@formatPct(_rewardCut, 1000000, 4)`% Fee Share: `@formatPct(_feeShare, 1000000, 4)`% Price Per Segment: `_pricePerSegment` wei
    * @param _rewardCut Reward cut % in whole number format
    * @param _feeShare Fee share % in whole number format
    * @param _pricePerSegment Price per segment in wei
    */
    function declareTranscoder(uint256 _rewardCut, uint256 _feeShare, uint256 _pricePerSegment) external auth(DECLARE_TRANSCODER_ROLE) {
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "transcoder(uint256,uint256,uint256)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _rewardCut, _feeShare, _pricePerSegment);

        emit LivepeerAragonAppDeclareTranscoder(_rewardCut, _feeShare, _pricePerSegment);

        agent.execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Claim reward for operating the transcoder and reward the transcoder's delegates
    */
    function transcoderReward() external auth(REWARD_ROLE) {
        address bondingManagerAddress = getLivepeerContractAddress("BondingManager");

        string memory functionSignature = "reward()";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature);

        emit LivepeerAragonAppReward();

        agent.execute(bondingManagerAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Set the transcoders service URI to `_serviceUri`
    * @param _serviceUri New service URI
    */
    function setServiceUri(string _serviceUri) external auth(SET_SERVICE_URI_ROLE) {
        address serviceRegistryAddress = getLivepeerContractAddress("ServiceRegistry");

        string memory functionSignature = "setServiceURI(string)";
        bytes memory encodedFunctionCall = abi.encodeWithSignature(functionSignature, _serviceUri);

        emit LivepeerAragonAppSetServiceUri(_serviceUri);

        agent.execute(serviceRegistryAddress, 0, encodedFunctionCall);
    }

    /**
    * @notice Transfer `@tokenAmount(_token, _value, true, 18)` `_token` from the Livepeer App to `_to`
    * @param _token Address of the token being transferred
    * @param _to Address of the recipient of tokens
    * @param _value Amount of tokens being transferred
    */
    /* solium-disable-next-line function-order */
    function transfer(address _token, address _to, uint256 _value) external auth(TRANSFER_ROLE) {
        agent.transfer(_token, _to, _value);
    }

    /**
    * @notice Deposit `@tokenAmount(_token, _value, true, 18)` `_token` tokens to the Livepeer App
    * @param _token Address of the token being transferred
    * @param _value Amount of tokens being transferred
    */
    function deposit(address _token, uint256 _value) external payable {
        require(ERC20(_token).safeTransferFrom(msg.sender, address(this), _value), ERROR_TOKEN_TRANSFER_FROM_REVERTED);
        require(ERC20(_token).safeApprove(address(agent), _value), ERROR_TOKEN_APPROVE_REVERTED);
        agent.deposit(_token, _value);
    }

    /**
    * @notice Get the address of the specified livepeer contract. It is public to enable use in radspec.
    * @param _livepeerContract Keccack256() of the name of the contract
    */
    function getLivepeerContractAddress(string memory _livepeerContract) public view returns (address) {
        bytes32 contractId = keccak256(_livepeerContract);
        return livepeerController.getContract(contractId);
    }

    function _createForwarderScript(address _toAddress, bytes memory _functionCall) internal pure returns (bytes) {
        bytes memory toAddressBytes = abi.encodePacked(_toAddress);
        bytes memory functionCallLength = abi.encodePacked(bytes4(_functionCall.length));

        bytes memory addressAndLength = BytesLib.concat(toAddressBytes, functionCallLength);
        bytes memory addressAndLengthAndCall = BytesLib.concat(addressAndLength, _functionCall);

        return addressAndLengthAndCall;
    }

}
