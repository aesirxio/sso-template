import React from "react";
import logo from "./../../images/concordium.png";

const ConnectConcordium = ({ handleConnect }) => {
  return (
    <div>
      <button className="btn btn-blue" onClick={handleConnect}>
        <img width={20} height={21} src={logo} alt="logo-concordium" />
        Connect to Concordium
      </button>
    </div>
  );
};

export default ConnectConcordium;
