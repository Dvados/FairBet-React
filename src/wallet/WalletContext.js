import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../contract/contract';

// Створення контексту
export const WalletContext = createContext();

// Провайдер контексту
export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const SEPOLIA_NETWORK_ID = 11155111;

  const handleAccountsChanged = useCallback(async ([newAddress]) => {
    if (newAddress) {
      setWallet(newAddress);
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
      const contractInstance = getContract(signer);
      setContract(contractInstance);
      const network = await provider.getNetwork();
      setNetworkId(network.chainId);
    } else {
      // Якщо немає підключених облікових записів
      setWallet(null);
      setProvider(null);
      setSigner(null);
      setContract(null);
      setNetworkId(null);
    }
  }, []);

  // const handleChainChanged = useCallback(async () => {
  //   if (provider) {
  //     const network = await provider.getNetwork();
  //     setNetworkId(network.chainId);
  //   }
  // }, [provider]);

  const handleChainChanged = useCallback(async () => {
    if (provider) {
      try {
        const network = await provider.getNetwork();
        setNetworkId(network.chainId);
      } catch (error) {
        console.error("Error getting network:", error);
      }
    }
  }, [provider]);

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
      const signer = provider.getSigner();
      setSigner(signer);
      const contractInstance = getContract(signer);
      setContract(contractInstance);
      const fetchNetwork = async () => {
        const network = await provider.getNetwork();
        setNetworkId(network.chainId);
      };
      fetchNetwork();
    }
  }, [wallet, provider]);

  useEffect(() => {
    console.log("Network ID:", networkId);
  }, [networkId]);
  

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        setWallet(accounts[0]);
        const network = await provider.getNetwork();
        setNetworkId(network.chainId);
      } catch (error) {
        console.error("Error connecting wallet", error);
      }
    } else {
      console.error("No Ethereum wallet detected");
    }
  };

  const isSepoliaNetwork = networkId === SEPOLIA_NETWORK_ID;

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, contract, networkId, isSepoliaNetwork }}>
      {children}
    </WalletContext.Provider>
  );
};