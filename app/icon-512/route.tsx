import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#0F0D0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 307,
          fontFamily: 'serif',
          fontWeight: 700,
          color: '#D4852A',
          lineHeight: 1,
        }}
      >
        ◎
      </div>
    ),
    { width: 512, height: 512 }
  );
}
