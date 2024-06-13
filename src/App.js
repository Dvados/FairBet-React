import React, { useEffect, useState } from "react";

import Main from "./pages/main/Main";
import { WalletProvider } from "./wallet/WalletContext";

const App = () => {
  return (
    <div className="App">
      <WalletProvider>
        <Main />
      </WalletProvider>
    </div>
  );
};

export default App;