'use client'
import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'

const FORTUNE_WHEEL_CONTRACT = '0xАДРЕС_КОНТРАКТА_КОЛЕСА' as `0x${string}`

const FORTUNE_WHEEL_ABI = [
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

export default function Leaderboard() {
  const { data: leaderboardData, isLoading } = useReadContract({
    address: FORTUNE_WHEEL_CONTRACT,
    abi: FORTUNE_WHEEL_ABI,
    functionName: 'getLeaderboard',
  })

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: 'white' }}>Loading leaderboard...</div>
      </div>
    )
  }

  const [addresses, totalWins, bestWins] = leaderboardData || [[], [], []]

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
        🏆 Leaderboard
      </h2>

      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '15px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        {/* Заголовки */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px 1fr 120px 120px',
          gap: '15px',
          padding: '15px',
          background: 'rgba(124, 58, 237, 0.2)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          <div>#</div>
          <div>Player</div>
          <div>Total Wins</div>
          <div>Best Win</div>
        </div>

        {/* Данные */}
        {addresses.length > 0 ? (
          addresses.map((address: string, index: number) => (
            <div
              key={address}
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 1fr 120px 120px',
                gap: '15px',
                padding: '15px',
                borderBottom: index < addresses.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <div style={{ fontWeight: 'bold', color: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#d97706' : 'white' }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>
              <div style={{ fontFamily: 'monospace' }}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
              <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                {parseFloat(formatEther(totalWins[index] || BigInt(0))).toFixed(3)} MON
              </div>
              <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>
                {parseFloat(formatEther(bestWins[index] || BigInt(0))).toFixed(3)} MON
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
            No players yet. Be the first to spin! 🎡
          </div>
        )}
      </div>
    </div>
  )
}
