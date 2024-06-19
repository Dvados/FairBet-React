import React, { useState, useCallback } from "react";

import { useWallet } from "../../wallet/UseWallet.js";
import SearchBar from "./search-bar/searchBar.js";
import WalletSideBar from "./walletSideBar/WalletSideBar.js";
import WalletsCurrentNetwork from "./WalletCurrentNetwork.js";

import "../../index.css";
import "../../styles/fonsts.css";

function Header() {
  const [isWalletSidebarOpen, setWalletSidebarOpen] = useState(false);

  const { wallet } = useWallet();

  const handleOpenWalletSidebar = useCallback(() => {
    setWalletSidebarOpen(true);
  }, []);

  const handleCloseWalletSidebar = useCallback(() => {
    setWalletSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-16 items-center text-white bg-gray-800 header z-50">
      {/* Logo */}
      <div className="ml-8 logo-main hover:scale-110 transition ease-in-out duration-300">
        <a
          // temporary href to prevent conflicts while compile
          href="../../pages/main/Main.js"
          className="text-3xl"
          target="_blank"
          rel="noopener noreferrer"
        >
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
            className="justify-self-end bg-gray-700 hover:bg-indigo-900 active:bg-indigo-500 active:scale-110 transition ease-in-out duration-300 py-1.5 px-12 mr-8 rounded-2xl lowercase"
          >
            Connect
          </button>
          <WalletSideBar
            isOpen={isWalletSidebarOpen}
            onClose={handleCloseWalletSidebar}
          />
        </div>
      ) : (
        <div className="flex justify-end">
          <WalletsCurrentNetwork />
          <button
            className="justify-self-end bg-gray-700 hover:bg-indigo-900 active:bg-indigo-500 active:scale-110 transition ease-in-out duration-300 py-1.5 px-8 mr-8 rounded-2xl lowercase"
            onClick={handleOpenWalletSidebar}
          >
            {wallet.substring(0, 6)}...{wallet.substring(38, 42)}
          </button>
          <WalletSideBar
            isOpen={isWalletSidebarOpen}
            onClose={handleCloseWalletSidebar}
          />
        </div>
      )}
    </div>
  );
}

export default Header;