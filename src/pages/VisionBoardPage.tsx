import { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { useVisionBoard } from '@/hooks/useVisionBoard';
import { TIMEFRAMES, type Timeframe } from '@/types/vision';
import TimeframeSelector from '@/components/vision/TimeframeSelector';
import VisionBoardGrid from '@/components/vision/VisionBoardGrid';
import AddVisionItemForm from '@/components/vision/AddVisionItemForm';
import StarterPrompts from '@/components/vision/StarterPrompts';
import { Badge } from '@/components/ui/badge';

const VisionBoardPage = () => {
  const { items, addItem, deleteItem, getItemsByTimeframe, getCounts } = useVisionBoard();
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1-year');
  const counts = getCounts();

  const currentItems = getItemsByTimeframe(activeTimeframe);
  const activeLabel = TIMEFRAMES.find((tf) => tf.value === activeTimeframe)?.label ?? '';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Vision Board
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Dream together, build together
          </p>
        </div>
        {counts.total > 0 && (
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            {counts.total} items
          </Badge>
        )}
      </div>

      {/* Timeframe tabs */}
      <TimeframeSelector
        selected={activeTimeframe}
        onSelect={setActiveTimeframe}
        counts={counts}
      />

      {/* Add form */}
      <AddVisionItemForm onAdd={addItem} defaultTimeframe={activeTimeframe} />

      {/* Board grid */}
      <VisionBoardGrid
        items={currentItems}
        onDelete={deleteItem}
        timeframeLabel={activeLabel}
      />

      {/* Starter prompts when board is sparse */}
      {currentItems.length < 3 && (
        <StarterPrompts
          onSelect={(text) => addItem('text', text, activeTimeframe)}
        />
      )}
    </div>
  );
};

export default VisionBoardPage;
