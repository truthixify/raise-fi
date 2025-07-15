// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Vault.sol";

/**
 * @title RaiseFi
 * @author raisefi
 * @notice A factory contract for creating and managing fundraising campaigns.
 */
contract RaiseFi {
    // --- State Variables ---

    /**
     * @notice An array storing the addresses of all deployed Vault contracts.
     */
    address[] public allVaults;

    // --- Events ---

    /**
     * @notice Emitted when a new fund (and its corresponding Vault) is created.
     * @param creator The address of the user who created the fund.
     * @param vaultAddress The address of the newly deployed Vault contract.
     * @param targetAmount The funding goal for the new campaign.
     * @param fundingEndTime The timestamp when the funding period for the new campaign ends.
     */
    event FundCreated(
        address indexed creator, address indexed vaultAddress, uint256 targetAmount, uint256 fundingEndTime
    );

    // --- Functions ---

    /**
     * @notice Creates a new fundraising campaign by deploying a new Vault contract.
     * @param _targetAmount The funding goal for the new campaign in wei.
     * @param _fundingPeriodInDays The duration of the new campaign in days.
     * @return The address of the newly created Vault contract.
     */
    function createFund(uint256 _targetAmount, uint256 _fundingPeriodInDays) external returns (address) {
        uint256 fundingPeriodInSeconds = _fundingPeriodInDays * 1 days;
        Vault newVault = new Vault(payable(msg.sender), _targetAmount, fundingPeriodInSeconds);

        address vaultAddress = address(newVault);
        allVaults.push(vaultAddress);

        emit FundCreated(msg.sender, vaultAddress, _targetAmount, block.timestamp + fundingPeriodInSeconds);

        return vaultAddress;
    }

    /**
     * @notice Retrieves a list of all active fund (Vault) contracts.
     * @return An array of addresses of Vault contracts whose funding period has not yet ended.
     */
    function getActiveFunds() external view returns (address[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allVaults.length; i++) {
            Vault vault = Vault(allVaults[i]);
            if (block.timestamp < vault.fundingEndTime() && !vault.isClaimed()) {
                activeCount++;
            }
        }

        address[] memory activeFunds = new address[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allVaults.length; i++) {
            Vault vault = Vault(allVaults[i]);
            if (block.timestamp < vault.fundingEndTime() && !vault.isClaimed()) {
                activeFunds[index] = allVaults[i];
                index++;
            }
        }

        return activeFunds;
    }

    /**
     * @notice Retrieves a list of all past fund (Vault) contracts.
     * @return An array of addresses of Vault contracts whose funding period has ended.
     */
    function getPastFunds() external view returns (address[] memory) {
        uint256 pastCount = 0;
        for (uint256 i = 0; i < allVaults.length; i++) {
            Vault vault = Vault(allVaults[i]);
            if (block.timestamp >= vault.fundingEndTime() || vault.isClaimed()) {
                pastCount++;
            }
        }

        address[] memory pastFunds = new address[](pastCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allVaults.length; i++) {
            Vault vault = Vault(allVaults[i]);
            if (block.timestamp >= vault.fundingEndTime() || vault.isClaimed()) {
                pastFunds[index] = allVaults[i];
                index++;
            }
        }

        return pastFunds;
    }

    /**
     * @notice Returns the total number of funds created.
     * @return The count of all Vault contracts deployed.
     */
    function getTotalFundsCount() external view returns (uint256) {
        return allVaults.length;
    }
}
