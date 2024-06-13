import React, { useState } from "react";

import Header from "../../components/common/header";
import Footer from "../../components/common/footer";
// import FootballLayout from "../../components/layout/FootballLayout";
import BettingMarket from "../../test/FootballLayout test";

import "../../index.css";

function Main({}) {
  return (
    <div className="">
      <Header />
      <BettingMarket />
      <Footer />
    </div>
  );
}

export default Main;