import { Sparkles, Loader2, Wand2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface GeneratedBoard {
  title: string;
  description: string;
  imageUrl: string | null;
  imagePrompt: string;
}

interface GeneratedVisionBoardProps {
  isGenerating: boolean;
  generatedBoard: GeneratedBoard | null;
  onGenerate: () => void;
  onClear: () => void;
  hasItems: boolean;
}

const GeneratedVisionBoard = ({
  isGenerating,
  generatedBoard,
  onGenerate,
  onClear,
  hasItems,
}: GeneratedVisionBoardProps) => {
  if (generatedBoard) {
    return (
      <Card className="overflow-hidden border-primary/20">
        {generatedBoard.imageUrl && (
          <AspectRatio ratio={1}>
            <img
              src={generatedBoard.imageUrl}
              alt={generatedBoard.title}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        )}
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                {generatedBoard.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {generatedBoard.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={onClear}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            <Wand2 className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-primary/20">
      <CardContent className="p-5 flex flex-col items-center text-center gap-3">
        <div className="p-3 rounded-full bg-primary/10">
          <Wand2 className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Generate Your Vision Board
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
            {hasItems
              ? "Combine all your items into a beautiful AI-generated vision board collage"
              : "Add some items first, then generate a cohesive vision board from your shared dreams"}
          </p>
        </div>
        <Button
          onClick={onGenerate}
          disabled={isGenerating || !hasItems}
          size="sm"
          className="gap-1.5"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Creating your board…
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Generate Board
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GeneratedVisionBoard;
