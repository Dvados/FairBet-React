import React from "react";

const TransactionErrorMessage = ({ message, dismiss }) => {
  return (
    <div>
      TX error: {message}
      <button type="button" onClick={dismiss}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default TransactionErrorMessage;