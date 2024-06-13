import React, { useState, useEffect } from 'react';

import { IoReceiptSharp, IoCloseSharp } from "react-icons/io5";
import { FaEthereum } from "react-icons/fa";

const BetDetailsDrawer = ({
    isOpenBetslip,
    selectedBet,
    selectedOdd,
    betAmount,
    setBetAmount,
    teamName1,
    teamName2,
    score,
    date,
    time,
    teamOdds1,
    teamOdds2,
    drawOdds,
    onClose
}) => {
    const [isInitialRender, setIsInitialRender] = useState(true);

    // Set individual value for betAmount if it's empty
    useEffect(() => {
        if (isInitialRender && betAmount === '') {
            setBetAmount("0.000001");
            setIsInitialRender(false);
        }
    }, [betAmount, isInitialRender, setBetAmount]);

    return (
        <div
            className={`fixed top-16 right-0 h-full bg-gray-900 shadow-lg transition-transform transform ${isOpenBetslip ? 'translate-x-0' : 'translate-x-full'} w-1/3`}
        >
            {/* Bet Details Container */}
            <div className="flex flex-col h-full">

                <div className="flex-grow flex flex-col">
                    {/* Bet Details Heading */}
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center">
                            <IoReceiptSharp className="items-center text-gray-300 text-2xl m-4" />
                            <h2 className="text-xl font-bold text-gray-300 p-4">Bet Details</h2>
                        </div>
                        <button onClick={onClose} className="text-white w-1/5 m-4 bg-gray-700 hover:bg-indigo-900 p-2 rounded-3xl">Close</button>
                    </div>

                    <hr className="mx-4 border-gray-700"></hr>

                    {/* Bet Details Heading lower content */}
                    <div className="flex flex-row justify-between items-center mx-4">
                        <h2 className="text-lg text-gray-300">Some Text</h2>
                        <button className="text-gray-400 hover:text-white p-4">Clear All</button>
                    </div>

                    {/* Bet Details Main Container */}
                    <div className="bg-gray-800 mx-4 shadow-2xl border-2 border-gray-700 rounded-md">

                        {/* Heading */}
                        <div className="flex flex-row justify-between p-4 bg-gray-700">
                            <h2 className='text-left text-lg font-bold text-gray-300'>{teamName1} / {teamName2}</h2>
                            <IoCloseSharp className="text-gray-300 text-3xl cursor-pointer" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col p-4">
                            <div>
                                {selectedBet && (
                                    <>
                                        <div className="py-2 flex flex-row justify-between">
                                            <h2 className='text-left text-lg text-gray-300'>{selectedBet}</h2>
                                            {selectedOdd && (
                                                <>
                                                    <h2 className='text-left text-lg text-blue-400'>{selectedOdd}</h2>
                                                </>
                                            )}
                                        </div>

                                        {/* Input Bet Amount */}
                                        <div className="flex flex-row justify-between items-center">
                                            <div className="flex flex-row items-center">
                                                <input
                                                    type="number"
                                                    value={betAmount}
                                                    onChange={(e) => setBetAmount(e.target.value)}
                                                    placeholder={0.000001}
                                                    step={0.000001}
                                                    min={0}
                                                    className="p-2 h-10 border rounded-md w-3/4"
                                                />
                                                <FaEthereum className="items-center text-gray-300 text-3xl m-2" />
                                            </div>
                                            <div className="flex flex-col text-gray-300 text-right text-lg">

                                                {/* Est. Payout */}
                                                <p>Est. Payout</p>

                                                {/* Commission for transaction */}
                                                <p>{(Number(betAmount) * 0.015).toFixed(8)}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="sticky bottom-0">
                    <div className="flex flex-col">
                        {/* Total Container */}
                        <div className="flex flex-col bottom-0">
                            <hr className="mx-4 mb-4 border-gray-700"></hr>

                            {/* Total */}
                            <div className="flex flex-row justify-between items-center mx-4">
                                <h2 className='text-left text-xl text-gray-300'>Total:</h2>
                                <h2 className='text-left text-xl text-gray-300'>{betAmount}</h2>
                            </div>

                            {/* Est. Payput */}
                            <div className="flex flex-row justify-between items-center mx-4">
                                <h2 className='text-left text-xl text-gray-300'>Est. Payout:</h2>
                                <h2 className='text-left text-xl text-gray-300'>{(Number(betAmount) * 0.015).toFixed(8)}</h2>
                            </div>

                            {/* Place Bet Button */}
                            <button className="text-white w-1/1 m-4 bg-indigo-900 hover:bg-indigo-700 p-2 rounded-md">Place Bet</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BetDetailsDrawer;

