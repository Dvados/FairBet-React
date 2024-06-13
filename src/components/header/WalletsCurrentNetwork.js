import React from "react";
import { Tooltip } from "react-tooltip";

import { useWallet } from "../../wallet/UseWallet.js";

import { IoIosArrowDown } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import ethLogo from "../../assets/img/ethereum-logo.png";

export default function WalletsCurrentNetwork() {
  const { networkId, correctNetwork } = useWallet();

  return (
    <div>
      <button className="flex flex-row items-center bg-gray-700 hover:bg-indigo-900 py-1.5 px-4 mr-2 rounded-2xl">
        {!correctNetwork ? (
          <div>
            <IoWarningOutline
              className="text-2xl"
              data-tooltip-id="uncorrectNetwork" 
              data-tooltip-content="Your wallet`s current network is unsupported."
            />
            <Tooltip id="uncorrectNetwork" className="text-2xl mt-6"/>
          </div>
        ) : networkId == 1 ? (
          <div data-tooltip-id="ethTooltip" data-tooltip-content="Ethereum Mainnet">
            <img src={ethLogo} className="h-6" alt="Ethereum Logo"></img>
            <Tooltip id="ethTooltip" className="text-2xl mt-6"/>
          </div>
        ) : networkId == 11155111 ? (
          <div data-tooltip-id="sepoliaTooltip" data-tooltip-content="Sepolia Testnet">
            <img src={ethLogo} className="h-6" alt="Sepolia"></img>
            <Tooltip id="sepoliaTooltip" className="text-2xl mt-6"/>
          </div>
        ) : null}

        <IoIosArrowDown className="ml-2 text-xl" />
      </button>
    </div>
  );
}