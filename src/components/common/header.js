import React from "react";
import '../../index.css';
import '../../styles/fonsts.css';
import SearchBar from '../../components/common/search-bar/searchBar.js';
import WalletConnectionDrawer from '../side-pannels-drawers/WalletConnection.js'
import { useWallet } from '../../wallet/UseWallet.js';


function Header({}) {
    const { wallet, connectWallet, networkId, correctNetwork } = useWallet();

    return (
        <div className="flex h-16 items-center text-white bg-gray-800 header z-50">

            {/* Logo */}
            <div className="ml-8 logo-main">
                <a href="https://valid-url.com" className="text-3xl" target="_blank" rel="noopener noreferrer">
                    FairBet
                </a>
            </div>

            {/* Search Bar */}
            <div className="flex-1 mr-4">
                <div className="flex justify-end">
                    <SearchBar />
                </div>
            </div>

            {/* Connect Button */}
            {!wallet ? (
                <button 
                onClick={connectWallet}
                className="justify-self-end bg-gray-700 hover:bg-indigo-900 py-1.5 px-12 mr-8 rounded-2xl lowercase">
                    Connect
                </button>
            ) : (
                <p>
                    {correctNetwork? (
                        <>
                            Network: {networkId} <br />
                        </>
                    ) : (
                        <>Change Network</>
                    )}
                    {wallet}
                </p>
            )}
        </div>
    );
}

export default Header;