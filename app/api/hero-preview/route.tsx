import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: '200px', marginBottom: '40px' }}>
          🦸‍♂️
        </div>
        <h1 style={{ 
          fontSize: '120px', 
          fontWeight: 'bold', 
          margin: '0 0 30px 0',
          textAlign: 'center',
        }}>
          MonadHero
        </h1>
        <p style={{ 
          fontSize: '50px', 
          margin: '0 0 40px 0',
          textAlign: 'center',
          opacity: 0.9,
        }}>
          Blockchain Achievement Badges
        </p>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          fontSize: '40px',
          gap: '20px',
        }}>
          <div>🔗 Connect Wallet & Analyze Activity</div>
          <div>🎖️ Mint Exclusive Hero NFT Badges</div>
          <div>💎 Only 0.001 MON per mint</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800, // Соотношение 3:2 для Farcaster
    }
  );
}
