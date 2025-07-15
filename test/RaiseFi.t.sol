// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {RaiseFi} from "../src/RaiseFi.sol";
import {Vault} from "../src/Vault.sol";

/**
 * @title Test for RaiseFi Contract
 * @author raisefi
 * @notice This test suite covers the functionality of the RaiseFi and Vault contracts.
 */
contract RaiseFiTest is Test {
    // --- State Variables ---

    RaiseFi internal raiseFi;
    Vault internal vault;

    address internal creator = address(0x1);
    address internal donor1 = address(0x2);
    address internal donor2 = address(0x3);

    uint256 internal constant TARGET_AMOUNT = 10 ether;
    uint256 internal constant FUNDING_PERIOD_DAYS = 30;

    // --- Setup ---

    /**
     * @notice Sets up the initial state for the tests by deploying a new RaiseFi contract.
     */
    function setUp() public {
        raiseFi = new RaiseFi();
    }

    // --- Test Scenarios ---

    /**
     * @notice Tests the successful creation of a new fund.
     */
    function test_CreateFund() public {
        vm.startPrank(creator);
        address vaultAddress = raiseFi.createFund(TARGET_AMOUNT, FUNDING_PERIOD_DAYS);
        vm.stopPrank();

        assertNotEq(vaultAddress, address(0));
        assertEq(raiseFi.getTotalFundsCount(), 1);
        assertEq(raiseFi.allVaults(0), vaultAddress);

        vault = Vault(vaultAddress);
        assertEq(vault.creator(), creator);
        assertEq(vault.targetAmount(), TARGET_AMOUNT);
    }

    /**
     * @notice Tests the funding functionality of a vault.
     */
    function test_FundCampaign() public {
        // 1. Create the fund
        vm.startPrank(creator);
        address vaultAddress = raiseFi.createFund(TARGET_AMOUNT, FUNDING_PERIOD_DAYS);
        vm.stopPrank();

        vault = Vault(vaultAddress);

        // 2. First donor contributes
        vm.startPrank(donor1);
        vm.deal(donor1, 5 ether);
        vault.fund{value: 5 ether}();
        vm.stopPrank();

        assertEq(vault.totalFunds(), 5 ether);
        assertEq(address(vault).balance, 5 ether);

        // 3. Second donor contributes
        vm.startPrank(donor2);
        vm.deal(donor2, 5 ether);
        vault.fund{value: 5 ether}();
        vm.stopPrank();

        assertEq(vault.totalFunds(), 10 ether);
        assertEq(address(vault).balance, 10 ether);
    }

    /**
     * @notice Tests that a user cannot fund a campaign after the target amount has been reached.
     */
    function test_Revert_WhenFundingExceedsTarget() public {
        // 1. Create the fund and fund it to its target
        vm.startPrank(creator);
        address vaultAddress = raiseFi.createFund(TARGET_AMOUNT, FUNDING_PERIOD_DAYS);
        vm.stopPrank();

        vault = Vault(vaultAddress);

        vm.startPrank(donor1);
        vm.deal(donor1, TARGET_AMOUNT);
        vault.fund{value: TARGET_AMOUNT}();
        vm.stopPrank();

        // 2. Expect revert when another user tries to fund
        vm.startPrank(donor2);
        vm.deal(donor2, 1 ether);
        vm.expectRevert(Vault.TargetAmountExceeded.selector);
        vault.fund{value: 1 ether}();
        vm.stopPrank();
    }

    /**
     * @notice Tests that the creator cannot claim funds before the funding period has ended.
     */
    function test_Revert_WhenClaimingBeforeDeadline() public {
        // 1. Create and fund the campaign
        vm.startPrank(creator);
        address vaultAddress = raiseFi.createFund(TARGET_AMOUNT, FUNDING_PERIOD_DAYS);
        vm.stopPrank();

        vault = Vault(vaultAddress);

        vm.startPrank(donor1);
        vm.deal(donor1, 5 ether);
        vault.fund{value: 5 ether}();
        vm.stopPrank();

        // 2. Expect revert when creator tries to claim early
        vm.startPrank(creator);
        vm.expectRevert(Vault.FundingPeriodNotOver.selector);
        vault.claimFunds();
        vm.stopPrank();
    }

    /**
     * @notice Tests that a user cannot fund the campaign after the funding period has ended.
     */
    function test_Revert_WhenFundingAfterDeadline() public {
        // 1. Create the campaign
        vm.startPrank(creator);
        address vaultAddress = raiseFi.createFund(TARGET_AMOUNT, FUNDING_PERIOD_DAYS);
        vm.stopPrank();

        vault = Vault(vaultAddress);

        // 2. Fast-forward time past the deadline
        uint256 fundingPeriodInSeconds = FUNDING_PERIOD_DAYS * 1 days;
        vm.warp(block.timestamp + fundingPeriodInSeconds + 1);

        // 3. Expect revert when a user tries to fund
        vm.startPrank(donor1);
        vm.deal(donor1, 1 ether);
        vm.expectRevert(Vault.FundingPeriodOver.selector);
        vault.fund{value: 1 ether}();
        vm.stopPrank();
    }

    /**
     * @notice Tests that only the creator can claim the funds.
     */
    function test_Revert_WhenNonCreatorClaims() public {
        // 1. Create and fund the campaign
        vm.startPrank(creator);
        address vaultAddress = raiseFi.createFund(TARGET_AMOUNT, FUNDING_PERIOD_DAYS);
        vm.stopPrank();

        vault = Vault(vaultAddress);

        vm.startPrank(donor1);
        vm.deal(donor1, 5 ether);
        vault.fund{value: 5 ether}();
        vm.stopPrank();

        // 2. Fast-forward time
        uint256 fundingPeriodInSeconds = FUNDING_PERIOD_DAYS * 1 days;
        vm.warp(block.timestamp + fundingPeriodInSeconds + 1);

        // 3. Expect revert when a non-creator tries to claim
        vm.startPrank(donor1);
        vm.expectRevert(Vault.NotCreator.selector);
        vault.claimFunds();
        vm.stopPrank();
    }

    /**
     * @notice Tests the successful claiming of funds by the creator.
     */
    function test_ClaimFundsSuccessfully() public {
        // 1. Create and fund the campaign
        vm.startPrank(creator);
        address vaultAddress = raiseFi.createFund(TARGET_AMOUNT, FUNDING_PERIOD_DAYS);
        vm.stopPrank();

        vault = Vault(vaultAddress);

        vm.startPrank(donor1);
        vm.deal(donor1, 8 ether);
        vault.fund{value: 8 ether}();
        vm.stopPrank();

        // 2. Fast-forward time
        uint256 fundingPeriodInSeconds = FUNDING_PERIOD_DAYS * 1 days;
        vm.warp(block.timestamp + fundingPeriodInSeconds + 1);

        // 3. Creator claims the funds
        uint256 creatorInitialBalance = creator.balance;
        vm.startPrank(creator);
        vault.claimFunds();
        vm.stopPrank();

        // 4. Assert balances and state changes
        assertEq(vault.isClaimed(), true);
        assertEq(address(vault).balance, 0);
        assertEq(creator.balance, creatorInitialBalance + 8 ether);
    }

    /**
     * @notice Tests the getter functions for active and past funds.
     */
    function test_GetActiveAndPastFunds() public {
        // 1. Create two funds
        vm.startPrank(creator);
        address vaultAddress1 = raiseFi.createFund(TARGET_AMOUNT, 10); // 10 days
        address vaultAddress2 = raiseFi.createFund(TARGET_AMOUNT, 20); // 20 days
        vm.stopPrank();

        // 2. Initially, both funds should be active
        address[] memory activeFunds = raiseFi.getActiveFunds();
        assertEq(activeFunds.length, 2);
        assertEq(activeFunds[0], vaultAddress1);
        assertEq(activeFunds[1], vaultAddress2);

        // 3. Fast-forward time by 15 days
        vm.warp(block.timestamp + 15 days);

        // 4. Now, one fund should be past and one should be active
        activeFunds = raiseFi.getActiveFunds();
        address[] memory pastFunds = raiseFi.getPastFunds();

        assertEq(activeFunds.length, 1);
        assertEq(pastFunds.length, 1);
        assertEq(activeFunds[0], vaultAddress2);
        assertEq(pastFunds[0], vaultAddress1);
    }
}
