import React from "react";

import { useWallet } from "../../../wallet/UseWallet.js";

export default function WalletsList({ onClose }) {
  const { connectWallet } = useWallet();

  const handleClick = () => {
    connectWallet();
    onClose();
  }

  return (
    <div>
      <ul>
        <li
          className="flex flex-row items-start bg-gray-800 hover:bg-indigo-900 mx-4 mb-1 h-20 rounded-lg items-center pl-2 cursor-pointer"
          onClick={() => { connectWallet(); onClose(); }}
        >
          <div className="border-slate-700 bg-gray-700 rounded-lg border-2 flex items-center justify-center ml-2">
            <img
              alt={"Metamask"}
              src={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"
              }
              className="h-12"
            />
          </div>
          <p className="text-white text-lg ml-4">Metamask</p>
        </li>
      </ul>
    </div>
  );
}