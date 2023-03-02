import React from 'react';
import logo from './../../images/concordium.png';

const ConnectConcordium = ({ handleConnect }) => {
  return (
    <button
      className="btn btn-secondary bg-secondary fw-semibold text-white"
      onClick={handleConnect}
    >
      <img className="me-2" width={20} height={21} src={logo} alt="logo-concordium" />
      Connect to Concordium
    </button>
  );
};

export default ConnectConcordium;
