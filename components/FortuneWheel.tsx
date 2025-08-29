'use client'
import { useState, useEffect } from 'react'
import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'

const FORTUNE_WHEEL_CONTRACT = '00x260C83cA4B11C31D2cAA18a3dc5c3D6C4cD10889' as `0x${string}`

const FORTUNE_WHEEL_ABI = [
  {
    "inputs": [],
    "name": "deposit",
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "placeBet",
    "outputs": [{"internalType": "bool", "name": "won", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdraw",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawAll",
    "stateMutability": "nonpayable",
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
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "playerBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const


export default function FortuneWheel() {
  const [betAmount, setBetAmount] = useState('0.05')
  const [depositAmount, setDepositAmount] = useState('0.1')
  const [withdrawAmount, setWithdrawAmount] = useState('0.05')
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [activeAction, setActiveAction] = useState<'deposit' | 'bet' | 'withdraw' | null>(null)

  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Читаем данные контракта
  const { data: bankData } = useReadContract({
    address: FORTUNE_WHEEL_CONTRACT,
    abi: FORTUNE_WHEEL_ABI,
    functionName: 'bank',
  })

  const { data: playerBalanceData } = useReadContract({
    address: FORTUNE_WHEEL_CONTRACT,
    abi: FORTUNE_WHEEL_ABI,
    functionName: 'playerBalance',
    args: address ? [address] : undefined,
  })

  const { data: playerStatsData } = useReadContract({
    address: FORTUNE_WHEEL_CONTRACT,
    abi: FORTUNE_WHEEL_ABI,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
  })

  const currentBank = bankData ? formatEther(bankData) : '0'
  const playerBalance = playerBalanceData ? formatEther(playerBalanceData) : '0'

  // Депозит MON
  const handleDeposit = async () => {
    const depositValue = parseFloat(depositAmount)
    if (depositValue <= 0) {
      alert('⚠️ Deposit amount must be greater than 0')
      return
    }

    setActiveAction('deposit')
    try {
      writeContract({
        address: FORTUNE_WHEEL_CONTRACT,
        abi: FORTUNE_WHEEL_ABI,
        functionName: 'deposit',
        value: parseEther(depositAmount)
      })
    } catch (error) {
      console.error('Deposit failed:', error)
      setActiveAction(null)
    }
  }

  // Ставка
  const handleBet = async () => {
    const betValue = parseFloat(betAmount)
    if (betValue < 0.05 || betValue > 0.5) {
      alert('⚠️ Bet must be between 0.05 and 0.5 MON')
      return
    }

    if (parseFloat(playerBalance) < betValue) {
      alert('⚠️ Insufficient deposited balance. Please deposit more MON.')
      return
    }

    setActiveAction('bet')
    setSpinning(true)
    
    // Анимация вращения
    const spins = Math.floor(Math.random() * 5) + 5
    const finalRotation = rotation + (360 * spins) + Math.random() * 360
    setRotation(finalRotation)

    try {
      writeContract({
        address: FORTUNE_WHEEL_CONTRACT,
        abi: FORTUNE_WHEEL_ABI,
        functionName: 'placeBet',
        args: [parseEther(betAmount)]
      })
    } catch (error) {
      console.error('Bet failed:', error)
      setSpinning(false)
      setActiveAction(null)
    }
  }

  // Вывод средств
  const handleWithdraw = async () => {
    const withdrawValue = parseFloat(withdrawAmount)
    if (withdrawValue <= 0) {
      alert('⚠️ Withdraw amount must be greater than 0')
      return
    }

    if (parseFloat(playerBalance) < withdrawValue) {
      alert('⚠️ Insufficient balance to withdraw')
      return
    }

    setActiveAction('withdraw')
    try {
      writeContract({
        address: FORTUNE_WHEEL_CONTRACT,
        abi: FORTUNE_WHEEL_ABI,
        functionName: 'withdrawUserBalance',
        args: [parseEther(withdrawAmount)]
      })
    } catch (error) {
      console.error('Withdraw failed:', error)
      setActiveAction(null)
    }
  }

  // Вывод всего баланса
  const handleWithdrawAll = async () => {
    if (parseFloat(playerBalance) <= 0) {
      alert('⚠️ No balance to withdraw')
      return
    }

    setActiveAction('withdraw')
    try {
      writeContract({
        address: FORTUNE_WHEEL_CONTRACT,
        abi: FORTUNE_WHEEL_ABI,
        functionName: 'withdrawAllBalance'
      })
    } catch (error) {
      console.error('Withdraw all failed:', error)
      setActiveAction(null)
    }
  }

  // Останавливаем действия после подтверждения
  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        setSpinning(false)
        setActiveAction(null)
      }, 2000)
    }
  }, [isConfirmed])

  const getActionStatus = () => {
    if (isPending) return '⏳ Confirm in Wallet...'
    if (isConfirming) {
      if (activeAction === 'deposit') return '💰 Processing Deposit...'
      if (activeAction === 'bet') return '🎡 Spinning Wheel...'
      if (activeAction === 'withdraw') return '💸 Processing Withdrawal...'
    }
    return null
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Заголовок */}
      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
        🎡 Fortune Wheel
      </h2>

      {/* Информация о балансах */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          background: 'rgba(251, 191, 36, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            🏦 Game Bank
          </p>
          <p style={{ margin: '0', fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
            {currentBank} MON
          </p>
        </div>

        <div style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            💼 Your Balance
          </p>
          <p style={{ margin: '0', fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
            {playerBalance} MON
          </p>
        </div>
      </div>

      {/* Секция депозита */}
      <div style={{ 
        background: 'rgba(124, 58, 237, 0.1)', 
        padding: '20px', 
        borderRadius: '15px',
        marginBottom: '20px',
        border: '1px solid rgba(124, 58, 237, 0.3)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: 'white', fontSize: '18px' }}>
          💰 Deposit MON
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="Amount to deposit"
          />
          <button
            onClick={handleDeposit}
            disabled={isPending || isConfirming}
            style={{
              background: 'linear-gradient(45deg, #7c3aed, #a855f7)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: (isPending || isConfirming) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Deposit
          </button>
        </div>
        <p style={{ margin: '0', fontSize: '12px', opacity: '0.7', color: 'white' }}>
          Deposit MON to your game balance to start playing
        </p>
      </div>

      {/* Колесо */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
      </div>

      {/* Секция ставки */}
      <div style={{ 
        background: 'rgba(251, 191, 36, 0.1)', 
        padding: '20px', 
        borderRadius: '15px',
        marginBottom: '20px',
        border: '1px solid rgba(251, 191, 36, 0.3)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: 'white', fontSize: '18px' }}>
          🎯 Place Bet (Win x2!)
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="number"
            min="0.05"
            max="0.5"
            step="0.01"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="0.05 - 0.5 MON"
          />
          <button
            onClick={handleBet}
            disabled={isPending || isConfirming || parseFloat(playerBalance) < parseFloat(betAmount)}
            style={{
              background: (isPending || isConfirming || parseFloat(playerBalance) < parseFloat(betAmount)) 
                ? 'linear-gradient(45deg, #6b7280, #4b5563)' 
                : 'linear-gradient(45deg, #fbbf24, #f59e0b)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: (isPending || isConfirming || parseFloat(playerBalance) < parseFloat(betAmount)) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            🎡 SPIN!
          </button>
        </div>
        <p style={{ margin: '0', fontSize: '12px', opacity: '0.7', color: 'white' }}>
          25% chance to win x2 your bet! Min: 0.05 MON, Max: 0.5 MON
        </p>
      </div>

      {/* Секция вывода */}
      <div style={{ 
        background: 'rgba(16, 185, 129, 0.1)', 
        padding: '20px', 
        borderRadius: '15px',
        marginBottom: '20px',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: 'white', fontSize: '18px' }}>
          💸 Withdraw MON
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="Amount to withdraw"
          />
          <button
            onClick={handleWithdraw}
            disabled={isPending || isConfirming}
            style={{
              background: 'linear-gradient(45deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: (isPending || isConfirming) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Withdraw
          </button>
        </div>
        <button
          onClick={handleWithdrawAll}
          disabled={isPending || isConfirming || parseFloat(playerBalance) <= 0}
          style={{
            background: parseFloat(playerBalance) <= 0 
              ? 'rgba(107, 114, 128, 0.5)' 
              : 'rgba(16, 185, 129, 0.3)',
            color: 'white',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: (isPending || isConfirming || parseFloat(playerBalance) <= 0) ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            width: '100%'
          }}
        >
          Withdraw All Balance ({playerBalance} MON)
        </button>
      </div>

      {/* Статус */}
      {getActionStatus() && (
        <div style={{ 
          background: 'rgba(124, 58, 237, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', fontSize: '16px', color: 'white' }}>
            {getActionStatus()}
          </p>
        </div>
      )}

      {/* Статистика игрока */}
      {playerStatsData && (
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          marginTop: '20px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: 'white', fontSize: '16px' }}>
            📊 Your Stats
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '14px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>Games Played</div>
              <div style={{ color: 'white', fontWeight: 'bold' }}>{playerStatsData[1]?.toString()}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>Total Wins</div>
              <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                {parseFloat(formatEther(playerStatsData[0] || BigInt(0))).toFixed(3)} MON
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>Best Win</div>
              <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                {parseFloat(formatEther(playerStatsData[2] || BigInt(0))).toFixed(3)} MON
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
