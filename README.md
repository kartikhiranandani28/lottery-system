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



