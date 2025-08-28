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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#7c3aed',
          fontSize: '512px',
        }}
      >
        🦸‍♂️
      </div>
    ),
    {
      width: 1024,
      height: 1024,
    }
  );
}
