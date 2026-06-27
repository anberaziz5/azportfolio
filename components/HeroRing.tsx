'use client';
export default function HeroRing() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        border: '2px solid #F6821F',
        boxShadow: '0 0 60px rgba(246,130,31,0.3), inset 0 0 60px rgba(246,130,31,0.1)',
        animation: 'ringRotate 20s linear infinite',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Inner rings for depth effect */}
      <div style={{
        position: 'absolute',
        top: '10%', left: '10%',
        right: '10%', bottom: '10%',
        borderRadius: '50%',
        border: '1px solid rgba(246,130,31,0.4)',
        animation: 'ringRotate 15s linear infinite reverse',
      }} />
      <div style={{
        position: 'absolute',
        top: '20%', left: '20%',
        right: '20%', bottom: '20%',
        borderRadius: '50%',
        border: '1px solid rgba(246,130,31,0.2)',
        animation: 'ringRotate 10s linear infinite',
      }} />
      <style>{`
        @keyframes ringRotate {
          from { transform: rotateX(75deg) rotateZ(0deg); }
          to   { transform: rotateX(75deg) rotateZ(360deg); }
        }
      `}</style>
    </div>
  );
}
