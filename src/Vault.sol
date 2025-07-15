// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Vault
 * @author raisefi
 * @notice A contract to hold funds for a single fundraising campaign.
 * It locks funds until the campaign ends, at which point the creator can claim them.
 */
contract Vault {
    // --- State Variables ---

    /**
     * @notice The address of the user who created this fund. Only this address can claim the funds.
     */
    address public immutable creator;

    /**
     * @notice The target amount of funding in wei.
     */
    uint256 public immutable targetAmount;

    /**
     * @notice The timestamp when the funding period ends. After this time, funding is no longer accepted.
     */
    uint256 public immutable fundingEndTime;

    /**
     * @notice The total amount of funds raised so far.
     */
    uint256 public totalFunds;

    /**
     * @notice A flag to indicate whether the funds have been claimed by the creator.
     */
    bool public isClaimed;

    // --- Events ---

    /**
     * @notice Emitted when a user successfully funds the vault.
     * @param contributor The address of the user who contributed.
     * @param amount The amount contributed in wei.
     */
    event Funded(address indexed contributor, uint256 amount);

    /**
     * @notice Emitted when the creator successfully claims the funds.
     * @param creator The address of the creator.
     * @param amount The total amount claimed.
     */
    event Claimed(address indexed creator, uint256 amount);

    // --- Errors ---

    /**
     * @notice Thrown if someone other than the creator tries to claim the funds.
     */
    error NotCreator();

    /**
     * @notice Thrown if the creator tries to claim funds before the funding period has ended.
     */
    error FundingPeriodNotOver();

    /**
     * @notice Thrown if a user tries to fund after the funding period has ended.
     */
    error FundingPeriodOver();

    /**
     * @notice Thrown if a contribution would cause the total funds to exceed the target amount.
     */
    error TargetAmountExceeded();

    /**
     * @notice Thrown if the creator attempts to claim funds that have already been claimed.
     */
    error AlreadyClaimed();

    /**
     * @notice Thrown if the creator tries to claim when no funds were raised.
     */
    error NoFundsToClaim();

    // --- Functions ---

    /**
     * @notice Initializes the vault with the creator's address, target amount, and funding duration.
     * @param _creator The address of the fund creator.
     * @param _targetAmount The funding goal in wei.
     * @param _fundingPeriodInSeconds The duration of the funding period in seconds from the time of creation.
     */
    constructor(address payable _creator, uint256 _targetAmount, uint256 _fundingPeriodInSeconds) {
        creator = _creator;
        targetAmount = _targetAmount;
        fundingEndTime = block.timestamp + _fundingPeriodInSeconds;
    }

    /**
     * @notice Allows users to contribute funds to the campaign.
     * Reverts if the funding period is over or if the contribution exceeds the target amount.
     */
    function fund() external payable {
        if (block.timestamp >= fundingEndTime) {
            revert FundingPeriodOver();
        }
        if (totalFunds + msg.value > targetAmount) {
            revert TargetAmountExceeded();
        }

        totalFunds += msg.value;
        emit Funded(msg.sender, msg.value);
    }

    /**
     * @notice Allows the creator to withdraw the entire balance of the contract after the funding period has ended.
     */
    function claimFunds() external {
        if (msg.sender != creator) {
            revert NotCreator();
        }
        if (block.timestamp < fundingEndTime) {
            revert FundingPeriodNotOver();
        }
        if (isClaimed) {
            revert AlreadyClaimed();
        }
        if (address(this).balance == 0) {
            revert NoFundsToClaim();
        }

        isClaimed = true;
        uint256 amount = address(this).balance;

        emit Claimed(creator, amount);

        (bool success,) = creator.call{value: amount}("");
        require(success, "Transfer failed.");
    }

    /**
     * @notice A view function to get the details of the vault.
     * @return A struct containing the vault's key information.
     */
    function getDetails() external view returns (address, uint256, uint256, uint256, bool) {
        return (creator, targetAmount, fundingEndTime, totalFunds, isClaimed);
    }
}
