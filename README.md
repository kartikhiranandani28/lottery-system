# Decentralized Lottery System

A blockchain-based lottery system where players can purchase tickets with ETH, and a smart contract randomly selects a winner to receive the prize pool.
Made by Kartik Hiranandani, Harsh Bhati, Abhiraj Kumar, Buradkar Kalyani, Nityam Gupta, Nitin

## Features

- **Decentralized & Transparent**: All operations run on-chain for full transparency
- **Automated Winner Selection**: Smart contract randomly selects winners
- **Immediate Prize Distribution**: Winners automatically receive funds
- **Admin Controls**: Owner can manage lottery parameters
- **Reentrancy Protection**: Secure against common smart contract attacks
- **User-friendly Interface**: React frontend for easy interaction

## Technology Stack

- **Blockchain**: Ethereum
- **Smart Contracts**: Solidity
- **Testing Framework**: Truffle & Ganache
- **Frontend**: React.js
- **Web3 Integration**: Web3.js
- **Security**: OpenZeppelin contracts

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20.x or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Truffle](https://www.trufflesuite.com/truffle) (`npm install -g truffle`)
- [Ganache](https://www.trufflesuite.com/ganache) (for local blockchain testing)
- [MetaMask](https://metamask.io/) browser extension

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/decentralized-lottery.git
cd decentralized-lottery
```

### 2. Install dependencies



### 3. Start Ganache

- Launch Ganache application or CLI
- Create a new workspace (GUI) or start Ganache CLI:
  ```bash
  ganache-cli
  ```
- Ensure it's running on port `8545 or 7545` with network ID `5777 or 1377` and update the truffle.config file

### 4. Configure MetaMask

- Open MetaMask in your browser
- Add a new network:
  - Network Name: `Ganache`
  - New RPC URL: `http://127.0.0.1:8545 or 7545`
  - Chain ID: `5777 or 1377`
  - Currency Symbol: `ETH`
- Import an account from Ganache:
  - Copy one of the private keys from Ganache
  - In MetaMask, click "Import Account" and paste the private key

### 5. Compile and deploy smart contracts

```bash
# Compile contracts
truffle compile

# Deploy to local Ganache network
truffle migrate --reset
```
and update the DecentralizedLottery.json file by copying it from the build folder.
### 6. Start React frontend

```bash
cd client

# Start the React development server
npm start
```

The application should now be running at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
decentralized-lottery/
├── contracts/
│   └── DecentralizedLottery.sol
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_lottery.js
├── test/
│   └── decentralizedLottery.test.js
├── client/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   └── contracts/
│   │       └── DecentralizedLottery.json (generated after build)
│   ├── package.json
│   └── README.md
├── truffle-config.js
├── package.json
└── README.md
```

## Smart Contract Overview

The `DecentralizedLottery.sol` contract includes:

- **buyTicket()**: Allows players to purchase lottery tickets with ETH
- **selectWinner()**: Randomly selects a winner and distributes prize pool
- **getParticipantsCount()**: Returns the total number of participants
- **getPrizePool()**: Shows the current prize pool amount
- **setTicketPrice()**: Allows owner to update ticket price

## Running Tests

```bash
# Navigate to truffle directory
cd truffle

# Run all tests
truffle test

# Run specific test file
truffle test ./test/DecentralizedLottery.test.js
```

## Using the Application

1. **Connect Wallet**: Click "Connect Wallet" to connect MetaMask
2. **Buy Ticket**: Purchase a lottery ticket by clicking "Buy Ticket"
3. **View Participants**: See current participants and prize pool
4. **Admin Functions**: If you're the contract owner, you can:
   - Select a winner to end the current lottery round
   - Update the ticket price for future rounds

## Security Considerations

- The contract uses a simplified approach to randomness (keccak256 with block.timestamp)
- For production use, consider using a more secure randomness source (Chainlink VRF, etc.)
- The contract includes reentrancy protection from OpenZeppelin

## Deployment to Public Networks

To deploy to Ethereum testnets or mainnet:

1. Update `truffle-config.js` with network configuration
2. Create `.env` file with provider URLs and private keys (use `.env.example` as template)
3. Run:
   ```bash
   truffle migrate --network rinkeby  # or other network name
   ```

