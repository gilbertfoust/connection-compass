import type { VisionItem } from '@/types/vision';
import VisionItemCard from './VisionItemCard';
import { Sparkles } from 'lucide-react';

interface VisionBoardGridProps {
  items: VisionItem[];
  onDelete: (id: string) => void;
  timeframeLabel: string;
}

const VisionBoardGrid = ({ items, onDelete, timeframeLabel }: VisionBoardGridProps) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <div className="p-3 rounded-full bg-muted">
          <Sparkles className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Start your {timeframeLabel}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add images, affirmations, goals, and notes to visualize your future together
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3 space-y-3">
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid">
          <VisionItemCard item={item} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};

export default VisionBoardGrid;
