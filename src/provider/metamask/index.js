import React from 'react';

import ConnectMetamask from './connect';
import SignMessage from './sign';
import { useAccount } from 'wagmi';
import { WALLET_CONNECT_PROJECT_ID } from '../config';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import {
  arbitrum,
  arbitrumGoerli,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  baseGoerli,
  bronos,
  bronosTestnet,
  bsc,
  bscTestnet,
  canto,
  celo,
  celoAlfajores,
  crossbell,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinCalibration,
  filecoinHyperspace,
  foundry,
  gnosis,
  gnosisChiado,
  goerli,
  hardhat,
  harmonyOne,
  iotex,
  iotexTestnet,
  localhost,
  mainnet,
  metis,
  metisGoerli,
  moonbaseAlpha,
  moonbeam,
  moonriver,
  okc,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  polygonZkEvmTestnet,
  sepolia,
  taraxa,
  taraxaTestnet,
  telos,
  telosTestnet,
  zkSync,
  zkSyncTestnet,
} from 'wagmi/chains';
import { Web3Modal } from '@web3modal/react';

const chains = [
  arbitrum,
  arbitrumGoerli,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  baseGoerli,
  bronos,
  bronosTestnet,
  bsc,
  bscTestnet,
  canto,
  celo,
  celoAlfajores,
  crossbell,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinCalibration,
  filecoinHyperspace,
  foundry,
  gnosis,
  gnosisChiado,
  goerli,
  hardhat,
  harmonyOne,
  iotex,
  iotexTestnet,
  localhost,
  mainnet,
  metis,
  metisGoerli,
  moonbaseAlpha,
  moonbeam,
  moonriver,
  okc,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  polygonZkEvmTestnet,
  sepolia,
  taraxa,
  taraxaTestnet,
  telos,
  telosTestnet,
  zkSync,
  zkSyncTestnet,
];

const { provider } = configureChains(chains, [w3mProvider({ WALLET_CONNECT_PROJECT_ID })]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({
    version: '1',
    appName: 'web3Modal',
    chains,
    WALLET_CONNECT_PROJECT_ID,
  }),
  provider,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const Metamask = () => {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <MetamaskApp />
      </WagmiConfig>

      <Web3Modal projectId={WALLET_CONNECT_PROJECT_ID} ethereumClient={ethereumClient} />
    </>
  );
};

const MetamaskApp = () => {
  const { isConnected } = useAccount();

  return isConnected ? <SignMessage /> : <ConnectMetamask />;
};

export default Metamask;
