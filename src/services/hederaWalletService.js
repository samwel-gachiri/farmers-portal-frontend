/* eslint-disable */
import { ethers } from 'ethers';

class HederaWalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.isConnected = false;
    this.networkId = null;

    // Error messages
    this.WALLET_NOT_CONNECTED_ERROR = 'Wallet not connected';

    // Hedera network configurations
    this.networks = {
      testnet: {
        chainId: '0x128', // 296 in decimal
        chainName: 'Hedera Testnet',
        nativeCurrency: {
          name: 'HBAR',
          symbol: 'ℏℏ',
          decimals: 18,
        },
        rpcUrls: ['https://testnet.hashio.io/api'],
        blockExplorerUrls: ['https://hashscan.io/testnet'],
      },
      mainnet: {
        chainId: '0x127', // 295 in decimal
        chainName: 'Hedera Mainnet',
        nativeCurrency: {
          name: 'HBAR',
          symbol: 'ℏℏ',
          decimals: 18,
        },
        rpcUrls: ['https://mainnet.hashio.io/api'],
        blockExplorerUrls: ['https://hashscan.io/mainnet'],
      },
    };
  }

  /**
   * Check if wallet extension is available
   */
  static isWalletAvailable() {
    return (
      typeof window !== 'undefined'
      && (window.ethereum || window.hashpack || window.blade)
    );
  }

  /**
   * Connect to wallet (HashPack, Blade, or MetaMask)
   */
  async connectWallet(walletType = 'auto') {
    try {
      if (!HederaWalletService.isWalletAvailable()) {
        throw new Error(
          'No wallet extension found. Please install HashPack, Blade, or MetaMask.',
        );
      }

      let provider;

      switch (walletType) {
        case 'hashpack':
          provider = await HederaWalletService.connectHashPack();
          break;
        case 'blade':
          provider = await HederaWalletService.connectBlade();
          break;
        case 'metamask':
          provider = await this.connectMetaMask();
          break;
        default:
          // Auto-detect available wallet
          if (window.hashpack) {
            provider = await HederaWalletService.connectHashPack();
          } else if (window.blade) {
            provider = await HederaWalletService.connectBlade();
          } else if (window.ethereum) {
            provider = await this.connectMetaMask();
          } else {
            throw new Error('No compatible wallet found');
          }
      }

      this.provider = provider;
      this.signer = provider.getSigner();
      this.account = await this.signer.getAddress();
      this.isConnected = true;

      // Get network information
      const network = await provider.getNetwork();
      this.networkId = network.chainId;

      // Set up event listeners
      this.setupEventListeners();

      return {
        account: this.account,
        networkId: this.networkId,
        isConnected: this.isConnected,
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Connect to HashPack wallet
   */
  static async connectHashPack() {
    if (!window.hashpack) {
      throw new Error('HashPack wallet not found');
    }

    const hashpack = window.hashpack;
    await hashpack.connectToLocalWallet();

    // Create ethers provider for HashPack
    return new ethers.providers.Web3Provider(hashpack);
  }

  /**
   * Connect to Blade wallet
   */
  static async connectBlade() {
    if (!window.blade) {
      throw new Error('Blade wallet not found');
    }

    const blade = window.blade;
    const accounts = await blade.request({ method: 'eth_requestAccounts' });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in Blade wallet');
    }

    return new ethers.providers.Web3Provider(blade);
  }

  /**
   * Connect to MetaMask (configured for Hedera)
   */
  async connectMetaMask() {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in MetaMask');
    }

    // Check if we're on Hedera network, if not, try to switch
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const hederaTestnetChainId = '0x128'; // 296 in decimal
    const hederaMainnetChainId = '0x127'; // 295 in decimal

    if (chainId !== hederaTestnetChainId && chainId !== hederaMainnetChainId) {
      await this.switchToHederaNetwork('testnet');
    }

    return new ethers.providers.Web3Provider(window.ethereum, "any");
  }

  /**
   * Switch to Hedera network
   */
  async switchToHederaNetwork(network = 'testnet') {
    if (!window.ethereum) {
      throw new Error('Wallet not available');
    }

    const networkConfig = this.networks[network];

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainId }],
      });
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          });
        } catch (addError) {
          throw new Error('Failed to add Hedera network to wallet');
        }
      } else {
        throw new Error('Failed to switch to Hedera network');
      }
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.isConnected = false;
    this.networkId = null;

    // Remove event listeners
    this.removeEventListeners();
  }

  /**
   * Get account balance
   */
  async getBalance() {
    if (!this.isConnected || !this.signer) {
      throw new Error(this.WALLET_NOT_CONNECTED_ERROR);
    }

    const balance = await this.signer.getBalance();
    return ethers.utils.formatEther(balance);
  }

  /**
   * Sign a message
   */
  async signMessage(message) {
    if (!this.isConnected || !this.signer) {
      throw new Error(this.WALLET_NOT_CONNECTED_ERROR);
    }

    return this.signer.signMessage(message);
  }

  /**
   * Verify a signature
   */
  static verifySignature(message, signature, address) {
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Failed to verify signature:', error);
      return false;
    }
  }

  /**
   * Send transaction
   */
  async sendTransaction(transaction) {
    if (!this.isConnected || !this.signer) {
      throw new Error(this.WALLET_NOT_CONNECTED_ERROR);
    }

    return this.signer.sendTransaction(transaction);
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash) {
    if (!this.provider) {
      throw new Error('Provider not available');
    }

    return this.provider.getTransactionReceipt(txHash);
  }

  /**
   * Setup event listeners for wallet events
   */
  setupEventListeners() {
    if (window.ethereum) {
      window.ethereum.on(
        'accountsChanged',
        this.handleAccountsChanged.bind(this),
      );
      window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
      window.ethereum.on('disconnect', this.handleDisconnect.bind(this));
    }
  }

  /**
   * Remove event listeners
   */
  removeEventListeners() {
    if (window.ethereum) {
      window.ethereum.removeListener(
        'accountsChanged',
        this.handleAccountsChanged,
      );
      window.ethereum.removeListener('chainChanged', this.handleChainChanged);
      window.ethereum.removeListener('disconnect', this.handleDisconnect);
    }
  }

  /**
   * Handle account changes
   */
  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.disconnectWallet();
    } else {
      this.account = accounts[0];
    }

    // Emit event for components to listen to
    window.dispatchEvent(
      new CustomEvent('walletAccountChanged', {
        detail: { account: this.account },
      }),
    );
  }

  /**
   * Handle chain changes
   */
  handleChainChanged(chainId) {
    this.networkId = parseInt(chainId, 16);

    // Emit event for components to listen to
    window.dispatchEvent(
      new CustomEvent('walletChainChanged', {
        detail: { chainId: this.networkId },
      }),
    );
  }

  /**
   * Handle disconnect
   */
  handleDisconnect() {
    this.disconnectWallet();

    // Emit event for components to listen to
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  }

  /**
   * Get current wallet status
   */
  getWalletStatus() {
    return {
      isConnected: this.isConnected,
      account: this.account,
      networkId: this.networkId,
      provider: this.provider ? 'connected' : null,
    };
  }

  /**
   * Format Hedera account ID from address
   */
  static formatHederaAccountId(address) {
    // This is a simplified conversion - in practice, you'd need proper mapping
    // between Ethereum addresses and Hedera account IDs
    return address ? `0.0.${parseInt(address.slice(-8), 16)}` : null;
  }

  /**
   * Get network name
   */
  getNetworkName() {
    switch (this.networkId) {
      case 295:
        return 'Hedera Mainnet';
      case 296:
        return 'Hedera Testnet';
      default:
        return 'Unknown Network';
    }
  }

  /**
   * Check if on correct network
   */
  isOnHederaNetwork() {
    return this.networkId === 295 || this.networkId === 296;
  }
}

export const hederaWalletService = new HederaWalletService();
export default hederaWalletService;
