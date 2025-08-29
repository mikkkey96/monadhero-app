'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { sdk } from '@farcaster/miniapp-sdk'

// Симуляция анализа кошелька
const analyzeWallet = async (address: string) => {
  // Генерируем случайные данные для демо
  const transactions = Math.floor(Math.random() * 1000) + 50
  const balance = (Math.random() * 10 + 0.1).toFixed(6)
  const contracts = Math.floor(Math.random() * 20) + 5
  
  return {
    transactions,
    balance,
    contracts,
    isRealData: false // Пока используем симуляцию
  }
}

const calculateHeroScore = (data: any) => {
  return data.transactions * 2 + data.contracts * 50 + parseFloat(data.balance) * 10
}

// Адрес контракта (обновите на реальный)
const HERO_NFT_CONTRACT = '0x7415CeEac1bE1480794701197F7BEBa078f95591' as `0x${string}`

const HERO_NFT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "level", "type": "string"},
      {"internalType": "uint256", "name": "tier", "type": "uint256"},
      {"internalType": "uint256", "name": "score", "type": "uint256"}
    ],
    "name": "mintHeroBadge",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

export default function MonadHero() {
  const [analyzing, setAnalyzing] = useState(false)
  const [walletData, setWalletData] = useState<any>(null)
  const [heroScore, setHeroScore] = useState<number>(0)

  // Wagmi hooks
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Инициализация Farcaster SDK
  useEffect(() => {
    const initFarcaster = async () => {
      try {
        await sdk.actions.ready()
        console.log('✅ Farcaster Mini App ready!')
      } catch (error) {
        console.error('❌ Farcaster SDK error:', error)
      }
    }

    initFarcaster()
  }, [])

  // Анализ кошелька
  const startAnalysis = async () => {
    if (!isConnected || !address) {
      alert('🔗 Please connect your wallet first!')
      return
    }

    setAnalyzing(true)
    
    try {
      const analysis = await analyzeWallet(address)
      const score = calculateHeroScore(analysis)
      
      setWalletData(analysis)
      setHeroScore(Math.floor(score))
      
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('❌ Failed to analyze wallet')
    }
    
    setAnalyzing(false)
  }

  // Расчет уровня героя
  const calculateHeroLevel = (score: number) => {
    if (score >= 1500) return { 
      name: 'LEGENDARY HERO', 
      nfts: 4, 
      color: '#7c3aed', 
      icon: '🦸‍♂️',
      description: 'Master of the Monad Universe'
    }
    if (score >= 800) return { 
      name: 'EPIC HERO', 
      nfts: 3, 
      color: '#fbbf24', 
      icon: '⚡',
      description: 'Powerful Network Champion'
    }
    if (score >= 400) return { 
      name: 'BRAVE HERO', 
      nfts: 2, 
      color: '#10b981', 
      icon: '🛡️',
      description: 'Steadfast Network Defender'
    }
    if (score >= 150) return { 
      name: 'RISING HERO', 
      nfts: 1, 
      color: '#f59e0b', 
      icon: '⭐',
      description: 'Emerging Network Warrior'
    }
    return { 
      name: 'APPRENTICE', 
      nfts: 0, 
      color: '#6b7280', 
      icon: '🌱',
      description: 'Ready to Begin the Journey'
    }
  }

  const heroLevel = walletData ? calculateHeroLevel(heroScore) : null

  // Минт NFT
  const handleMintNFT = async () => {
    if (!heroLevel || heroLevel.nfts === 0) {
      alert('⚠️ Complete analysis first!')
      return
    }
    
    try {
      writeContract({
        address: HERO_NFT_CONTRACT,
        abi: HERO_NFT_ABI,
        functionName: 'mintHeroBadge',
        args: [heroLevel.name, BigInt(heroLevel.nfts), BigInt(heroScore)],
        value: parseEther('0.001')
      })
    } catch (error) {
      console.error('Mint failed:', error)
      alert('❌ Mint failed')
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
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
          Your Blockchain Achievement Badge System
        </p>
      </div>

      {/* Подключение кошелька */}
      {isConnected && address ? (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
            💼 <strong style={{ color: '#10b981' }}>Wallet Connected</strong>
          </p>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px', fontFamily: 'monospace', opacity: '0.8' }}>
            {address.slice(0, 10)}...{address.slice(-8)}
          </p>
          <button
            onClick={() => disconnect()}
            style={{
              background: 'rgba(239, 68, 68, 0.3)',
              color: 'white',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div style={{ 
          background: 'rgba(251, 191, 36, 0.1)', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
            💰 <strong style={{ color: '#fbbf24' }}>Connect Your Wallet</strong>
          </p>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', opacity: '0.8' }}>
            Connect to analyze your Monad blockchain activity
          </p>
          <button
            onClick={() => connectors.length > 0 && connect({ connector: connectors[0] })}
            style={{
              background: 'linear-gradient(45deg, #7c3aed, #a855f7)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            🔗 Connect Wallet
          </button>
        </div>
      )}

      {/* Кнопка анализа */}
      {!analyzing && !walletData && isConnected && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={startAnalysis}
            style={{
              background: 'linear-gradient(45deg, #7c3aed, #a855f7)',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '15px',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)'
            }}
          >
            ⚡ Analyze My Hero Level
          </button>
        </div>
      )}

      {/* Загрузка */}
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
            🔍 Scanning blockchain activity...
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

      {/* Результаты */}
      {walletData && heroLevel && (
        <div>
          {/* Карточка уровня */}
          <div style={{
            background: `linear-gradient(135deg, ${heroLevel.color}, ${heroLevel.color}dd)`,
            color: 'white',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center',
            marginBottom: '25px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>
              {heroLevel.icon}
            </div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>
              {heroLevel.name}
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '16px', opacity: '0.9' }}>
              {heroLevel.description}
            </p>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '12px 25px', 
              borderRadius: '25px',
              display: 'inline-block',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              🏆 Score: {heroScore} • Badges: {heroLevel.nfts}
            </div>
          </div>

          {/* Статистика */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '15px',
            marginBottom: '25px'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚔️</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>
                {walletData.transactions}
              </div>
              <div style={{ fontSize: '12px', opacity: '0.7' }}>Transactions</div>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏛️</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>
                {walletData.contracts}
              </div>
              <div style={{ fontSize: '12px', opacity: '0.7' }}>Contracts</div>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>
                {parseFloat(walletData.balance).toFixed(3)}
              </div>
              <div style={{ fontSize: '12px', opacity: '0.7' }}>MON Balance</div>
            </div>
          </div>

          {/* Кнопка минта */}
          {heroLevel.nfts > 0 && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button 
                onClick={handleMintNFT}
                disabled={isPending || isConfirming}
                style={{
                  background: (isPending || isConfirming) 
                    ? 'linear-gradient(45deg, #6b7280, #4b5563)' 
                    : 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 40px',
                  borderRadius: '15px',
                  fontSize: '16px',
                  cursor: (isPending || isConfirming) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: (isPending || isConfirming) ? 0.7 : 1
                }}
              >
                {isPending ? '⏳ Confirm in Wallet...' :
                 isConfirming ? '⛓️ Minting Badge...' :
                 `🎖️ Mint ${heroLevel.nfts} Hero Badge${heroLevel.nfts !== 1 ? 's' : ''} (0.001 MON)`}
              </button>
            </div>
          )}

          {/* Статус транзакции */}
          {isConfirmed && (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              padding: '15px', 
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              <p style={{ margin: '0', fontSize: '16px' }}>
                🎉 <strong style={{ color: '#10b981' }}>Badge Minted Successfully!</strong>
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: '0.8' }}>
                Hash: {hash?.slice(0, 10)}...{hash?.slice(-8)}
              </p>
            </div>
          )}

          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              padding: '15px', 
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              <p style={{ margin: '0', fontSize: '16px' }}>
                ❌ <strong style={{ color: '#ef4444' }}>Transaction Failed</strong>
              </p>
            </div>
          )}

          {/* Кнопка нового анализа */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => {
                setWalletData(null)
                setHeroScore(0)
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🔄 New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
