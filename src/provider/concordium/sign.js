import React, { useState } from 'react';
import logo from './../../images/concordium.png';
import useWallet from '../../hook/useWallet';

const SignMessageConcordium = ({ account, connection }) => {
  const [loading, setLoading] = useState(false);
  const wallet = 'concordium';

  const { getWalletNonce, verifySignature } = useWallet(wallet, account);

  const handleConnect = async () => {
    setLoading(true);
    const nonce = await getWalletNonce();
    if (nonce) {
      console.log(account, `${nonce}`);
      const signature = await connection.signMessage(account, `${nonce}`);

      if (signature) {
        await verifySignature(wallet, account, signature);
      }
    }

    setLoading(false);
  };

  return (
    <button
      className="btn btn-secondary bg-secondary fw-semibold text-white"
      onClick={handleConnect}
    >
      <img className="me-2" width={20} height={21} src={logo} alt="logo-concordium" />

      {loading ? 'Waiting...' : 'Sign in via Concordium'}
    </button>
  );
};

export default SignMessageConcordium;
