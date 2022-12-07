import React, { useRef } from "react";
import { useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";

const SignMessage = () => {
  const recoveredAddress = useRef();

  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
    },
  });

  const handleSignMessage = () => {
    signMessage({ message: "Sign" });
  };

  return (
    <>
      <button
        disabled={isLoading}
        className="btn btn-primary"
        onClick={handleSignMessage}
      >
        {isLoading ? "Check Wallet" : "Sign Message"}
      </button>

      {data && (
        <div>
          <div>Recovered Address: {recoveredAddress.current}</div>
          <div>Signature: {data}</div>
        </div>
      )}

      {error && <div>{error.message}</div>}
    </>
  );
};

export default SignMessage;
