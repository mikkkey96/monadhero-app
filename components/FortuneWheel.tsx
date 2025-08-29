'use client'
import { useState, useEffect } from 'react'
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'

const FORTUNE_WHEEL_CONTRACT = '0xАДРЕС_КОНТРАКТА_КОЛЕСА' as `0x${string}`

const FORTUNE_WHEEL_ABI = [
  {
    "inputs": [],
    "name": "placeBet",
    "outputs": [
      {"internalType": "bool", "name": "won", "type": "bool"},
      {"internalType": "uint256", "name": "reward", "type": "uint256"}
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "bank",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLeaderboard",
    "outputs": [
      {"internalType": "address[]", "name": "addresses", "type": "address[]"},
      {"internalType": "uint256[]", "name": "totalWins", "type": "uint256[]"},
      {"internalType": "uint256[]", "name": "bestWins", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export default function FortuneWheel() {
  const [betAmount, setBetAmount] = useState('0.05')
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Читаем текущий банк
  const { data: bankData } = useReadContract({
    address: FORTUNE_WHEEL_CONTRACT,
    abi: FORTUNE_WHEEL_ABI,
    functionName: 'bank',
  })

  // Читаем лидерборд
  const { data: leaderboardData } = useReadContract({
    address: FORTUNE_WHEEL_CONTRACT,
    abi: FORTUNE_WHEEL_ABI,
    functionName: 'getLeaderboard',
  })

  const currentBank = bankData ? formatEther(bankData) : '0'

  const spinWheel = async () => {
    const betValue = parseFloat(betAmount)
    if (betValue < 0.05 || betValue > 0.5) {
      alert('⚠️ Bet must be between 0.05 and 0.5 MON')
      return
    }

    setSpinning(true)
    
    // Анимация вращения
    const spins = Math.floor(Math.random() * 5) + 5 // 5-10 оборотов
    const finalRotation = rotation + (360 * spins) + Math.random() * 360
    setRotation(finalRotation)

    try {
      writeContract({
        address: FORTUNE_WHEEL_CONTRACT,
        abi: FORTUNE_WHEEL_ABI,
        functionName: 'placeBet',
        value: parseEther(betAmount)
      })
    } catch (error) {
      console.error('Bet failed:', error)
      setSpinning(false)
    }
  }

  // Останавливаем вращение после подтверждения
  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        setSpinning(false)
      }, 3000)
    }
  }, [isConfirmed])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* Заголовок */}
      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'white' }}>
        🎡 Fortune Wheel
      </h2>

      {/* Информация о банке */}
      <div style={{ 
        background: 'rgba(251, 191, 36, 0.1)', 
        padding: '15px', 
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid rgba(251, 191, 36, 0.3)'
      }}>
        <p style={{ margin: '0', fontSize: '18px', color: 'white' }}>
          💰 <strong>Current Bank: {currentBank} MON</strong>
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: '0.8', color: 'white' }}>
          25% chance to win the entire bank!
        </p>
      </div>

      {/* Колесо */}
      <div style={{ 
        margin: '20px auto',
        width: '200px',
        height: '200px',
        border: '8px solid #fbbf24',
        borderRadius: '50%',
        background: `conic-gradient(
          #10b981 0deg 90deg,
          #ef4444 90deg 180deg,
          #10b981 180deg 270deg,
          #ef4444 270deg 360deg
        )`,
        transform: `rotate(${rotation}deg)`,
        transition: spinning ? 'transform 3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: '24px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          🎯
        </div>
      </div>

      {/* Стрелка */}
      <div style={{
        width: '0',
        height: '0',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        borderBottom: '30px solid #7c3aed',
        margin: '-130px auto 100px auto',
        position: 'relative',
        zIndex: 10
      }} />

      {/* Ставка */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'white', marginBottom: '10px', display: 'block' }}>
          Bet Amount (MON):
        </label>
        <input
          type="number"
          min="0.05"
          max="0.5"
          step="0.01"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '16px',
            textAlign: 'center',
            width: '150px'
          }}
        />
      </div>

      {/* Кнопка */}
      <button
        onClick={spinWheel}
        disabled={isPending || isConfirming || spinning}
        style={{
          background: (isPending || isConfirming || spinning) 
            ? 'linear-gradient(45deg, #6b7280, #4b5563)' 
            : 'linear-gradient(45deg, #fbbf24, #f59e0b)',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '15px',
          fontSize: '18px',
          cursor: (isPending || isConfirming || spinning) ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}
      >
        {isPending ? '⏳ Confirming...' :
         isConfirming ? '🎡 Spinning...' :
         spinning ? '🎯 Landing...' :
         '🎡 SPIN THE WHEEL!'}
      </button>

      {/* Статус */}
      {isConfirmed && (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          marginTop: '15px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <p style={{ margin: '0', fontSize: '16px', color: 'white' }}>
            🎉 <strong>Spin completed!</strong>
          </p>
        </div>
      )}
    </div>
  )
}
