import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import LotteryContract from './contracts/DecentralizedLottery.json';

const getProfilePicture = (address) => {
  if (!address) return '/profile-pics/0.png'; // Changed to .png
  
  // Get the last character of the address and convert to a number
  const lastChar = address.slice(-1);
  const num = parseInt(lastChar, 16) % 10;
  
  return `/profile-pics/${num}.png`; // Changed to .png
};

function App() {
  // State variables
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [ticketPrice, setTicketPrice] = useState('');
  const [participantsCount, setParticipantsCount] = useState(0);
  const [prizePool, setPrizePool] = useState('0');
  const [lotteryOpen, setLotteryOpen] = useState(true);
  const [lastWinner, setLastWinner] = useState('No winner yet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTicketPrice, setNewTicketPrice] = useState('');

  // Initialize web3
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // Modern dapp browsers
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            setWeb3(web3Instance);
          } catch (error) {
            setError('User denied account access');
          }
        }
        // Legacy dapp browsers
        else if (window.web3) {
          const web3Instance = new Web3(window.web3.currentProvider);
          setWeb3(web3Instance);
        }
        // Fallback to Ganache
        else {
          const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
          const web3Instance = new Web3(provider);
          setWeb3(web3Instance);
        }
      } catch (error) {
        console.error("Could not connect to Web3:", error);
        setError('Failed to connect to Web3');
      }
    };

    initWeb3();
  }, []);

  // Load blockchain data
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!web3) return;
      
      try {
        // Get network ID
        const networkId = await web3.eth.net.getId();
        
        // Get accounts
        const accs = await web3.eth.getAccounts();
        setAccounts(accs);
        
        // Get contract instance
        const deployedNetwork = LotteryContract.networks[networkId];
        if (deployedNetwork) {
          const instance = new web3.eth.Contract(
            LotteryContract.abi,
            deployedNetwork.address
          );
          setContract(instance);

          // Check if current user is owner
          const contractOwner = await instance.methods.owner().call();
          setIsOwner(contractOwner.toLowerCase() === accs[0].toLowerCase());
          
          // Get contract data
          await updateContractData(instance);
          
          // Set up event listeners
          setupEventListeners(instance);
        } else {
          setError('Lottery contract not deployed to detected network');
        }
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        setError('Error loading contract data');
      }
    };
    
    loadBlockchainData();
  }, [web3]);

  const updateContractData = async (contractInstance) => {
    if (!contractInstance) return;
    
    try {
      const price = await contractInstance.methods.ticketPrice().call();
      setTicketPrice(web3.utils.fromWei(price, 'ether'));
      
      const count = await contractInstance.methods.getParticipantsCount().call();
      setParticipantsCount(count);
      
      const pool = await contractInstance.methods.getPrizePool().call();
      setPrizePool(web3.utils.fromWei(pool, 'ether'));
      
      const isOpen = await contractInstance.methods.lotteryOpen().call();
      setLotteryOpen(isOpen);
      
      const winner = await contractInstance.methods.lastWinner().call();
      if (winner !== '0x0000000000000000000000000000000000000000') {
        setLastWinner(winner);
      }
    } catch (error) {
      console.error("Error updating contract data:", error);
    }
  };

  const setupEventListeners = (contractInstance) => {
    contractInstance.events.TicketPurchased()
      .on('data', async () => {
        await updateContractData(contractInstance);
        setSuccess('Ticket purchased successfully!');
        setTimeout(() => setSuccess(''), 3000);
      })
      .on('error', console.error);
      
    contractInstance.events.WinnerSelected()
      .on('data', async (event) => {
        const winner = event.returnValues.winner;
        const prize = web3.utils.fromWei(event.returnValues.prizeAmount, 'ether');
        setLastWinner(winner);
        await updateContractData(contractInstance);
        setSuccess(`Winner selected! ${winner} won ${prize} ETH`);
        setTimeout(() => setSuccess(''), 5000);
      })
      .on('error', console.error);
      
    contractInstance.events.LotteryOpened()
      .on('data', async () => {
        setLotteryOpen(true);
        await updateContractData(contractInstance);
      })
      .on('error', console.error);
  };

  const buyTicket = async () => {
    if (!contract || !accounts.length) return;
    
    setLoading(true);
    setError('');
    
    try {
      await contract.methods.buyTicket().send({ 
        from: accounts[0], 
        value: web3.utils.toWei(ticketPrice, 'ether')
      });
      // Event listener will handle success
    } catch (error) {
      console.error("Error buying ticket:", error);
      setError('Transaction failed. Make sure you have enough ETH and try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectWinner = async () => {
    if (!contract || !accounts.length || !isOwner) return;
    
    setLoading(true);
    setError('');
    
    try {
      await contract.methods.selectWinner().send({ from: accounts[0] });
      // Event listener will handle success
    } catch (error) {
      console.error("Error selecting winner:", error);
      setError('Failed to select winner. Make sure there are participants.');
    } finally {
      setLoading(false);
    }
  };

  const openNewLottery = async () => {
    if (!contract || !accounts.length || !isOwner) return;
    
    setLoading(true);
    setError('');
    
    try {
      await contract.methods.openNewLottery().send({ from: accounts[0] });
      // Event listener will handle success
    } catch (error) {
      console.error("Error opening new lottery:", error);
      setError('Failed to open new lottery.');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketPrice = async () => {
    if (!contract || !accounts.length || !isOwner || !newTicketPrice) return;
    
    setLoading(true);
    setError('');
    
    try {
      await contract.methods.setTicketPrice(
        web3.utils.toWei(newTicketPrice, 'ether')
      ).send({ from: accounts[0] });
      
      setSuccess('Ticket price updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await updateContractData(contract);
    } catch (error) {
      console.error("Error updating ticket price:", error);
      setError('Failed to update ticket price.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
<header className="App-header">
  <div className="profile-container">
    {accounts.length > 0 && (
      <img 
        src={getProfilePicture(accounts[0])} 
        alt="Profile" 
        className="profile-pic" 
      />
    )}
    <div>
      <h1>Decentralized Lottery</h1>
      {accounts.length > 0 ? (
        <p>Connected Account: {accounts[0]}</p>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  </div>
</header>
      
      <main>
        {success && <div className="success-message">{success}</div>}
        
        <div className="lottery-status">
          <h2>Lottery Status</h2>
          <p>Status: {lotteryOpen ? 'Open' : 'Closed'}</p>
          <p>Ticket Price: {ticketPrice} ETH</p>
          <p>Participants: {participantsCount}</p>
          <p>Prize Pool: {prizePool} ETH</p>
          <p>Last Winner: {lastWinner}</p>
        </div>
        
        <div className="actions">
          <h2>Actions</h2>
          
          {lotteryOpen && (
            <button 
              onClick={buyTicket} 
              disabled={loading || !web3 || !accounts.length}
              className="btn buy-ticket"
            >
              {loading ? 'Processing...' : `Buy Ticket (${ticketPrice} ETH)`}
            </button>
          )}
          
          {isOwner && lotteryOpen && participantsCount > 0 && (
            <button 
              onClick={selectWinner} 
              disabled={loading || !web3}
              className="btn select-winner"
            >
              {loading ? 'Processing...' : 'Select Winner'}
            </button>
          )}
          
          {isOwner && !lotteryOpen && (
            <button 
              onClick={openNewLottery} 
              disabled={loading || !web3}
              className="btn open-lottery"
            >
              {loading ? 'Processing...' : 'Open New Lottery'}
            </button>
          )}
          
          {isOwner && (
            <div className="admin-actions">
              <h3>Admin Actions</h3>
              <div className="price-update">
                <input 
                  type="number" 
                  placeholder="New ticket price (ETH)" 
                  value={newTicketPrice} 
                  onChange={(e) => setNewTicketPrice(e.target.value)}
                  step="0.001"
                  min="0.001"
                />
                <button 
                  onClick={updateTicketPrice} 
                  disabled={loading || !web3 || !newTicketPrice}
                  className="btn update-price"
                >
                  Update Price
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;