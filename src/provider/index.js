import React from 'react';
import { SSOButton } from 'aesirx-sso';
import queryString from 'query-string';
import { Buffer } from 'buffer';

const withHttp = (url) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url);

const ProviderLogin = () => {
  const onGetData = async (response) => {
    if (response.error) {
      notify(response.error_description, 'error');
    } else {
      if (response?.return) {
        const decoded = Buffer.from(response?.return, 'base64').toString();
        window.location.href = `${withHttp(decoded)}`;
      } else if (response?.recirect_uri) {
        window.location.href = `${withHttp(
          data?.result?.recirect_uri
        )}?state=sso&${queryString.stringify(data.result)}&lastVisitDate=0`;
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <>
      <SSOButton
        className="btn-primary btn w-100 fw-bold position-relative d-flex align-item-center justify-content-center my-3  px-6"
        text="AesirX SSO"
        onGetData={onGetData}
      />
    </>
  );
};

export default ProviderLogin;
