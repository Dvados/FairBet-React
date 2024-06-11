import React from "react";

const WaitingForTransactionMessage = ({ txHash }) => {
  return (
    <div>
      Waiting for transaction <strong>{txHash}</strong>
    </div>
  );
};

export default WaitingForTransactionMessage;