import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

import WalletsList from "./WalletsList";
import Settings from "./Settings";
import Details from "./Details";
import { useWallet } from "../../../wallet/UseWallet";

import { IoCloseSharp } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";

export default function WalletSideBar({ isOpen, onClose }) {
  const { wallet } = useWallet();

  // State to check if settings is open
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Function to disconnect wallet
  const { disconnectWallet } = useWallet();

  // State to show actions after clicking
  const [showActions, setShowActions] = useState(false);

  // Function to copy address to the clipboard
  const copyText = () => {
    navigator.clipboard.writeText(wallet);
    setShowActions(true);
    setTimeout(() => {
      setShowActions(false);
    }, 3000);
  };

  return (
    <main
      className={
        " fixed overflow-hidden z-10 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-200 opacity-0 duration-500 translate-x-full ")
      }
    >
      <section
        className={
          "w-1/4 m-3 rounded-xl max-w-lg right-0 absolute bg-gray-900 h-5/6 shadow-xl delay-400 duration-300 ease-in-out transition-all transform  "
        }
      >
        {!isSettingsOpen ? (
          <article className="relative w-full max-w-lg pb-10 flex flex-col">
            <div className="flex flex-row items-center">
              <button
                className="p-2 m-4 rounded-lg bg-gray-800 hover:bg-gray-800 cursor-pointer hover:bg-indigo-900"
                onClick={onClose}
              >
                <IoCloseSharp className="text-white text-3xl" />
              </button>

              {!wallet ? (
                <header className="p-4 font-bold text-white text-lg">
                  Connect a Wallet
                </header>
              ) : (

                // HEADER IF WALLET IS CONNECTED
                <header className="flex flex-row justify-between items-center p-4 font-bold text-white w-full">

                  {/* Wallet Details */}
                  <div className="flex flex-row items-center cursor-pointer"
                    onClick={copyText}
                  >
                    <h1 className="text-gray-100 hover:text-gray-400 text-lg">
                      {wallet.substring(0, 6)}...{wallet.substring(38, 42)}
                    </h1>
                    <button
                      className="ml-2 text-gray-300 hover:text-gray-400"
                    >
                      <MdContentCopy
                        className="text-2xl active:scale-1 hover:text-gray-200"
                      />

                      {/* Action after copying */}
                      {showActions && (
                        <span className="absolute top-16 right-32 bg-gray-600 text-gray-200 text-sm py-1 px-2 rounded animation-in-out">
                          Copied
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-end">
                    {/* Settings */}
                    <button
                      data-tooltip-id="openSettings"
                      data-tooltip-content="Settings"
                      onClick={() => setIsSettingsOpen(true)}
                    >
                      <FaGear
                        className="hover:bg-gray-600 text-5xl text-gray-200 hover:text-gray-200 rounded-full p-2 transform transition-transform duration-300 hover:rotate-180"
                      />
                      <Tooltip id="openSettings" />
                    </button>

                    {/* Disconnect Wallet */}
                    <button
                      onClick={() => {
                        disconnectWallet();
                        onClose();
                      }}
                      data-tooltip-id="disconnectWallet"
                      data-tooltip-content="Disconnect Wallet"
                    >
                      <FaPowerOff
                        className="hover:bg-gray-600 text-5xl text-gray-200 hover:text-gray-200 rounded-full p-2 transform transition-transform duration-300 hover:rotate-180"
                      />
                      <Tooltip id="disconnectWallet" />
                    </button>
                  </div>
                </header>
              )}
            </div>

            {/* Check if wallet is connected */}
            {!wallet
              ? <WalletsList onClose={onClose} />
              : <Details />
            }
          </article>
        ) : (
          <Settings
            onClose={onClose}
            setIsSettingsOpen={setIsSettingsOpen}
          />
        )}
      </section>

      <section className="w-screen h-full cursor-pointer "></section>
    </main>
  );
}