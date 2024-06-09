import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Main from "./pages/main/Main";
// import contractABI from "./AddressABI/contractABI";
// import contractAddress from "./AddressABI/contractAddress";
import { connectWallet } from "./test/WalletUtils";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState("kuku");
  const [networkError, setNetworkError] = useState("");

  // Функція для підключення до Ethereum провайдера (MetaMask)
  const handleConnectWallet = () => {
    connectWallet(setProvider, setSigner, setContract, setConnected, setNetworkError, setAccountAddress);
  };

  return (
    <div className="App">
      <Main connectWallet={handleConnectWallet} connected={connected} accountAddress={accountAddress} />
    </div>
  );
};

export default App;
