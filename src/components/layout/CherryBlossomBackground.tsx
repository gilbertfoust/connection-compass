import { useAuth } from '@/contexts/AuthContext';

const CherryBlossomBackground = () => {
  const { profile } = useAuth();
  const isMasculine = profile?.gender === 'male';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Warm gradient base */}
      <div className="absolute inset-0 gradient-soft opacity-60" />

      {/* Glow orbs */}
      <div
        className="absolute rounded-full blur-3xl animate-pulse-soft"
        style={{
          width: '20rem',
          height: '20rem',
          top: '10%',
          left: '-5%',
          background: isMasculine
            ? 'hsl(350 45% 40% / 0.12)'
            : 'hsl(333 71% 50% / 0.12)',
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
            ? 'hsl(220 20% 35% / 0.10)'
            : 'hsl(351 94% 71% / 0.10)',
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
            ? 'hsl(350 45% 40% / 0.08)'
            : 'hsl(327 87% 81% / 0.10)',
          animation: 'pulse-soft 7s ease-in-out infinite 3s',
        }}
      />

      {/* Subtle floating petals */}
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
