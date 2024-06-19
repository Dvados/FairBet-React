import React from 'react'

import { FaArrowLeft } from "react-icons/fa";

export default function Settings({ setIsSettingsOpen }) {
    return (
        <div className="flex flex-row items-center">
            <button
                className="p-2 m-4 rounded-lg bg-gray-800 hover:bg-gray-800 cursor-pointer hover:bg-indigo-900"
                onClick={() => setIsSettingsOpen(false)}
            >
                <FaArrowLeft className="text-white text-3xl" />
            </button>

            <h1>Settings</h1>
        </div>
    )
}
