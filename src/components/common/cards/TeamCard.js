import React from "react";
import OddsButton from "../buttons/OddsButton";

const TeamCard = ({ logo, teamName, odds, onBetClick, setIsOpenBetslip }) => {
    
    return (
        <div className="w-52 flex flex-col items-center">
            {/* Team Logo */}
            <div div className="flex bg-gray-700 rounded-full items-center justify-center w-36 h-36" >
                <img src={logo} alt={teamName} className="size-32 object-cover p-4 justify-self-center" />
            </div >

            <div className="">
                {/* Team Name */}
                <div className="text-2xl text-gray-300 mt-2">
                    {teamName}
                </div>

                {/* Team Odds */}
                <OddsButton odds={odds} onClick={onBetClick} setIsOpenBetslip={setIsOpenBetslip} />
            </div>
        </div>
    );
}

export default TeamCard;