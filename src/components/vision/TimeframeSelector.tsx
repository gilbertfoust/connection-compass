import { TIMEFRAMES, type Timeframe } from '@/types/vision';
import { Badge } from '@/components/ui/badge';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onSelect: (tf: Timeframe) => void;
  counts: Record<Timeframe, number>;
}

const TimeframeSelector = ({ selected, onSelect, counts }: TimeframeSelectorProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onSelect(tf.value)}
          className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            selected === tf.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted'
          }`}
        >
          <span>{tf.emoji}</span>
          <span>{tf.label}</span>
          {counts[tf.value] > 0 && (
            <Badge
              variant={selected === tf.value ? 'secondary' : 'outline'}
              className="h-5 min-w-5 justify-center text-[10px] px-1.5"
            >
              {counts[tf.value]}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
};

export default TimeframeSelector;
