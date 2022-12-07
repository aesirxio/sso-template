import React from "react";

import { useSignMessage } from "wagmi";

const Metamask = () => {
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: "Sign in to AesirX",
  });

  return (
    <div>
      <button
        className="btn btn-primary"
        disabled={isLoading}
        onClick={() => signMessage()}
      >
        Sign in via MetaMask
      </button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  );
};

export default Metamask;
