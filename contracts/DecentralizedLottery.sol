// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DecentralizedLottery
 * @dev A simple lottery contract where users can buy tickets and a winner is randomly selected
 */
contract DecentralizedLottery is ReentrancyGuard, Ownable { 
    // State variables
    address[] public participants;
    uint256 public ticketPrice;
    address public lastWinner;
    bool public lotteryOpen;
    
    // Events
    event TicketPurchased(address indexed player, uint256 ticketPrice);
    event WinnerSelected(address indexed winner, uint256 prizeAmount);
    event LotteryOpened();
    event LotteryClosed();
    
    /**
     * @dev Constructor to initialize the lottery
     * @param _ticketPrice Price of a single lottery ticket in Wei
     */
    constructor(uint256 _ticketPrice) {
        ticketPrice = _ticketPrice;
        lotteryOpen = true;
        emit LotteryOpened();
    }
    
    /**
     * @dev Function to buy a lottery ticket
     * Requirements:
     * - Lottery must be open
     * - Exact ticket price must be sent
     */
    function buyTicket() external payable nonReentrant {
        require(lotteryOpen, "Lottery is closed");
        require(msg.value == ticketPrice, "Incorrect payment amount");
        
        participants.push(msg.sender);
        emit TicketPurchased(msg.sender, msg.value);
    }
    
    /**
     * @dev Function to select a winner and distribute the prize pool
     * Requirements:
     * - Only contract owner can call this function
     * - At least one participant must exist
     */
    function selectWinner() external onlyOwner nonReentrant {
        require(participants.length > 0, "No participants in the lottery");
        
        uint256 winnerIndex = _generateRandomNumber() % participants.length;
        address winner = participants[winnerIndex];
        uint256 prizeAmount = address(this).balance;
        
        lastWinner = winner;
        
        // Reset lottery state
        delete participants;
        lotteryOpen = false;
        emit LotteryClosed();
        
        // Transfer prize pool to winner
        (bool success, ) = winner.call{value: prizeAmount}("");
        require(success, "Transfer failed");
        
        emit WinnerSelected(winner, prizeAmount);
    }
    
    /**
     * @dev Function to start a new lottery after a winner has been selected
     * Requirements:
     * - Only contract owner can call this function
     * - Lottery must be closed
     */
    function openNewLottery() external onlyOwner {
        require(!lotteryOpen, "Lottery is already open");
        lotteryOpen = true;
        emit LotteryOpened();
    }
    
    /**
     * @dev Function to update the ticket price
     * Requirements:
     * - Only contract owner can call this function
     * - New price must be greater than zero
     */
    function setTicketPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Ticket price must be greater than zero");
        ticketPrice = _newPrice;
    }
    
    /**
     * @dev Function to get the number of participants
     * @return The current number of participants
     */
    function getParticipantsCount() external view returns (uint256) {
        return participants.length;
    }
    
    /**
     * @dev Function to get the current prize pool
     * @return The current balance of the contract
     */
    function getPrizePool() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Internal function to generate a pseudo-random number
     * @return A pseudo-random uint256 value
     * Note: This is not secure for production use as miners can manipulate block values
     */
    function _generateRandomNumber() internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, participants)));
    }
}

