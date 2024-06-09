import React, { useState } from "react";
import Header from "../../components/common/header";
import Footer from "../../components/common/footer";
import FootballLayout from "../../components/layout/FootballLayout";
import '../../index.css';

function Main({ connectWallet, connected, accountAddress }) {
    // const [isOpenWallet, setIsOpenWallet] = useState(false);

    return (
        <div className="">
            <Header connectWallet={connectWallet} connected={connected} accountAddress={accountAddress} />
            <FootballLayout 
                // isOpenWallet={isOpenWallet} 
                // setIsOpenWallet={setIsOpenWallet}
                // isOpenBetslip={isOpenBetslip}
                // setIsOpenBetslip={setIsOpenBetslip}
            />
            <Footer />
        </div>
    );
}

export default Main;