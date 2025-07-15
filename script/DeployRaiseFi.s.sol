// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {RaiseFi} from "../src/RaiseFi.sol";

/**
 * @title DeployRaiseFi Script
 * @author raisefi
 * @notice A script for deploying the RaiseFi contract using Foundry.
 */
contract DeployRaiseFi is Script {
    /**
     * @notice The main entry point for the deployment script.
     * @return The address of the newly deployed RaiseFi contract.
     */
    function run() external returns (address) {
        // Start broadcasting transactions from the deployer's account.
        vm.startBroadcast();

        // Deploy the RaiseFi contract.
        RaiseFi raiseFi = new RaiseFi();

        // Log the address of the newly deployed contract.
        console.log("RaiseFi contract deployed at:", address(raiseFi));

        // Stop broadcasting.
        vm.stopBroadcast();

        // Return the address for external use or verification.
        return address(raiseFi);
    }
}
