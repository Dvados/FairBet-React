import React, { useState } from "react";
import Header from "../../components/common/header";
import Footer from "../../components/common/footer";
import FootballLayout from "../../components/layout/FootballLayout";
import '../../index.css';

function Main({}) {
    return (
        <div className="">
            <Header/>
            <FootballLayout/>
            <Footer/>
        </div>
    );
}

export default Main;