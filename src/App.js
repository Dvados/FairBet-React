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

import React, { Component } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Wallet

import contractABI from './AddressABI/contractABI';
import contractAddress from './AddressABI/contractAddress';

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
    };

    this.state = this.initialState;
  }

  // Connect Wallet _connectWallet
  _connectWallet = async () => {
    if (window.ethereum === undefined) {
      this.setState({
        networkError: 'Please install Metamask!'
      })
      return;

      const [selectedAccount] = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      if(!this._checkNetwork()) { return }

      _checkNetwork() {
      }
    }
  }
}
