"use client";

import { useState } from 'react';

// Типы для данных анализа
interface WalletAnalysis {
  address: string;
  transactions: number;
  contracts: number;
  daysActive: number;
  volume: string;
  firstTransaction: number;
  contractTypes: string[];
  averageGasUsed: string;
}

// Функция минта NFT (встроенная)
async function mintHeroNFT(
  walletAddress: string,
  level: string,
  tier: number,
  score: number
) {
  try {
    // Симуляция минта NFT
    console.log('Minting NFT:', { walletAddress, level, tier, score });
    
    // Симуляция транзакции
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    return mockTxHash;
  } catch (error) {
    console.error('NFT mint failed:', error);
    throw error;
  }
}

export default function MonadHero() {
  const [analyzing, setAnalyzing] = useState(false);
  const [walletData, setWalletData] = useState<WalletAnalysis | null>(null);
  const [heroScore, setHeroScore] = useState<number>(0);
  const [minting, setMinting] = useState(false);

  // Функция расчета Hero Score
  const calculateHeroScore = (analysis: WalletAnalysis): number => {
    let score = 0;
    
    // Базовые транзакции (1 балл за транзакцию)
    score += analysis.transactions;
    
    // Взаимодействие с контрактами (2 балла за контракт)
    score += analysis.contracts * 2;
    
    // Длительность активности (1 балл за день)
    score += analysis.daysActive;
    
    // Объем (1 балл за MON)
    score += Math.floor(parseFloat(analysis.volume));
    
    // Разнообразие контрактов (10 баллов за тип)
    score += analysis.contractTypes.length * 10;
    
    return score;
  };

  const startAnalysis = async () => {
    setAnalyzing(true);
    
    // Симуляция анализа с расширенными данными
    setTimeout(() => {
      const mockData: WalletAnalysis = {
        address: '0x742d35Cc6e5F41D8B56D41a2c0b8B2E6E6C6E2F8',
        transactions: Math.floor(Math.random() * 200) + 10,
        contracts: Math.floor(Math.random() * 20) + 1,
        daysActive: Math.floor(Math.random() * 100) + 7,
        volume: (Math.random() * 50 + 0.1).toFixed(4),
        firstTransaction: Date.now() - (Math.floor(Math.random() * 100) * 24 * 60 * 60 * 1000),
        contractTypes: ['DEX', 'NFT', 'DeFi', 'Gaming', 'DAO'].slice(0, Math.floor(Math.random() * 4) + 1),
        averageGasUsed: (21000 + Math.floor(Math.random() * 50000)).toString()
      };
      
      const score = calculateHeroScore(mockData);
      
      setWalletData(mockData);
      setHeroScore(score);
      setAnalyzing(false);
    }, 3000);
  };

  const calculateHeroLevel = (score: number) => {
    if (score >= 500) return { 
      name: 'LEGENDARY HERO', 
      nfts: 4, 
      color: '#7c3aed', 
      icon: '🦸‍♂️',
      description: 'Master of the Monad Universe'
    };
    if (score >= 250) return { 
      name: 'EPIC HERO', 
      nfts: 3, 
      color: '#fbbf24', 
      icon: '⚡',
      description: 'Powerful Network Champion'
    };
    if (score >= 100) return { 
      name: 'BRAVE HERO', 
      nfts: 2, 
      color: '#10b981', 
      icon: '🛡️',
      description: 'Steadfast Network Defender'
    };
    if (score >= 50) return { 
      name: 'RISING HERO', 
      nfts: 1, 
      color: '#f59e0b', 
      icon: '⭐',
      description: 'Emerging Network Warrior'
    };
    return { 
      name: 'APPRENTICE', 
      nfts: 0, 
      color: '#6b7280', 
      icon: '🌱',
      description: 'Ready to Begin the Journey'
    };
  };

  const heroLevel = walletData ? calculateHeroLevel(heroScore) : null;

  // Функция минта NFT
  const handleMintNFT = async () => {
    console.log('🔥 Button clicked!', { heroLevel, minting });
    
    if (!heroLevel || heroLevel.nfts === 0) {
      console.log('❌ No hero level or no NFTs to mint');
      return;
    }
    
    setMinting(true);
    
    try {
      console.log('🧪 LOCAL TEST MODE');
      console.log('Minting details:', {
        level: heroLevel.name,
        nfts: heroLevel.nfts,
        score: heroScore,
        address: walletData?.address
      });
      
      // Симуляция минта с задержкой
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = await mintHeroNFT(
        walletData?.address || '0x...demo',
        heroLevel.name,
        heroLevel.nfts,
        heroScore
      );
      
      alert(`🎉 [TEST MODE] Hero Badge minted!\n\nMock Transaction: ${txHash.slice(0, 10)}...\n\nLevel: ${heroLevel.name}\nBadges: ${heroLevel.nfts}\nScore: ${heroScore}`);
      
    } catch (error) {
      console.error('Mint failed:', error);
      alert('❌ Failed to mint NFT. Please try again.');
    }
    
    setMinting(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          margin: '0 0 10px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          🦸‍♂️ MonadHero
        </h1>
        <p style={{ 
          fontSize: '18px', 
          margin: '0',
          opacity: '0.9'
        }}>
          Prove your blockchain heroics and earn NFT badges
        </p>
      </div>

      {/* Тестовое сообщение */}
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '15px', 
        borderRadius: '12px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <p style={{ margin: '0', fontSize: '16px', color: 'white' }}>
          🧪 <strong style={{ color: '#fbbf24' }}>Test Mode</strong> - Ready to analyze blockchain activity!
        </p>
      </div>

      {/* Кнопка анализа */}
      {!analyzing && !walletData && (
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={startAnalysis}
            style={{
              background: 'linear-gradient(45deg, #7c3aed, #a855f7)',
              color: 'white',
              border: 'none',
              padding: '18px 36px',
              borderRadius: '15px',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)',
              transition: 'transform 0.2s'
            }}
          >
            ⚡ Discover My Hero Level
          </button>
        </div>
      )}

      {/* Анимация загрузки */}
      {analyzing && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '6px solid rgba(255,255,255,0.3)',
            borderTop: '6px solid #fbbf24',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            Scanning the blockchain for heroic deeds...
          </p>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>
            Analyzing transactions, contracts, and achievements
          </p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Результаты анализа */}
      {walletData && heroLevel && (
        <div>
          {/* Карточка уровня героя */}
          <div style={{
            background: `linear-gradient(135deg, ${heroLevel.color}, ${heroLevel.color}dd)`,
            color: 'white',
            padding: '25px',
            borderRadius: '20px',
            textAlign: 'center',
            marginBottom: '25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>
              {heroLevel.icon}
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>
              {heroLevel.name}
            </h2>
            <p style={{ margin: '0 0 15px 0', fontSize: '16px', opacity: '0.9' }}>
              {heroLevel.description}
            </p>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '10px 20px', 
              borderRadius: '25px',
              display: 'inline-block'
            }}>
              🏆 Eligible for {heroLevel.nfts} Hero Badge{heroLevel.nfts !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Расширенная статистика - ВСЕ 6 БЛОКОВ */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '15px',
            marginBottom: '25px'
          }}>
            {/* Блок 1 - Транзакции */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                ⚔️ Battles (Transactions)
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {walletData.transactions}
              </p>
            </div>

            {/* Блок 2 - Контракты */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                🏛️ Alliances (Contracts)
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {walletData.contracts}
              </p>
            </div>

            {/* Блок 3 - Дни активности */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                ⏰ Days of Service
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {walletData.daysActive}
              </p>
            </div>

            {/* Блок 4 - Объем */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                💎 Power Level (MON)
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {walletData.volume}
              </p>
            </div>

            {/* НОВЫЙ Блок 5 - Hero Score */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                🏆 Hero Score
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {heroScore}
              </p>
            </div>
            
            {/* НОВЫЙ Блок 6 - Contract Types */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                🎯 Contract Types
              </h4>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
                {walletData?.contractTypes?.join(', ') || 'N/A'}
              </p>
            </div>
          </div>

          {/* Кнопка минта NFT */}
          {heroLevel.nfts > 0 && (
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={handleMintNFT}
                disabled={minting}
                style={{
                  background: minting 
                    ? 'linear-gradient(45deg, #6b7280, #4b5563)' 
                    : 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '15px',
                  fontSize: '18px',
                  cursor: minting ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                  transition: 'transform 0.2s',
                  opacity: minting ? 0.7 : 1
                }}
              >
                {minting 
                  ? '🔄 Minting...' 
                  : `🎖️ Mint ${heroLevel.nfts} Hero Badge${heroLevel.nfts !== 1 ? 's' : ''}`
                }
              </button>
            </div>
          )}

          {/* Кнопка нового анализа */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => {
                setWalletData(null);
                setHeroScore(0);
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '12px 24px',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🔄 Analyze Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
