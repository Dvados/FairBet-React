import { ethers } from "ethers";
import contractABI from "../AddressABI/contractABI";
import contractAddress from "../AddressABI/contractAddress";

const SEPOLIA_NETWORK_ID = "11155111";

// Функція для підключення до Ethereum провайдера (MetaMask)
export const connectWallet = async (setProvider, setSigner, setContract, setConnected, setNetworkError, setAccountAddress) => {
  if (window.ethereum) {
    try {
      const [selectedAddress] = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (!checkNetwork(setNetworkError)) {
        return;
      }

      initialize(setProvider, setSigner, setContract, setConnected, setAccountAddress, selectedAddress);

      window.ethereum.on('accountsChanged', async ([newAddress]) => {
        if (newAddress === undefined) {
          return; // Якщо нова адреса не визначена, вийти з функції
        }
    
        try {
          // Викликати функцію connectWallet з параметрами
          initialize(setProvider, setSigner, setContract, setConnected, setAccountAddress, newAddress)
        } catch (error) {
          console.error("Error when connecting the wallet after changing the account:", error);
          setNetworkError("Error when connecting the wallet after changing the account:", error);
        }
      });

      window.ethereum.on('chainChanged', () => {
        //this._resetState();
      });

    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setNetworkError("Error connecting to wallet:", error);
    }
  } else {
    console.error("No Ethereum provider found. Install MetaMask.");
    setNetworkError("No Ethereum provider found. Install MetaMask.");
  }
};

async function initialize(setProvider, setSigner, setContract, setConnected, setAccountAddress, selectedAddress) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const fairBetContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log(selectedAddress);

  setProvider(provider);
  setSigner(signer);
  setContract(fairBetContract);
  setConnected(true); // Встановити стан, що підключення відбулося
  setAccountAddress(selectedAddress); // Встановити адресу підключеного акаунту
}

// _resetState() {
//   this.setState(this.initialState);
// }

function checkNetwork(setNetworkError) {
  if (window.ethereum.networkVersion === SEPOLIA_NETWORK_ID) {
    return true;
  }

  console.log("Wrong network");
  setNetworkError("Wrong network");

  return false;
}