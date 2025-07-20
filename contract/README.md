# RaiseFi: A Decentralized Fundraising Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/foundry-rs/foundry)
[![Solidity Version](https://img.shields.io/badge/solidity-^0.8.20-blue)](https://soliditylang.org/)

**RaiseFi** is a fully decentralized, transparent, and secure fundraising platform built on the BNB blockchain. It leverages a factory contract pattern to allow anyone to create their own time-locked, target-based funding campaigns without a middleman.

---

## Table of Contents

- [RaiseFi: A Decentralized Fundraising Platform](#raisefi-a-decentralized-fundraising-platform)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [How It Works](#how-it-works)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
    - [Test](#test)
    - [Deploy](#deploy)
      - [1. Deploying to a Local Network (Anvil)](#1-deploying-to-a-local-network-anvil)
      - [2. Deploying to a Public Testnet (e.g., Sepolia)](#2-deploying-to-a-public-testnet-eg-sepolia)
  - [Contract Details](#contract-details)
    - [`RaiseFi.sol`](#raisefisol)
      - [Key Functions](#key-functions)
    - [`Vault.sol`](#vaultsol)
      - [State Variables](#state-variables)
      - [Key Functions](#key-functions-1)
  - [Security](#security)
  - [License](#license)

## Overview

Traditional fundraising platforms are centralized, often charging high fees and imposing strict rules. **raisefi** offers a decentralized alternative. It empowers creators by giving them full control over their funds. Each campaign is managed by its own smart contract (`Vault`), ensuring that funds are locked until the campaign goals are met. The platform itself (`RaiseFi`) acts as a public registry, making it easy to discover and interact with various fundraising initiatives.

## How It Works

The system is designed around two core smart contracts:

1.  **`RaiseFi.sol` (The Factory)**: This is the main contract of the platform. Creators interact with it to launch new fundraising campaigns. It is responsible for deploying new `Vault` contracts and keeping a public record of all active and past campaigns.

2.  **`Vault.sol` (The Campaign Vault)**: For every new campaign, the `RaiseFi` factory deploys a dedicated `Vault` contract. This vault is responsible for:
    *   Securely holding all contributed funds.
    *   Enforcing the campaign rules, such as the funding deadline and the target amount.
    *   Preventing further contributions once the target is reached.
    *   Allowing only the original creator to withdraw the funds after the campaign period has successfully ended.

The workflow is simple:
- A **Creator** calls `createFund()` on the `RaiseFi` contract.
- `RaiseFi` deploys a new `Vault` contract tailored to the creator's specifications.
- **Donors** find the `Vault` address and contribute funds by calling its `fund()` function.
- Once the funding period ends, the **Creator** can call `claimFunds()` on their `Vault` to receive the total amount raised.

## Features

- **Fully Decentralized**: No central authority or intermediaries.
- **Secure & Transparent**: All funds are held in individual, open-source vault contracts, and all transactions are publicly verifiable on the blockchain.
- **Creator-Controlled**: Only the fund creator can withdraw the collected funds.
- **Time-Locked Vaults**: Funds are locked and cannot be withdrawn (even by the creator) until the fundraising period has concluded.
- **Target-Based Funding**: Campaigns automatically stop accepting funds once the predefined target amount is reached, preventing over-funding.
- **Campaign Discovery**: Getter functions allow anyone to retrieve lists of active and past campaigns for easy integration with dApp front-ends.

## Tech Stack

- **Smart Contracts**: [Solidity](https://soliditylang.org/) `^0.8.20`
- **Development & Testing Framework**: [Foundry](https://github.com/foundry-rs/foundry)

## Project Structure

```
.
├── script/
│   └── DeployRaiseFi.s.sol   # Deployment script
├── src/
│   ├── RaiseFi.sol           # The main factory contract
│   └── Vault.sol             # The vault contract for individual campaigns
├── test/
│   └── RaiseFi.t.sol         # Foundry test file for the contracts
├── foundry.toml                # Foundry configuration file
└── README.md                   # This README file```

## Getting Started

Follow these instructions to set up, test, and deploy the project on your local machine.

### Prerequisites

You must have the [Foundry](https://book.getfoundry.sh/getting-started/installation) toolchain installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/raisefi.git
    cd raisefi
    ```

2.  Install the necessary libraries:
    ```bash
    forge install
    ```

## Usage

Foundry makes it simple to manage the entire lifecycle of your smart contracts.

### Compile

To compile the contracts and ensure everything is set up correctly, run:
```bash
forge build
```

### Test

The project includes a comprehensive test suite covering all core functionalities of the `RaiseFi` and `Vault` contracts. To run the tests, use the following command:
```bash
forge test -vvv
```
The `-vvv` flag provides a more detailed output for each test case.

### Deploy

The `DeployRaiseFi.s.sol` script handles deployment.

#### 1. Deploying to a Local Network (Anvil)

First, start a local Anvil node in a separate terminal:
```bash
anvil
```
Anvil will provide you with a list of accounts and their private keys. Copy one of the private keys and use it to run the deployment script:
```bash
forge script script/DeployRaiseFi.s.sol --rpc-url http://localhost:8545 --private-key <YOUR_ANVIL_PRIVATE_KEY> --broadcast
```

#### 2. Deploying to a Public Testnet (e.g., Sepolia)

To deploy to a live network, you'll need:
- A wallet with testnet ETH.
- An RPC URL from a node provider (e.g., Infura, Alchemy).

It is **highly recommended** to use a `.env` file to manage your private key and RPC URL securely.

Create a `.env` file in the project root:
```
SEPOLIA_RPC_URL=your_rpc_url_here
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

Then, run the deployment script:
```bash
forge script script/DeployRaiseFi.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify -vvvv
```
- `--broadcast`: Submits the transaction to the network.
- `--verify`: Verifies the contract on Etherscan after deployment.

## Contract Details

### `RaiseFi.sol`

The factory contract for creating and tracking all fundraising campaigns.

#### Key Functions
- `createFund(uint256 _targetAmount, uint256 _fundingPeriodInDays)`: Deploys a new `Vault` contract for a campaign. The caller (`msg.sender`) becomes the creator.
- `getActiveFunds() view returns (address[])`: Returns an array of `Vault` addresses for campaigns that are still within their funding period.
- `getPastFunds() view returns (address[])`: Returns an array of `Vault` addresses for campaigns whose funding period has ended.
- `allVaults`: A public array storing the address of every `Vault` ever created.

### `Vault.sol`

The contract that manages a single fundraising campaign.

#### State Variables
- `creator`: The address of the campaign creator.
- `targetAmount`: The maximum amount of ETH (in wei) that can be raised.
- `fundingEndTime`: The Unix timestamp when the campaign ends.
- `totalFunds`: The current amount of ETH raised.
- `isClaimed`: A boolean flag to check if the creator has already withdrawn the funds.

#### Key Functions
- `fund() payable`: The public function that donors call to contribute ETH. Reverts if the campaign is over or if the contribution would exceed the target.
- `claimFunds()`: The function for the creator to withdraw the entire contract balance. Can only be called after `fundingEndTime`.

## Security

The contracts are written with security as a priority, incorporating checks-effects-interactions patterns and custom errors for clarity. However, they have **not been professionally audited**. Before using these contracts in a production environment, a comprehensive security audit by a reputable firm is strongly recommended.

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/licenses/MIT) file for details.