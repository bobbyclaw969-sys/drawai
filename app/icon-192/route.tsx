import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: '#0F0D0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 115,
          fontFamily: 'serif',
          fontWeight: 700,
          color: '#D4852A',
          lineHeight: 1,
        }}
      >
        ◎
      </div>
    ),
    { width: 192, height: 192 }
  );
}
