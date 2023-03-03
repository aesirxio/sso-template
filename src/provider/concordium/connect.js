import { BROWSER_WALLET, WALLET_CONNECT } from '../config';
import React from 'react';
import logo from './../../images/concordium.png';

const ConnectConcordium = ({ handleOnConnect }) => {
  return (
    <div className="p-2 bg-white border fw-semibold text-center">
      <div className="pb-2">Connect to Concordium</div>
      <div className="d-flex">
        <button
          className="btn btn-secondary bg-secondary text-white me-1"
          onClick={() => handleOnConnect(BROWSER_WALLET)}
        >
          <img className="me-2" width={20} height={21} src={logo} alt="logo-concordium" />
          Browser Wallet
        </button>
        <button
          className="btn btn-secondary bg-secondary text-white ms-1"
          onClick={() => handleOnConnect(WALLET_CONNECT)}
        >
          QR Code
        </button>
      </div>
    </div>
  );
};

export default ConnectConcordium;
