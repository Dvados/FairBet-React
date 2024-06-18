import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'

import { useWallet } from "../../wallet/UseWallet.js";

import { IoIosArrowDown } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

import ethLogo from "../../assets/img/ethereum-logo.png";

export default function WalletsCurrentNetwork() {
  const { networkId, correctNetwork } = useWallet();

  // Toggle state and function for arrow icon
  const [isOpenNetworkList, setIsOpenNetworkList] = useState(false);

  const toggleMenu = () => {
    setIsOpenNetworkList(!isOpenNetworkList);
  };

  return (
    <Menu as="div" className="relative">

      {/* Current Network Icon + Change Network Button */}
      <MenuButton
        className="flex flex-row items-center bg-gray-700 hover:bg-indigo-900 active:bg-indigo-500 active:scale-110 transition ease-in-out duration-300 py-1.5 px-4 mr-2 rounded-2xl transition-all duration-300"
        onClick={toggleMenu}
      >
        {!correctNetwork ? (
          <div>
            <IoWarningOutline
              className="text-2xl"
              data-tooltip-id="uncorrectNetwork"
              data-tooltip-content="Your wallet`s current network is unsupported."
            />
            <Tooltip id="uncorrectNetwork" className="text-2xl mt-6" />
          </div>
        ) : networkId === 1 ? (
          <div
            data-tooltip-id="ethTooltip"
            data-tooltip-content="Ethereum Mainnet"
          >
            <img src={ethLogo} className="h-6" alt="Ethereum Logo"></img>
            <Tooltip id="ethTooltip" className="text-2xl mt-6" />
          </div>
        ) : networkId === 11155111 ? (
          <div
            data-tooltip-id="sepoliaTooltip"
            data-tooltip-content="Sepolia Testnet"
          >
            <img src={ethLogo} className="h-6" alt="Sepolia"></img>
            <Tooltip id="sepoliaTooltip" className="text-2xl mt-6" />
          </div>
        ) : null}

        <IoIosArrowDown
          className={`ml-2 text-xl transition-transform duration-300 ${isOpenNetworkList ? 'rotate-180' : 'rotate-0'}`}
        />

      </MenuButton>

      {/* Network List */}
      <Transition
        show={isOpenNetworkList}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute origin-top bg-gray-900 rounded-xl mt-6 right-0 p-3 w-72 text-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <MenuItem
            onClick={() => {
              window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x1" }] });
            }}
          >
            <div className="flex flex-row items-center text-gray-300 block p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
              <div className="bg-gray-700 p-2 rounded-lg">
                <img src={ethLogo} className="h-6" alt="Ethereum Logo"></img>
              </div>
              <span className="ml-4">Ethereum Mainnet</span>

              {/* Checkmark of selected network */}
              {networkId === 1
                ? <div className="ml-auto">
                    <FaCheck className="text-gray-300" />
                  </div>
                : null}
            </div>
          </MenuItem>

          <MenuItem
            onClick={() => {
              window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0xaa36a7" }] });
            }}
          >
            <div className="flex flex-row items-center text-gray-300 block p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
              <div className="bg-gray-700 p-2 rounded-lg">
                <img src={ethLogo} className="h-6" alt="Ethereum Logo"></img>
              </div>
              <span className="ml-4">Sepolia Testnet</span>

              {/* Checkmark of selected network */}
              {networkId === 11155111
                ? <div className="ml-auto">
                    <FaCheck className="text-gray-300" />
                  </div>
                : null}
            </div>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}