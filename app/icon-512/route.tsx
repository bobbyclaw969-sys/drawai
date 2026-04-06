import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#0f1a0f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 96,
          gap: 0,
        }}
      >
        <div style={{ fontSize: 300, lineHeight: 1 }}>🎯</div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
