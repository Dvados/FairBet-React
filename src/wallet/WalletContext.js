import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../contract/contract';

// Створення контексту
export const WalletContext = createContext();

// Провайдер контексту
export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const SEPOLIA_NETWORK_ID = 11155111;
  const MAINNET_NETWORK_ID = 1;

  const handleAccountsChanged = useCallback(async ([newAddress]) => {
    if (newAddress) {
      setWallet(newAddress);
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    } else {
      // Якщо немає підключених облікових записів
      setWallet(null);
    }
  }, []);

  const handleChainChanged = useCallback(async () => {
    if (window.ethereum) {
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
      } catch (error) {
        console.error("Error getting network:", error);
        setNetworkId(null); // Скидаємо networkId у разі помилки
      }
    }
  }, []);
  
  useEffect(() => {
    if (window.ethereum) {
      // Слухаємо зміни облікових записів
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Слухаємо зміни мережі
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  useEffect(() => {
    if (wallet && provider) {
      const contractInstance = getContract(provider.getSigner());
      setContract(contractInstance);
      const fetchNetwork = async () => {
        const network = await provider.getNetwork();
        setNetworkId(Number(network.chainId));
      };
      fetchNetwork();
    } else {
      // Якщо немає підключених облікових записів або провайдера
      setWallet(null);
      setProvider(null);
      setContract(null);
      setNetworkId(null);
      setCorrectNetwork(false);
    }
  }, [wallet, provider]);

  useEffect(() => {
    if (networkId === SEPOLIA_NETWORK_ID || networkId === MAINNET_NETWORK_ID) {
      setCorrectNetwork(true);
    } else {
      setCorrectNetwork(false);
    }
    console.log("Network ID:", networkId);
    console.log("Is Correct Network", correctNetwork);
  }, [networkId]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const [wallet] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        setWallet(wallet);
        setProvider(provider);
      } catch (error) {
        console.error("Error connecting wallet", error);
      }
    } else {
      console.error("No Ethereum wallet detected");
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, contract, networkId, correctNetwork }}>
      {children}
    </WalletContext.Provider>
  );
};