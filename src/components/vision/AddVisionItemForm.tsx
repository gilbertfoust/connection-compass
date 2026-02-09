import { useState } from 'react';
import { Plus, Image, Heart, Target, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ITEM_TYPES, TIMEFRAMES, type VisionItemType, type Timeframe } from '@/types/vision';

interface AddVisionItemFormProps {
  onAdd: (type: VisionItemType, content: string, timeframe: Timeframe, imageUrl?: string) => void;
  defaultTimeframe?: Timeframe;
}

const typeIcons: Record<VisionItemType, typeof Heart> = {
  image: Image,
  affirmation: Heart,
  goal: Target,
  text: StickyNote,
};

const AddVisionItemForm = ({ onAdd, defaultTimeframe = '1-year' }: AddVisionItemFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<VisionItemType>('affirmation');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [timeframe, setTimeframe] = useState<Timeframe>(defaultTimeframe);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onAdd(type, content.trim(), timeframe, type === 'image' ? imageUrl.trim() : undefined);
    setContent('');
    setImageUrl('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full gap-2"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
        Add to Your Vision Board
      </Button>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-4 space-y-3">
        {/* Type selector */}
        <div className="grid grid-cols-4 gap-1.5">
          {ITEM_TYPES.map((item) => {
            const Icon = typeIcons[item.value];
            return (
              <button
                key={item.value}
                onClick={() => setType(item.value)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all ${
                  type === item.value
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Timeframe */}
        <Select value={timeframe} onValueChange={(v) => setTimeframe(v as Timeframe)}>
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEFRAMES.map((tf) => (
              <SelectItem key={tf.value} value={tf.value}>
                {tf.emoji} {tf.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Content input */}
        {type === 'image' && (
          <Input
            placeholder="Paste an image URL…"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="text-sm"
          />
        )}

        <Textarea
          placeholder={
            type === 'affirmation'
              ? '"We choose each other every day…"'
              : type === 'goal'
              ? 'What do you dream of achieving together?'
              : type === 'image'
              ? 'Add a caption for this image…'
              : 'Write a note for your vision board…'
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="text-sm resize-none"
        />

        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={!content.trim()} size="sm" className="flex-1">
            Add
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddVisionItemForm;
