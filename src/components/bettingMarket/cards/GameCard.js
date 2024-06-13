import React from "react";
import TeamCard from "./TeamCard";
import MiddleCard from "./MiddleContainer";
// import BetDetails from "../../side-pannels-drawers/BetslipContainer";

const GameCard = ({ id, teamName1, teamName2, score, date, time, teamOdds1, teamOdds2, drawOdds, isLive, logoTeam1, logoTeam2, onBetClick }) => {

    return (
        <div className="flex relative justify-center my-4 flex-col">
            <div className="flex items-end justify-between mx-auto bg-gray-600 p-8 rounded-2xl shadow-2xl">

                {isLive && (
                    <div className="absolute top-4 text-sm text-white bg-red-700 px-8 py-2 rounded-2xl live-button">
                        Live
                    </div>
                )}

                {/* Left Container */}
                <TeamCard
                    logo={logoTeam1}
                    teamName={teamName1}
                    odds={teamOdds1}
                    onBetClick={() => onBetClick(`${teamName1}`, teamName1, teamName2, score, date, time, `${teamOdds1}`, teamOdds2, drawOdds, teamOdds1)}    
                    // isOpenBetslip={isOpenBetslip}
                    // setIsOpenBetslip={setIsOpenBetslip}
                />

                {/* Middle Container */}
                <MiddleCard
                    score={score}
                    date={date}
                    time={time}
                    odds={drawOdds}
                    onBetClick={() => onBetClick("Draw", teamName1, teamName2, score, date, time, teamOdds1, teamOdds2, `${drawOdds}`, drawOdds)}
                    // isOpenBetslip={isOpenBetslip}
                    // setIsOpenBetslip={setIsOpenBetslip}
                />


                {/* Right Container */}
                <TeamCard
                    logo={logoTeam2}
                    teamName={teamName2}
                    odds={teamOdds2}
                    onBetClick={() => onBetClick(`${teamName2}`, teamName1, teamName2, score, date, time, teamOdds1, `${teamOdds2}`, drawOdds, teamOdds2)}
                    // isOpenBetslip={isOpenBetslip}
                    // setIsOpenBetslip={setIsOpenBetslip}
                />
            </div>

            {/* {selectedBet && (
                <div>
                    <p>You choosed bet on: {selectedBet}</p>
                    <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="p-2 m-2 border rounded-md"
                    />
                </div>
            )} */}

            {/* {isOpenBetslip && (
                <BetDetails
                    selectedBet={selectedBet}
                    betAmount={betAmount}
                    setBetAmount={setBetAmount}
                    teamName1={teamName1}
                    teamName2={teamName2}
                    score={score}
                    date={date}
                    time={time}
                    teamOdds1={teamOdds1}
                    teamOdds2={teamOdds2}
                    drawOdds={drawOdds}
                    onClose={handleCloseBetslip}
                />
            )} */}
        </div>
    );
}

export default GameCard;