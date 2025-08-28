"use client";

import { useState } from 'react';
import { analyzeWallet, calculateHeroScore, getTestAddress, type WalletAnalysis } from '@/utils/monadAnalyzer';

export default function MonadHero() {
  const [analyzing, setAnalyzing] = useState(false);
  const [walletData, setWalletData] = useState<WalletAnalysis | null>(null);
  const [heroScore, setHeroScore] = useState<number>(0);
  const [minting, setMinting] = useState(false);

  // Функция минта NFT (встроенная)
  const mintHeroNFT = async (
    walletAddress: string,
    level: string,
    tier: number,
    score: number
  ) => {
    try {
      console.log('Minting NFT:', { walletAddress, level, tier, score });
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      return mockTxHash;
    } catch (error) {
      console.error('NFT mint failed:', error);
      throw error;
    }
  };

  // Обновленная функция анализа с реальными блокчейн данными
  const startAnalysis = async () => {
    setAnalyzing(true);
    
    try {
      // Для демонстрации используем случайный тестовый адрес
      // В реальном приложении получили бы адрес из Farcaster контекста
      const testAddress = getTestAddress();
      console.log('🔍 Analyzing address:', testAddress);
      
      // Получаем реальные данные из Monad Testnet
      const analysis = await analyzeWallet(testAddress);
      const score = calculateHeroScore(analysis);
      
      setWalletData(analysis);
      setHeroScore(score);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('❌ Failed to analyze wallet. Please try again.');
    }
    
    setAnalyzing(false);
  };

  const calculateHeroLevel = (score: number) => {
    if (score >= 1000) return { 
      name: 'LEGENDARY HERO', 
      nfts: 4, 
      color: '#7c3aed', 
      icon: '🦸‍♂️',
      description: 'Master of the Monad Universe'
    };
    if (score >= 500) return { 
      name: 'EPIC HERO', 
      nfts: 3, 
      color: '#fbbf24', 
      icon: '⚡',
      description: 'Powerful Network Champion'
    };
    if (score >= 200) return { 
      name: 'BRAVE HERO', 
      nfts: 2, 
      color: '#10b981', 
      icon: '🛡️',
      description: 'Steadfast Network Defender'
    };
    if (score >= 100) return { 
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
      
      alert(`🎉 [TEST MODE] Hero Badge minted!\n\nMock Transaction: ${txHash.slice(0, 10)}...\n\nLevel: ${heroLevel.name}\nBadges: ${heroLevel.nfts}\nScore: ${heroScore}\n\nReal Balance: ${walletData?.balance} MON`);
      
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

      {/* Статус блокчейн интеграции */}
      <div style={{ 
        background: 'rgba(16, 185, 129, 0.1)', 
        padding: '15px', 
        borderRadius: '12px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <p style={{ margin: '0', fontSize: '16px', color: 'white' }}>
          ⛓️ <strong style={{ color: '#10b981' }}>Live Blockchain Data</strong> - Connected to Monad Testnet
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
            ⚡ Analyze Real Blockchain Data
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
            🔍 Scanning Monad Testnet blockchain...
          </p>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>
            Fetching real transaction data, balances, and on-chain activity
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

          {/* Адрес кошелька */}
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '15px', 
            borderRadius: '12px',
            marginBottom: '25px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0', fontSize: '14px', opacity: '0.8' }}>
              Analyzed Wallet Address:
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {walletData.address.slice(0, 10)}...{walletData.address.slice(-8)}
            </p>
          </div>

          {/* Расширенная статистика - ВСЕ 7 БЛОКОВ */}
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
                💎 Total Volume (MON)
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {walletData.volume}
              </p>
            </div>

            {/* Блок 5 - Hero Score */}
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
            
            {/* Блок 6 - Contract Types */}
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

            {/* Блок 7 - Баланс (занимает 2 колонки) */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              gridColumn: 'span 2'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                💰 Current Wallet Balance
              </h4>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                {parseFloat(walletData.balance).toFixed(6)} MON
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: '0.7' }}>
                {walletData.isActive ? '🟢 Active Wallet' : '🔴 Inactive Wallet'}
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
              🔄 Analyze Another Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
