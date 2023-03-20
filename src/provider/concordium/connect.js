import { BROWSER_WALLET, WALLET_CONNECT } from '../config';
import React from 'react';
import logo from './../../images/concordium.png';
import { isMobile, isBrowser, OsTypes, osName } from 'react-device-detect';

const ConnectConcordium = ({
  isConnecting,
  handleOnConnect,
  activeConnectorError,
  activeConnectorType,
  activeConnector,
}) => {
  console.log('isConnecting', isConnecting);
  return (
    <>
      {osName === OsTypes.IOS && isMobile ? (
        <></>
      ) : (
        <div className="p-2 bg-white border fw-semibold text-center rounded-2">
          <div className="pb-2">Connect to Concordium</div>
          <div className="d-flex">
            {isBrowser && (
              <button
                className="btn btn-secondary bg-secondary text-white me-1"
                onClick={() => handleOnConnect(BROWSER_WALLET)}
              >
                {isConnecting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>{' '}
                    Connecting
                  </>
                ) : (
                  <>
                    <img className="me-2" width={20} height={21} src={logo} alt="logo-concordium" />
                    Browser Wallet
                  </>
                )}
              </button>
            )}
            <button
              className="btn btn-secondary bg-secondary text-white ms-1"
              onClick={() => handleOnConnect(WALLET_CONNECT)}
            >
              {isMobile && (
                <img className="me-2" width={20} height={21} src={logo} alt="logo-concordium" />
              )}
              {!activeConnectorError && activeConnectorType && !activeConnector ? (
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : isMobile ? (
                'Connect'
              ) : (
                'QR Code'
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectConcordium;
