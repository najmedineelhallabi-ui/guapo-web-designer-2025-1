import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #9333ea 0%, #c026d3 50%, #06b6d4 100%)',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          G
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
