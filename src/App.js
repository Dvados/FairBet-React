// import './App.css';
// import './styles/fonsts.css';
// import Main from './pages/main/Main';

// function App() {
//   return (
//     <div className="App">
//       <Main />
//     </div>
//   );
// }

// export default App;

// Test

import './App.css';
import './styles/fonsts.css';
import Main from './pages/main/Main';

import React, { Component } from "react";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import "./App.css";

import { ConnectWallet } from "./components/test/ConnectWallet";

import contractABI from "./AddressABI/contractABI";
import contractAddress from "./AddressABI/contractAddress";

const SEPOLIA_NETWORK_ID = "11155111";
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAccount: null,
      txBeingSent: null,
      networkError: null,
      transactionError: null,
      balance: null,
      teamA: null
    };

    this.state = this.initialState;
  }

  // Connect Wallet _connectWallet
  _connectWallet = async () => {
    if (window.ethereum === undefined) {
      this.setState({
        networkError: "Please install Metamask!",
      });
      return;
    }

    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    window.ethereum.on('accountsChanged', ([newAddress]) => {
      if(newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    })

    window.ethereum.on('chainChanged', () => {
      this._resetState();
    });
  }

  async _initialize(selectedAddress) {
    this._provider = new Web3Provider(window.ethereum);

    this._fairBet = new Contract(
      contractAddress,
      contractABI,
      this._provider.getSigner(0)
    )

    this.setState({
      selectedAccount: selectedAddress
    })

    // await this.updateBalance();

    const match = await this._fairBet.matches(1);

    this.setState({
      teamA: match.teamA
    }) 
  }

  // async updateBalance(){
  //   const newBalance = (await this._provider.getBalance(this.state.selectedAccount)).toString();

  //   this.setState({
  //     balance: newBalance
  //   });
  // }

  _resetState() {
    this.setState(this.initialState);
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === SEPOLIA_NETWORK_ID) {
      return true;
    }

    this.setState({
      networkError: "Please connect to Sepolia network"
    });

    return false;
  }

  _dismissNetworkError = () => {
    this.setState({
      networkError: null
    })
  }

  render() {
    if(!this.state.selectedAccount) {
      return <ConnectWallet
        connectWallet={this._connectWallet}
        networkError={this.state.networkError}
        dismiss={this._dismissNetworkError}
      />
    }
    console.log(this._fairBet);
    return (
      <div className="App">
        <Main />
        <>
          {this.state.teamA}
        </>
      </div>
    );
  }
}