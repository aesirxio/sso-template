import React, { useRef } from "react";
import { useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";
import BaseRoute from "aesirx-dma-lib/src/Abstract/BaseRoute";
import qs from "query-string";
import axios from "axios";

const SignMessage = () => {
  const recoveredAddress = useRef();

  const { data, error, isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
      // POST API after sign in
      try {
        const urlPOST = window.location.origin;
        const reqAuthFormData = {
          recovered_address: recoveredAddress.current,
          signature: data,
        };
        const POST_URL = BaseRoute.__createRequestURL(
          {
            option: "metamask",
          },
          false,
          urlPOST
        );
        const config = {
          method: "post",
          url: POST_URL,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify(reqAuthFormData),
        };
        const { response } = await axios(config);
      } catch (error) {
        return false;
      }
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
