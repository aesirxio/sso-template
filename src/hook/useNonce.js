import BaseRoute from "aesirx-dma-lib/src/Abstract/BaseRoute";

import axios from "axios";

const useNonce = (wallet, publicAddress) => {
  const getWalletNonce = async () => {
    try {
      const urlPOST = window.location.origin;
      const reqAuthFormData = {
        publicAddress: publicAddress,
        wallet: wallet,
      };

      const POST_URL = BaseRoute.__createRequestURL(
        {
          webserviceClient: "site",
          webserviceVersion: "1.0.0",
          option: "member",
          task: "getWalletNonce",
          api: "hal",
        },
        false,
        urlPOST
      );

      const config = {
        method: "post",
        url: POST_URL,
        headers: {
          "Content-Type": "application/json",
        },
        data: reqAuthFormData,
      };
      const { data } = await axios(config);

      return data.result;
    } catch (error) {
      return false;
    }
  };

  const verifySignature = async (publicAddress, signature) => {
    console.log(publicAddress, signature);
    // Redirect
    return true;
  };

  return { getWalletNonce, verifySignature };
};

export default useNonce;
