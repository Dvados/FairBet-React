import React from "react";

export default function ConnectButtonDrawer({ setIsOpenWallet }) {
    return (
        <div>
            <button onClick={() => setIsOpenWallet(true)} className="justify-self-end bg-gray-700 hover:bg-indigo-900 py-1.5 px-12 mr-8 rounded-2xl lowercase">
                Connect
            </button>
        </div>
    );
}