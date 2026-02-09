import { useAuth } from '@/contexts/AuthContext';

const CherryBlossomBackground = () => {
  const { profile } = useAuth();
  const isMasculine = profile?.gender === 'male';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
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
