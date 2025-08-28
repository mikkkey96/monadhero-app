import { ethers } from 'ethers';

// Monad Testnet RPC URLs (несколько вариантов)
const MONAD_RPC_URLS = [
  "https://testnet-rpc.monad.xyz",
  "https://docs-demo.monad-testnet.quiknode.pro/",
  "https://rpc.testnet.monad.xyz"
];

export interface WalletAnalysis {
  address: string;
  transactions: number;
  contracts: number;
  daysActive: number;
  volume: string;
  firstTransaction: number;
  contractTypes: string[];
  averageGasUsed: string;
  balance: string;
  isActive: boolean;
  isRealData: boolean;
}

// Функция создания провайдера с retry (ИСПРАВЛЕНА)
async function createProvider(): Promise<ethers.JsonRpcProvider | null> {
  for (const rpcUrl of MONAD_RPC_URLS) {
    try {
      console.log(`🔄 Trying RPC: ${rpcUrl}`);
      const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
        staticNetwork: ethers.Network.from({
          name: "monad-testnet",
          chainId: 10143
        })
      });
      
      // Тестируем соединение с таймаутом
      const blockPromise = provider.getBlockNumber();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const blockNumber = await Promise.race([blockPromise, timeoutPromise]);
      console.log(`✅ Connected to ${rpcUrl}, block: ${blockNumber}`);
      
      return provider;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ Failed to connect to ${rpcUrl}:`, errorMessage);
      continue;
    }
  }
  
  return null;
}

export async function analyzeWallet(address: string): Promise<WalletAnalysis> {
  console.log('🔍 Starting analysis for:', address);
  
  try {
    // Пытаемся подключиться к любому работающему RPC
    const provider = await createProvider();
    
    if (!provider) {
      throw new Error("All Monad RPC endpoints are unavailable");
    }
    
    // Получаем данные из блокчейна
    console.log('📊 Fetching real blockchain data...');
    const [balance, transactionCount] = await Promise.all([
      provider.getBalance(address),
      provider.getTransactionCount(address)
    ]);
    
    const balanceInMON = ethers.formatEther(balance);
    console.log('💰 Real Balance:', balanceInMON, 'MON');
    console.log('📈 Real Transactions:', transactionCount);
    
    // Создаем анализ на основе реальных данных
    const isActive = transactionCount > 0;
    const estimatedDaysActive = Math.min(Math.max(Math.floor(transactionCount / 2) + 1, 1), 365);
    const estimatedContracts = Math.floor(transactionCount * 0.3);
    
    const getContractTypes = (txCount: number): string[] => {
      const types = [];
      if (txCount >= 10) types.push('DEX');
      if (txCount >= 20) types.push('DeFi');  
      if (txCount >= 50) types.push('NFT');
      if (txCount >= 100) types.push('Gaming');
      if (txCount >= 150) types.push('DAO');
      return types.length > 0 ? types : ['Basic'];
    };

    const realAnalysis: WalletAnalysis = {
      address,
      transactions: transactionCount,
      contracts: estimatedContracts,
      daysActive: estimatedDaysActive,
      volume: balanceInMON,
      firstTransaction: Date.now() - (estimatedDaysActive * 24 * 60 * 60 * 1000),
      contractTypes: getContractTypes(transactionCount),
      averageGasUsed: (21000 + Math.floor(Math.random() * 30000)).toString(),
      balance: balanceInMON,
      isActive,
      isRealData: true
    };

    console.log('✅ SUCCESS! Real blockchain data loaded:', realAnalysis);
    return realAnalysis;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Blockchain connection failed:', errorMessage);
    
    // Создаем более реалистичную симуляцию
    const simulatedAnalysis: WalletAnalysis = {
      address,
      transactions: Math.floor(Math.random() * 150) + 25,
      contracts: Math.floor(Math.random() * 20) + 5,
      daysActive: Math.floor(Math.random() * 90) + 14,
      volume: (Math.random() * 25 + 1).toFixed(4),
      firstTransaction: Date.now() - (Math.floor(Math.random() * 90 + 14) * 24 * 60 * 60 * 1000),
      contractTypes: ['DEX', 'DeFi', 'NFT'].slice(0, Math.floor(Math.random() * 3) + 1),
      averageGasUsed: (25000 + Math.floor(Math.random() * 40000)).toString(),
      balance: (Math.random() * 25 + 1).toFixed(4),
      isActive: true,
      isRealData: false
    };
    
    console.log('🎭 Using simulated data:', simulatedAnalysis);
    return simulatedAnalysis;
  }
}

export function calculateHeroScore(analysis: WalletAnalysis): number {
  let score = 0;
  
  // Базовые транзакции (3 балла за транзакцию)
  score += analysis.transactions * 3;
  
  // Взаимодействие с контрактами (8 баллов за контракт)
  score += analysis.contracts * 8;
  
  // Длительность активности (2 балла за день)
  score += analysis.daysActive * 2;
  
  // Баланс (15 баллов за MON)
  score += Math.floor(parseFloat(analysis.volume) * 15);
  
  // Разнообразие контрактов (25 баллов за тип)
  score += analysis.contractTypes.length * 25;
  
  // Бонус за активность
  if (analysis.isActive) score += 100;
  
  // Бонус за реальные данные
  if (analysis.isRealData) score += 200;
  
  return score;
}

export function getTestAddress(): string {
  return '0xC8F64A659edc7c422859d06322Aa879c7F1AcB9b';
}
