import React, { useState } from "react";
import GameCard from "../common/cards/GameCard";
import WalletConnectionDrawer from "../side-pannels-drawers/WalletConnection";
import Wallet from "../buttons/Wallet";
import BetDetailsDrawer from "../side-pannels-drawers/BetslipContainer";

import RealMadridLogo from "../../assets/img/real-madrid-logo.png";
import FCBarcelonaLogo from "../../assets/img/fc-barcelona-logo.png";
import BayernLogo from "../../assets/img/fc-bayern-munich-logo.png";
import StuttgartLogo from "../../assets/img/fc-stuttgart-logo.png";

import { GiSoccerBall } from "react-icons/gi";

function FootballLayout({ isOpenWallet, setIsOpenWallet }) {
    const [isBetDetailsOpen, setIsBetDetailsOpen] = useState(false);
    const [selectedBet, setSelectedBet] = useState(null);
    const [selectedOdd, setSelectedOdd] = useState(null);
    const [betDetails, setBetDetails] = useState(false);
    const [betAmount, setBetAmount] = useState("");

    const handleBetClick = (betType, teamName1, teamName2, score, date, time, teamOdds1, teamOdds2, drawOdds, oddType) => {
        setSelectedBet(betType);
        setSelectedOdd(oddType);
        setBetDetails({ teamName1, teamName2, score, date, time, teamOdds1, teamOdds2, drawOdds });
        setIsBetDetailsOpen(true);
    };

    const handleCloseBetDetails = () => {
        setIsBetDetailsOpen(false);
        setSelectedBet(null);
        setSelectedOdd(null);
        setBetDetails({});
        setBetAmount("");
    };
    return (
        <div className={`min-h-screen bg-gray-800 pt-8 pb-12 transition-all ${isBetDetailsOpen ? 'pr-1/3' : ''}`}>

            {/* Sport Category */}
            <div className="flex justify-center">
                <GiSoccerBall className="text-gray-200 text-4xl mr-2" />
                <p className="text-3xl font-bold text-gray-200 tracking-wide uppercase">
                    Football
                </p>
            </div>

            {/* Game Cards */}
            <div className="flex flex-col justify-center mt-8">
                <GameCard
                    id='game1'
                    logoTeam1={RealMadridLogo}
                    logoTeam2={FCBarcelonaLogo}
                    teamName1="Real Madrid"
                    teamName2="FC Barcelona"
                    score="2 - 1"
                    date="Live Now"
                    time="11:30"
                    teamOdds1="2.25"
                    teamOdds2="2.15"
                    drawOdds="0.12"
                    isLive={true}
                    onBetClick={handleBetClick}
                />
                <GameCard
                    id='game2'
                    logoTeam1={BayernLogo}
                    logoTeam2={StuttgartLogo}
                    teamName1="FC Bayern Munich"
                    teamName2="Stuttgart"
                    score="0 - 0"
                    date="Oct 10"
                    time="14:30"
                    teamOdds1="5.25"
                    teamOdds2="4.15"
                    drawOdds="1.12"
                    isLive={false}
                    onBetClick={handleBetClick}
                />
            </div>

            {/* Wallet Drawer */}
            <WalletConnectionDrawer isOpenWallet={isOpenWallet} setIsOpenWallet={setIsOpenWallet}>
                <div className="rounded-2xl">
                    <Wallet
                        walletName="Metamask"
                        walletLogo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"
                    />
                    {/* <Wallet
                        walletName="Metamask"
                        walletLogo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"
                    /> */}
                </div>
            </WalletConnectionDrawer>

            {/* Betslip Drawer */}
            <BetDetailsDrawer
                isOpenBetslip={isBetDetailsOpen}
                selectedBet={selectedBet}
                selectedOdd={selectedOdd}
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                {...betDetails}
                onClose={handleCloseBetDetails}
            />
        </div>
    );
}

export default FootballLayout;