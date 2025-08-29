'use client'

export default function Home() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>
        🦸‍♂️ MonadHero
      </h1>
      
      <p style={{ fontSize: '24px', margin: '0 0 40px 0', opacity: '0.9' }}>
        Your Blockchain Achievement Badge System
      </p>

      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '40px', 
        borderRadius: '20px',
        maxWidth: '500px',
        margin: '0 auto',
        border: '2px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚡</div>
        <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>EPIC HERO</h2>
        <p style={{ fontSize: '18px', marginBottom: '30px', opacity: '0.8' }}>
          Ready to mint your exclusive Hero NFT badge!
        </p>
        
        <button style={{
          background: 'linear-gradient(45deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '12px',
          fontSize: '18px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          🎖️ Mint Hero Badge
        </button>
      </div>

      <p style={{ fontSize: '14px', marginTop: '30px', opacity: '0.6' }}>
        ✅ MonadHero is live! Ready for blockchain integration.
      </p>
    </div>
  )
}
