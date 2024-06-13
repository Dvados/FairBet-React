import React from "react";
import OddsButton from "../buttons/OddsButton";

const MiddleCard = ({ date, time, score, odds, onBetClick, setIsOpenBetslip }) => {
    return (
        <div className="flex flex-col justify-center text-white w-44">

            {/* Upper Text */}
            <div className="flex flex-col mb-8">
                <div className="mb-2">
                    <p className="text-4xl font-bold">{score}</p>
                </div>
                <div>
                    <p className="text-xl uppercase text-gray-300">{date}</p>
                </div>
                <div>
                    <p className="text-xl text-gray-400">{time}</p>
                </div>
            </div>

            <div>
                {/* Draw Text */}
                <div className="text-2xl text-gray-300 mt-2">
                    Draw
                </div>
                
                {/* Draw Button */}
                {/* <OddsButton odds={odds} onClick={onBetClick} /> */}
                <OddsButton odds={odds} onClick={onBetClick} setIsOpenBetslip={setIsOpenBetslip} />
                {/* <button className="text-md font-bold text-gray-300 mt-4 bg-gray-900 p-2 rounded-md">
                    <p className="text-blue-400">{odds}</p>
                </button> */}
            </div>
        </div>
    );
}

export default MiddleCard;