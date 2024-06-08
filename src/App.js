import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Main from "./pages/main/Main";
import contractABI from "./AddressABI/contractABI";
import contractAddress from "./AddressABI/contractAddress";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Функція для підключення до Ethereum провайдера (MetaMask)
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = web3Provider.getSigner();
          const contractInstance = new ethers.Contract(
            contractAddress,
            contractABI,
            web3Signer
          );

          setProvider(web3Provider);
          setSigner(web3Signer);
          setContract(contractInstance);
        } catch (error) {
          console.error("Помилка підключення до гаманця:", error);
        }
      } else {
        console.error("Ethereum провайдер не знайдено. Встановіть MetaMask.");
      }
    };

    connectWallet();
  }, []);

  return (
    <div className="App">
      <Main />
    </div>
  );
};

export default App;
