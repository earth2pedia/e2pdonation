import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Biconomy } from '@biconomy/mexa';

const INFURA_RPC_URL = process.env.REACT_APP_INFURA_RPC_URL;
const BICONOMY_API_KEY = process.env.REACT_APP_BICONOMY_API_KEY;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const FORWARDER_ADDRESS = process.env.REACT_APP_FORWARDER_ADDRESS;
const DONATION_WALLET_ADDRESS = '0xf652e033cbde13Bfac2Fff664e9Cf9A08f54d91E';

function App() {
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState(null);
  const [biconomy, setBiconomy] = useState(null);

  useEffect(() => {
    const initBiconomy = async () => {
      const biconomy = new Biconomy(new ethers.providers.JsonRpcProvider(INFURA_RPC_URL), {
        apiKey: BICONOMY_API_KEY,
        debug: true
      });

      await biconomy.init();
      setProvider(new ethers.providers.Web3Provider(biconomy));
      setBiconomy(biconomy);
    };

    initBiconomy();
  }, []);

  const handleDonate = async () => {
    if (!provider) return;

    const signer = provider.getSigner();

    try {
      const tx = await signer.sendTransaction({
        to: DONATION_WALLET_ADDRESS,
        value: ethers.utils.parseEther(amount)
      });

      await tx.wait();
      alert('Donation successful!');
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gasless Donation DApp</h1>
        <input
          type="text"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleDonate}>Donate</button>
      </header>
    </div>
  );
}

export default App;
