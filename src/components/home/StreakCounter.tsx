import { Flame } from 'lucide-react';

const StreakCounter = () => {
  const streak = 7; // placeholder

  return (
    <div className="flex items-center gap-2 bg-accent rounded-2xl px-4 py-2.5">
      <Flame className="h-5 w-5 text-accent-foreground" />
      <div>
        <span className="text-lg font-bold text-accent-foreground">{streak}</span>
        <span className="text-xs text-accent-foreground/70 ml-1">day streak</span>
      </div>
    </div>
  );
};

export default StreakCounter;
