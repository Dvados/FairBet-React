import React from "react";

function SearchBar() {
    return (
        <div className="w-96">
            <div className="border-slate-400 border-2 relative flex items-center w-full h-8 rounded-xl bg-gray-800 overflow-hidden">
                <div className="grid place-items-center h-full w-10 text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <input
                    className="peer h-full w-full outline-none text-sm text-white bg-gray-800 p-2"
                    type="text"
                    id="search"
                    placeholder="Search"
                />
            </div>
        
        </div>
    );
}

export default SearchBar;