import { useAuth } from '@/contexts/AuthContext';

const CherryBlossomBackground = () => {
  const { profile } = useAuth();
  const isMasculine = profile?.gender === 'male';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deeper gradient base for contrast against cards */}
      <div
        className="absolute inset-0"
        style={{
          background: isMasculine
            ? 'linear-gradient(135deg, hsl(220 15% 88%), hsl(240 5% 82%), hsl(220 12% 85%))'
            : 'linear-gradient(135deg, hsl(333 30% 90%), hsl(240 8% 88%), hsl(351 25% 89%))',
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute rounded-full blur-3xl animate-pulse-soft"
        style={{
          width: '20rem',
          height: '20rem',
          top: '10%',
          left: '-5%',
          background: isMasculine
            ? 'hsl(350 45% 40% / 0.15)'
            : 'hsl(333 71% 50% / 0.15)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '16rem',
          height: '16rem',
          top: '50%',
          right: '-8%',
          background: isMasculine
            ? 'hsl(220 20% 35% / 0.12)'
            : 'hsl(351 94% 71% / 0.12)',
          animation: 'pulse-soft 5s ease-in-out infinite 1.5s',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '24rem',
          height: '24rem',
          bottom: '5%',
          left: '30%',
          background: isMasculine
            ? 'hsl(350 45% 40% / 0.10)'
            : 'hsl(327 87% 81% / 0.14)',
          animation: 'pulse-soft 7s ease-in-out infinite 3s',
        }}
      />

      {/* More defined floating petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`petal petal-${i + 1} ${isMasculine ? 'petal-masculine' : ''}`}
        />
      ))}
    </div>
  );
};

export default CherryBlossomBackground;
