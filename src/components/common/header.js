import React, { useState, useCallback } from "react";

import "../../index.css";
import "../../styles/fonsts.css";

// import sepoliaLogo from "../../assets/sepolia-logo.png";
// import ethLogo from "../../assets/eth-logo.png";

import SearchBar from "../../components/common/search-bar/searchBar.js";
import WalletSideBar from "../side-pannels-drawers/WalletSideBar.js";
import WalletSideBarDetails from "../side-pannels-drawers/WalletSideBarDetails.js";

import { useWallet } from "../../wallet/UseWallet.js";

import { IoIosArrowDown } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";


function Header({ }) {
    const [isWalletSidebarOpen, setWalletSidebarOpen] = useState(false);

    const { wallet, networkId, correctNetwork } = useWallet();

    // Відкрити сайдбар з гаманцями
    const handleOpenSidebar = useCallback(() => {
        setWalletSidebarOpen(true);
    }, []);

    const handleCloseSidebar = useCallback(() => {
        setWalletSidebarOpen(false);
    }, []);

    const handleOpenWalletSidebar = handleOpenSidebar;
    const handleCloseWalletSidebar = handleCloseSidebar;

    const handleOpenWalletDetailsSidebar = handleOpenSidebar;
    const handleCloseWalletDetailsSidebar = handleCloseSidebar;

    // Відкрити сайдбар з деталями гаманця
    // const handleOpenWalletDetailsSidebar = useCallback(() => {
    //     setWalletSidebarOpen(true);
    // }, []);

    // const handleCloseWalletDetailsSidebar = useCallback(() => {
    //     setWalletSidebarOpen(false);
    // }, []);

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

                    {/* Wallet Side Bar */}
                    <WalletSideBar isOpen={isWalletSidebarOpen} onClose={handleCloseWalletSidebar} />
                </div>
            ) : (
                <div className="flex justify-end">
                    <button className="flex flex-row items-center bg-gray-700 hover:bg-indigo-900 py-1.5 px-4 mr-2 rounded-2xl lowercase">
                        {!correctNetwork
                            ? <IoWarningOutline />
                            : networkId}
                        <IoIosArrowDown
                            className="ml-2 text-2xl"
                        />
                    </button>
                    <button
                        className="justify-self-end bg-gray-700 hover:bg-indigo-900 py-1.5 px-8 mr-8 rounded-2xl lowercase"
                        onClick={handleOpenWalletDetailsSidebar}
                    >
                        {wallet.substring(0, 6)}...{wallet.substring(38, 42)}

                    </button>
                    
                    {/* Wallet Side Bar Details */}
                    <WalletSideBarDetails isOpen={isWalletSidebarOpen} onClose={handleCloseWalletDetailsSidebar} />
                </div>
            )}
        </div>
    );
}

export default Header;