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

      // Get member
      const getUser = BaseRoute.__createRequestURL(
        {
          webserviceClient: "site",
          webserviceVersion: "1.0.0",
          option: "persona",
          task: "getTokenByUser",
          api: "hal",
          access_token: data?.result?.access_token,
        },
        false,
        urlPOST
      );

      const response = await axios({
        method: "get",
        url: getUser,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("122", response?.data?.result?.member_id);

      if (response?.data?.result?.member_id) {
        // Get profile
        const getProfile = BaseRoute.__createRequestURL(
          {
            webserviceClient: "site",
            webserviceVersion: "1.0.0",
            option: "member",
            api: "hal",
            id: response?.data?.result?.member_id,
            access_token: data?.result?.access_token,
          },
          false,
          urlPOST
        );

        const responseProfile = await axios({
          method: "get",
          url: getProfile,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (responseProfile?.data?.licenses) {
          const sso = responseProfile?.data?.licenses.find(
            (e) => e.subscription[0]?.product === "product-aesirx-sso"
          );
          console.log("sso", sso.data.domain);

          window.location.href = `http://${
            sso.data.domain
          }?state=sso&${queryString.stringify(data.result)}`;
        }
      }
    } catch (error) {
      toast("Your wallet is not registered");
      return false;
    }
  };

  return { getWalletNonce, verifySignature };
};

export default useWallet;
