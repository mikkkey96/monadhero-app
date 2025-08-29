'use client'

import { useState } from 'react'

export default function MonadHero() {
  const [connected, setConnected] = useState(false)

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '32px', margin: '0 0 20px 0' }}>
        🦸‍♂️ MonadHero
      </h1>
      
      <p style={{ fontSize: '18px', margin: '0 0 30px 0', opacity: '0.9' }}>
        Your Blockchain Achievement Badge System
      </p>

      {!connected ? (
        <div style={{ 
          background: 'rgba(251, 191, 36, 0.1)', 
          padding: '30px', 
          borderRadius: '15px',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            💰 Ready to discover your hero level?
          </p>
          
          <button
            onClick={() => setConnected(true)}
            style={{
              background: 'linear-gradient(45deg, #7c3aed, #a855f7)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔗 Connect Wallet
          </button>
        </div>
      ) : (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          padding: '30px', 
          borderRadius: '15px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚡</div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>EPIC HERO</h2>
          <p style={{ fontSize: '16px', marginBottom: '20px', opacity: '0.9' }}>
            Powerful Network Champion
          </p>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '10px 20px', 
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '20px'
          }}>
            🏆 Score: 850 • Badges: 3
          </div>
          
          <div>
            <button
              style={{
                background: 'linear-gradient(45deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '10px'
              }}
            >
              🎖️ Mint Badge (0.001 MON)
            </button>
            
            <button
              onClick={() => setConnected(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '12px 25px',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
