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

## Screenshots

- Initial Balance in acconts showed using ganache
(https://github.com/user-attachments/assets/d55888af-41e5-4af3-866c-c8498d966e4e)
- Admin Page 
(https://github.com/user-attachments/assets/6ab9f3bc-0533-4d35-be2b-48f3051eaa41)
- Normal-user Page
(https://github.com/user-attachments/assets/9774b409-9d4f-48d8-88c4-5bc1ad537612)
- Admin page for selecting winner
(https://github.com/user-attachments/assets/595ddfca-97a6-4121-8992-bdee4bb4289f)
- Final balnce in Accounts
(https://github.com/user-attachments/assets/fb34e867-9580-440d-8167-077e42bef105)

## Technology Stack

- **Blockchain**: Ethereum
- **Smart Contracts**: Solidity
- **Testing Framework**: Truffle & Ganache
- **Frontend**: React.js
- **Web3 Integration**: Web3.js
- **Security**: OpenZeppelin contracts



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






