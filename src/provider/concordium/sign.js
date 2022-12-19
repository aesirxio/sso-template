import React, { useState } from "react";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import logo from "./../../images/concordium.png";

const SignMessageConcordium = ({ accountAddress }) => {
  const [data, setData] = useState();

  const handleConnect = async () => {
    const provider = await detectConcordiumProvider();
    const signature = await provider.signMessage(
      accountAddress,
      "This is a message to be signed"
    );

    if (signature[0]) {
      setData(signature[0][0]);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handleConnect}>
        <img width={40} src={logo} alt="logo-concordium" />
        Login via Concordium
      </button>

      {data && (
        <div>
          <div>Recovered Address: {accountAddress}</div>
          <div>Signature: {data}</div>
        </div>
      )}
    </>
  );
};

export default SignMessageConcordium;
