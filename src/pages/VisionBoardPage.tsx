import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useVisionBoard } from '@/hooks/useVisionBoard';
import { useVisionBoardAI } from '@/hooks/useVisionBoardAI';
import { TIMEFRAMES, type Timeframe } from '@/types/vision';
import { Badge } from '@/components/ui/badge';
import TimeframeSelector from '@/components/vision/TimeframeSelector';
import VisionBoardGrid from '@/components/vision/VisionBoardGrid';
import AddVisionItemForm from '@/components/vision/AddVisionItemForm';
import StarterPrompts from '@/components/vision/StarterPrompts';
import GeneratedVisionBoard from '@/components/vision/GeneratedVisionBoard';

const VisionBoardPage = () => {
  const { items, addItem, deleteItem, getItemsByTimeframe, getCounts, uploadImage } = useVisionBoard();
  const { isGenerating, generatedBoard, generateBoard, clearBoard } = useVisionBoardAI();
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1-year');
  const counts = getCounts();

  const currentItems = getItemsByTimeframe(activeTimeframe);
  const activeLabel = TIMEFRAMES.find((tf) => tf.value === activeTimeframe)?.label ?? '';

  return (
    <div className="space-y-4">
      {counts.total > 0 && (
        <div className="flex justify-end">
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            {counts.total} items
          </Badge>
        </div>
      )}

      <GeneratedVisionBoard
        isGenerating={isGenerating}
        generatedBoard={generatedBoard}
        onGenerate={generateBoard}
        onClear={clearBoard}
        hasItems={counts.total > 0}
      />

      <TimeframeSelector
        selected={activeTimeframe}
        onSelect={setActiveTimeframe}
        counts={counts}
      />

      <AddVisionItemForm onAdd={addItem} onUploadImage={uploadImage} defaultTimeframe={activeTimeframe} />

      <VisionBoardGrid
        items={currentItems}
        onDelete={deleteItem}
        timeframeLabel={activeLabel}
      />

      {currentItems.length < 3 && (
        <StarterPrompts
          onSelect={(text) => addItem('text', text, activeTimeframe)}
        />
      )}
    </div>
  );
};

export default VisionBoardPage;
