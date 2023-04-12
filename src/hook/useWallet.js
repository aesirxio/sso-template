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
      toast(
        <>
          <p className="mb-1">Your wallet is not connected any AesirX account.</p>
          <p className="mb-1">
            Please register and connect{' '}
            <a href="https://aesirx.io/" target="_blank">
              here
            </a>
          </p>
        </>,
        { closeOnClick: false }
      );
      return false;
    }
  };

  const verifySignature = async (wallet, publicAddress, signature) => {
    try {
      const urlPOST = window.location.origin;
      const returnParams = document.querySelector('.login form input[name="return"]')?.value;
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
          return: returnParams ?? null,
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
      if (data?.result) {
        if (window.opener != null) {
          window.opener.postMessage(
            { walletResponse: queryString.stringify(data.result) },
            window.opener.origin
          );
        } else if (data?.result?.return) {
          const decoded = atob(data?.result?.return);
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
      toast(
        <>
          <p className="mb-1">Your wallet is not registered.</p>
          <p className="mb-1">
            Please register{' '}
            <a href="https://aesirx.io/" target="_blank">
              here
            </a>
          </p>
        </>,
        { closeOnClick: false }
      );
      return false;
    }
  };

  return { getWalletNonce, verifySignature };
};

export default useWallet;
