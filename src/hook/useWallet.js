import BaseRoute from 'aesirx-dma-lib/src/Abstract/BaseRoute';
import { toast } from 'react-toastify';
import axios from 'axios';
import queryString from 'query-string';

const withHttp = (url) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url);

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
          webserviceClient: 'site',
          webserviceVersion: '1.0.0',
          option: 'member',
          task: 'getWalletNonce',
          api: 'hal',
        },
        false,
        urlPOST
      );

      const config = {
        method: 'post',
        url: POST_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: reqAuthFormData,
      };
      const { data } = await axios(config);

      if (data.result) {
        return data.result;
      }
      throw false;
    } catch (error) {
      toast('Your wallet is not connected any AesirX account.');
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
          webserviceClient: 'site',
          webserviceVersion: '1.0.0',
          option: 'member',
          task: 'walletLogin',
          api: 'hal',
        },
        false,
        urlPOST
      );

      const config = {
        method: 'post',
        url: POST_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: reqAuthFormData,
      };

      let searchParams = new URLSearchParams(window.location.search);

      const { data } = await axios(config);
      if (data?.result) {
        if (window.opener != null) {
          window.opener.postMessage({ walletResponse: queryString.stringify(data.result) }, '*');
        } else if (searchParams.has('return')) {
          const decoded = atob(searchParams.get('return'));
          window.location.href = `${withHttp(decoded)}`;
        } else {
          if (data?.result?.recirect_uri) {
            window.location.href = `${withHttp(
              data?.result?.recirect_uri
            )}?state=sso&${queryString.stringify(data.result)}&lastVisitDate=0`;
          } else {
            throw false;
          }
        }
      } else {
        throw false;
      }
    } catch (error) {
      toast('Your wallet is not registered');
      return false;
    }
  };

  return { getWalletNonce, verifySignature };
};

export default useWallet;
