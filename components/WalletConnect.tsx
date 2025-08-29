'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect } from 'react'

interface WalletConnectProps {
  onAddressChange: (address: string | undefined) => void
}

export default function WalletConnect({ onAddressChange }: WalletConnectProps) {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    onAddressChange(address)
  }, [address, onAddressChange])

  if (isConnected) {
    return (
      <div style={{ 
        background: 'rgba(16, 185, 129, 0.1)', 
        padding: '15px', 
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: 'white' }}>
          💼 <strong style={{ color: '#10b981' }}>Wallet Connected</strong>
        </p>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontFamily: 'monospace' }}>
          {address?.slice(0, 10)}...{address?.slice(-8)}
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
    )
  }

  return (
    <div style={{ 
      background: 'rgba(251, 191, 36, 0.1)', 
      padding: '15px', 
      borderRadius: '12px',
      marginBottom: '20px',
      border: '1px solid rgba(251, 191, 36, 0.3)'
    }}>
      <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'white' }}>
        💰 <strong style={{ color: '#fbbf24' }}>Connect Farcaster Wallet</strong>
      </p>
      <button
        onClick={() => connect({ connector: connectors[0] })}
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
        🔗 Connect Wallet
      </button>
    </div>
  )
}
