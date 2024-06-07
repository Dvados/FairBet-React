import React from "react";
import '../../index.css';
import '../../styles/fonsts.css';
import SearchBar from '../../components/common/search-bar/searchBar.js';
import ConnectButtonDrawer from '../../components/buttons/ConnectButtonDrawer.js';

function Header({ setIsOpenWallet }) {
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
            <ConnectButtonDrawer setIsOpenWallet={setIsOpenWallet} />
        </div>
    );
}

export default Header;