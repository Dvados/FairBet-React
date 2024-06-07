import React from "react";

export default function Wallets({ walletName, walletLogo }) {
    return (
        <div className="flex flex-row items-start bg-gray-800 hover:bg-indigo-900 mx-4 mb-1 h-20 rounded-lg items-center pl-2 cursor-pointer">
            <div className="border-slate-700 bg-gray-700 rounded-lg border-2 flex items-center justify-center ml-2">
                <img src={walletLogo} alt={walletName} className="h-12" />
            </div>
            <p className="text-white text-lg ml-4">{walletName}</p>
        </div>
    );
}