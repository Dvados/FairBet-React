import React, { useState, useCallback } from "react";

import '../../index.css';
import '../../styles/fonsts.css';

import SearchBar from '../../components/common/search-bar/searchBar.js';
import WalletSideBar from "../side-pannels-drawers/WalletSideBar.js";
import { useWallet } from '../../wallet/UseWallet.js';


function Header({}) {
    const [isWalletSidebarOpen, setWalletSidebarOpen] = useState(false);

    const { wallet, networkId, correctNetwork } = useWallet();

    const handleOpenWalletSidebar = useCallback(() => {
        setWalletSidebarOpen(true);
    }, []);
    
    const handleCloseWalletSidebar = useCallback(() => {
        setWalletSidebarOpen(false);
    }, []);

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
                <div>
                    <button 
                        onClick={handleOpenWalletSidebar}
                        className="justify-self-end bg-gray-700 hover:bg-indigo-900 py-1.5 px-12 mr-8 rounded-2xl lowercase"
                    >
                        Connect
                    </button>
                    <WalletSideBar isOpen={isWalletSidebarOpen} onClose={handleCloseWalletSidebar} />
                </div>
            ) : (
                <p>
                    {!correctNetwork? (
                        <>Change Network</>                        
                    ) : (
                        <>
                            Network: {networkId} <br />
                        </>
                    )}
                    {wallet}
                </p>
            )}
        </div>
    );
}

export default Header;