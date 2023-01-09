import BaseRoute from "aesirx-dma-lib/src/Abstract/BaseRoute";
import { toast } from "react-toastify";
import axios from "axios";
import queryString from "query-string";

const useWallet = (wallet, publicAddress) => {
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

      if (data.result) {
        return data.result;
      }
      throw false;
    } catch (error) {
      toast("Your wallet is not connected any AesirX account.");
      return false;
    }
  };

  const verifySignature = async (wallet, publicAddress, signature) => {
    try {
      const urlPOST = window.location.origin;
      const reqAuthFormData = {
        wallet: wallet,
        publicAddress: publicAddress,
        signature: signature,
      };

      const POST_URL = BaseRoute.__createRequestURL(
        {
          webserviceClient: "site",
          webserviceVersion: "1.0.0",
          option: "member",
          task: "walletLogin",
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

      if (data?.result?.recirect_uri) {
        if (window.opener != null && !window.opener.closed) {
          var walletResponse =
            window.opener.document.getElementById("walletResponse");
          if (walletResponse) {
            walletResponse.value = queryString.stringify(data.result);
          }
        }
      } else {
        throw false;
      }
    } catch (error) {
      toast("Your wallet is not registered");
      return false;
    }
  };

  return { getWalletNonce, verifySignature };
};

export default useWallet;
