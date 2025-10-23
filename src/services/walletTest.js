/* eslint-disable */
// Simple test file to verify wallet connection
import { connectToHederaDefault, getDefaultNetwork } from './walletConnectUtil';
import hederaWalletService from './hederaWalletService';

/**
 * Test the wallet connection utility
 */
export async function testWalletConnection() {
    try {
        console.log('🧪 Testing wallet connection...');
        console.log(`📋 Default network from env: ${getDefaultNetwork()}`);

        // Test the utility function
        const [account, provider, network] = await connectToHederaDefault();

        console.log('✅ Wallet connection test successful!');
        console.log(`📍 Account: ${account}`);
        console.log(`🌐 Network: ${network}`);
        console.log(`🔗 Provider:`, provider);

        return { account, provider, network };
    } catch (error) {
        console.error('❌ Wallet connection test failed:', error);
        throw error;
    }
}

/**
 * Test the wallet service
 */
export async function testWalletService() {
    try {
        console.log('🧪 Testing wallet service...');

        // Test the service
        const result = await hederaWalletService.quickConnectDefault();

        console.log('✅ Wallet service test successful!');
        console.log('📊 Result:', result);

        // Test network info
        const networkInfo = await hederaWalletService.getNetworkInfo();
        console.log('🌐 Network info:', networkInfo);

        // Test validation
        const validation = await hederaWalletService.validateConnection();
        console.log('✅ Validation:', validation);

        return result;
    } catch (error) {
        console.error('❌ Wallet service test failed:', error);
        throw error;
    }
}

/**
 * Quick test function for console
 */
export async function quickTest() {
    try {
        console.log('🚀 Quick wallet test starting...');
        const result = await hederaWalletService.quickConnect();
        console.log('🎉 Quick test completed:', result);
        return result;
    } catch (error) {
        console.error('💥 Quick test failed:', error);
        throw error;
    }
}

// Export for console testing
if (typeof window !== 'undefined') {
    window.testWallet = {
        testConnection: testWalletConnection,
        testService: testWalletService,
        quickTest: quickTest,
        service: hederaWalletService
    };

    console.log('🔧 Wallet test utilities available at window.testWallet');
    console.log('💡 Try: window.testWallet.quickTest()');
}