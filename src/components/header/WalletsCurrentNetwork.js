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
      <button className="flex flex-row items-center bg-gray-700 hover:bg-indigo-900 py-1.5 px-4 mr-2 rounded-2xl lowercase">
        {!correctNetwork ? (
          <IoWarningOutline
            className="text-2xl"
            title="Your wallet`s current network is unsupported."
          />
        ) : networkId == 1 ? (
          <div title="Custom tooltip text" data-tip data-for="ethTooltip">
            <img src={ethLogo} className="h-6" alt="Ethereum Logo"></img>
            <Tooltip id="ethTooltip" place="top" effect="solid">
              Custom tooltip text
            </Tooltip>
          </div>
        ) : networkId == 11155111 ? (
          <div title="Custom tooltip text">
            <img src={ethLogo} className="h-6" alt={ethLogo}></img>
          </div>
        ) : null}

        <IoIosArrowDown className="ml-2 text-xl" />
      </button>
    </div>
  );
}