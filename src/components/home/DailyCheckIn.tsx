import { Card, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🥰', label: 'Loved' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😔', label: 'Down' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '✨', label: 'Energized' },
];

const todayKey = () => `checkin-${new Date().toISOString().split('T')[0]}`;

const DailyCheckIn = () => {
  const [mood, setMood] = useLocalStorage<string | null>(todayKey(), null);

  if (mood) {
    const selected = MOODS.find((m) => m.label === mood);
    return (
      <Card className="border-0 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selected?.emoji ?? '✅'}</span>
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">Today's Check-In</p>
              <p className="text-sm text-foreground mt-0.5">
                You're feeling <span className="font-semibold">{mood}</span> today
              </p>
            </div>
            <button
              onClick={() => setMood(null)}
              className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Change
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-card gradient-card animate-fade-in-up">
      <CardContent className="p-4 space-y-3">
        <p className="text-xs font-medium text-primary uppercase tracking-wider">
          How are you feeling today?
        </p>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.label}
              onClick={() => setMood(m.label)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-accent transition-colors"
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCheckIn;
