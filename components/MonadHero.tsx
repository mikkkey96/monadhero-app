'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { sdk } from '@farcaster/miniapp-sdk'
import { analyzeWallet, calculateHeroScore, type WalletAnalysis } from '@/utils/monadAnalyzer'

// Адрес смарт-контракта MonadHero NFT 
const HERO_NFT_CONTRACT = '0x7415CeEac1bE1480794701197F7BEBa078f95591' as `0x${string}`

// ABI для функции mintHeroBadge
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
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export default function MonadHero() {
  const [analyzing, setAnalyzing] = useState(false)
  const [walletData, setWalletData] = useState<WalletAnalysis | null>(null)
  const [heroScore, setHeroScore] = useState<number>(0)

  // Wagmi hooks для работы с кошельком
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Инициализация Farcaster SDK
  useEffect(() => {
    const initFarcaster = async () => {
      try {
        console.log('🚀 Initializing Farcaster Mini App...')
        await sdk.actions.ready()
        console.log('✅ Farcaster Mini App ready!')
      } catch (error) {
        console.error('❌ Farcaster SDK error:', error)
      }
    }

    initFarcaster()
  }, [])

  // Функция анализа кошелька
  const startAnalysis = async () => {
    if (!isConnected || !address) {
      alert('🔗 Please connect your Farcaster wallet first!')
      return
    }

    setAnalyzing(true)
    
    try {
      console.log('🔍 Analyzing connected wallet:', address)
      
      const analysis = await analyzeWallet(address)
      const score = calculateHeroScore(analysis)
      
      setWalletData(analysis)
      setHeroScore(score)
      
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('❌ Failed to analyze wallet. Please try again.')
    }
    
    setAnalyzing(false)
  }

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

  // Функция минта NFT
  const handleMintNFT = async () => {
    if (!heroLevel || heroLevel.nfts === 0 || !isConnected || !address) {
      alert('🔗 Please connect wallet and complete analysis first!')
      return
    }
    
    try {
      console.log('🎖️ Minting NFT to blockchain...')
      
      writeContract({
        address: HERO_NFT_CONTRACT,
        abi: HERO_NFT_ABI,
        functionName: 'mintHeroBadge',
        args: [heroLevel.name, BigInt(heroLevel.nfts), BigInt(heroScore)],
        value: parseEther('0.001')
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Mint failed:', errorMessage)
      alert('❌ Failed to mint NFT. Please try again.')
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
          margin: '0 0 20px 0',
          opacity: '0.9'
        }}>
          Analyze your Monad blockchain activity and mint exclusive Hero NFT badges
        </p>
      </div>

      {/* Подключение кошелька */}
      {isConnected && address ? (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: 'white' }}>
            💼 <strong style={{ color: '#10b981' }}>Farcaster Wallet Connected</strong>
          </p>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontFamily: 'monospace' }}>
            {address.slice(0, 10)}...{address.slice(-8)}
          </p>
          <button
            onClick={() => disconnect()}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: 'white',
              border: '1px solid rgba(239, 68, 68, 0.3)',
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
          padding: '15px', 
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(251, 191, 36, 0.3)'
        }}>
          <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'white' }}>
            💰 <strong style={{ color: '#fbbf24' }}>Connect Your Farcaster Wallet</strong>
          </p>
          <button
            onClick={() => connectors.length > 0 && connect({ connector: connectors[0] })}
            style={{
              background: 'linear-gradient(45deg, #7c3aed, #a855f7)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            🔗 Connect Farcaster Wallet
          </button>
        </div>
      )}

      {/* Остальная логика приложения */}
      {!analyzing && !walletData && isConnected && (
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
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)'
            }}
          >
            ⚡ Analyze My Wallet Activity
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
            🔍 Analyzing your wallet on Monad Testnet...
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
          {/* Индикатор типа данных */}
          <div style={{ 
            background: walletData.isRealData 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(251, 191, 36, 0.1)', 
            padding: '15px', 
            borderRadius: '12px',
            marginBottom: '20px',
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

          {/* Статистика */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '15px',
            marginBottom: '25px'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                ⚔️ Battles (Transactions)
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {walletData.transactions}
              </p>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                🏆 Hero Score
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {heroScore}
              </p>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                🏛️ Alliances (Contracts)
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {walletData.contracts}
              </p>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                💰 Balance (MON)
              </h4>
              <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {parseFloat(walletData.balance).toFixed(4)}
              </p>
            </div>
          </div>

          {/* Кнопка минта NFT */}
          {heroLevel.nfts > 0 && (
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={handleMintNFT}
                disabled={isPending || isConfirming}
                style={{
                  background: (isPending || isConfirming) 
                    ? 'linear-gradient(45deg, #6b7280, #4b5563)' 
                    : 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '15px',
                  fontSize: '18px',
                  cursor: (isPending || isConfirming) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                  opacity: (isPending || isConfirming) ? 0.7 : 1
                }}
              >
                {isPending ? '⏳ Confirm in Wallet...' :
                 isConfirming ? '⛓️ Minting on Blockchain
