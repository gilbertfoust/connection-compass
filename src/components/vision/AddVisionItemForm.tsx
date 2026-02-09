import { useState, useRef } from 'react';
import { Plus, Image, Heart, Target, StickyNote, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ITEM_TYPES, TIMEFRAMES, type VisionItemType, type Timeframe } from '@/types/vision';

interface AddVisionItemFormProps {
  onAdd: (type: VisionItemType, content: string, timeframe: Timeframe, imageUrl?: string) => void;
  onUploadImage?: (file: File) => Promise<string | null>;
  defaultTimeframe?: Timeframe;
}

const typeIcons: Record<VisionItemType, typeof Heart> = {
  image: Image,
  affirmation: Heart,
  goal: Target,
  text: StickyNote,
};

const AddVisionItemForm = ({ onAdd, onUploadImage, defaultTimeframe = '1-year' }: AddVisionItemFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<VisionItemType>('affirmation');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [timeframe, setTimeframe] = useState<Timeframe>(defaultTimeframe);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onAdd(type, content.trim(), timeframe, type === 'image' ? imageUrl.trim() : undefined);
    setContent('');
    setImageUrl('');
    setIsOpen(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    setUploading(true);
    const url = await onUploadImage(file);
    if (url) {
      setImageUrl(url);
    }
    setUploading(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

        {/* Image input */}
        {type === 'image' && (
          <div className="space-y-2">
            {/* Toggle between upload and URL */}
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
              <button
                onClick={() => setImageMode('upload')}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                  imageMode === 'upload' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                📱 Upload
              </button>
              <button
                onClick={() => setImageMode('url')}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                  imageMode === 'url' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                🔗 URL
              </button>
            </div>

            {imageMode === 'upload' ? (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {imageUrl ? (
                  <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 bg-background/80 text-xs px-2 py-1 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        <span className="text-xs text-muted-foreground">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Tap to upload an image</span>
                        <span className="text-[10px] text-muted-foreground/60">JPG, PNG, WebP</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <Input
                placeholder="Paste an image URL…"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="text-sm"
              />
            )}
          </div>
        )}

        {/* Content input */}
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
          <Button onClick={handleSubmit} disabled={!content.trim() || uploading} size="sm" className="flex-1">
            Add
          </Button>
          <Button onClick={() => { setIsOpen(false); setImageUrl(''); }} variant="ghost" size="sm">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddVisionItemForm;
