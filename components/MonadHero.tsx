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
      // Используем ваш активный адрес
      const testAddress = getTestAddress();
      console.log('🔍 Analyzing address:', testAddress);
      
      // Получаем данные (реальные или симулированные)
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
    if (score >= 1500) return { 
      name: 'LEGENDARY HERO', 
      nfts: 4, 
      color: '#7c3aed', 
      icon: '🦸‍♂️',
      description: 'Master of the Monad Universe'
    };
    if (score >= 800) return { 
      name: 'EPIC HERO', 
      nfts: 3, 
      color: '#fbbf24', 
      icon: '⚡',
      description: 'Powerful Network Champion'
    };
    if (score >= 400) return { 
      name: 'BRAVE HERO', 
      nfts: 2, 
      color: '#10b981', 
      icon: '🛡️',
      description: 'Steadfast Network Defender'
    };
    if (score >= 150) return { 
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
        address: walletData?.address,
        isRealData: walletData?.isRealData
      });
      
      // Симуляция минта с задержкой
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = await mintHeroNFT(
        walletData?.address || '0x...demo',
        heroLevel.name,
        heroLevel.nfts,
        heroScore
      );
      
      const dataType = walletData?.isRealData ? 'REAL BLOCKCHAIN DATA' : 'SIMULATED DATA';
      alert(`🎉 [TEST MODE] Hero Badge minted!\n\nData Type: ${dataType}\nTransaction: ${txHash.slice(0, 10)}...\n\nLevel: ${heroLevel.name}\nBadges: ${heroLevel.nfts}\nScore: ${heroScore}\nBalance: ${walletData?.balance} MON`);
      
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

      {/* ИНДИКАТОР ТИПА ДАННЫХ - ДО АНАЛИЗА */}
      {!walletData && (
        <div style={{ 
          background: 'rgba(124, 58, 237, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          marginBottom: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(124, 58, 237, 0.3)'
        }}>
          <p style={{ margin: '0', fontSize: '16px', color: 'white' }}>
            🔄 <strong style={{ color: '#a855f7' }}>Ready to Connect</strong> - Will attempt Monad Testnet blockchain connection
          </p>
        </div>
      )}

      {/* ИНДИКАТОР ТИПА ДАННЫХ - ПОСЛЕ АНАЛИЗА */}
      {walletData && (
        <div style={{ 
          background: walletData.isRealData 
            ? 'rgba(16, 185, 129, 0.1)' 
            : 'rgba(251, 191, 36, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          marginBottom: '20px',
          backdropFilter: 'blur(10px)',
          border: walletData.isRealData 
            ? '1px solid rgba(16, 185, 129, 0.3)' 
            : '1px solid rgba(251, 191, 36, 0.3)'
        }}>
          <p style={{ margin: '0', fontSize: '16px', color: 'white' }}>
            {walletData.isRealData ? (
              <>⛓️ <strong style={{ color: '#10b981' }}>Real Blockchain Data</strong> - Successfully connected to Monad Testnet</>
            ) : (
              <>🎭 <strong style={{ color: '#fbbf24' }}>Simulated Data</strong> - RPC connection failed, using enhanced demo data</>
            )}
          </p>
        </div>
      )}

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
            🔍 Connecting to Monad Testnet...
          </p>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>
            Attempting to fetch real blockchain data, transaction history, and wallet balance
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
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: '0.6' }}>
              {walletData.isRealData ? '✅ Data fetched from blockchain' : '⚠️ Using simulated data'}
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
              <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: '0.6' }}>
                {walletData.isRealData ? 'Real on-chain' : 'Simulated'}
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
              <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: '0.6' }}>
                Estimated interactions
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
              <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: '0.6' }}>
                Based on activity
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
              <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: '0.6' }}>
                Estimated trading
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
              <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: '0.6' }}>
                {walletData.isRealData ? '+200 real data bonus' : 'Simulation mode'}
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
              <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: '0.6' }}>
                Based on tx patterns
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
                {walletData.isActive ? '🟢 Active Wallet' : '🔴 Inactive Wallet'} • 
                {walletData.isRealData ? ' Real balance from Monad RPC' : ' Simulated balance data'}
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
