require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_RPC_URL,
      },
      chainId: 1,
    },
    sepolia: {
      url: process.env.sepolia_rpc_url,
      chainId: 11155111,
      accounts: {
        mnemonic: process.env.sepolia_mnemonic,
      },
      gas: 2100000,
      networkTimeOut: 100000000000,
    },
    polygon: {
      url: process.env.matic_rpc_url,
      chainId: 137,
      accounts: {
        mnemonic: process.env.goerli_mnemonic,
      },
      gas: 2100000,
      networkTimeOut: 100000000000,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.26',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],
    settings: {
      metadata: {
        useLiteralContent: true,
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
      // viaIR: true,
      outputSelection: {
        '*': {
          '*': [
            'abi',
            'evm.bytecode',
            'evm.deployedBytecode',
            'evm.methodIdentifiers',
            'metadata',
          ],
          '': ['id', 'ast'],
        },
      },
    },
  },
  mocha: {
    timeout: 20000,
  },
};
