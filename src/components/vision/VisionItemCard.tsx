import { Trash2, Image, Heart, Target, StickyNote, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { VisionItem, VisionItemType } from '@/types/vision';

interface VisionItemCardProps {
  item: VisionItem;
  onDelete: (id: string) => void;
}

const typeIcons: Record<VisionItemType, typeof Heart> = {
  image: Image,
  affirmation: Heart,
  goal: Target,
  text: StickyNote,
};

const VisionItemCard = ({ item, onDelete }: VisionItemCardProps) => {
  const Icon = typeIcons[item.type];

  if (item.type === 'image' && item.imageUrl) {
    return (
      <Card className={`overflow-hidden group relative ${item.color ?? ''}`}>
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={item.imageUrl}
            alt={item.content}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <CardContent className="p-3">
          <p className="text-xs text-foreground leading-relaxed">{item.content}</p>
        </CardContent>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </Card>
    );
  }

  if (item.type === 'affirmation') {
    return (
      <Card className={`group relative ${item.color ?? ''}`}>
        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
          <Quote className="h-4 w-4 text-primary/60" />
          <p className="text-sm font-medium text-foreground italic leading-relaxed">
            {item.content}
          </p>
          <Heart className="h-3.5 w-3.5 text-primary fill-primary/30" />
        </CardContent>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className={`group relative ${item.color ?? ''}`}>
      <CardContent className="p-3 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {item.type}
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{item.content}</p>
      </CardContent>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 className="h-3 w-3 text-destructive" />
      </Button>
    </Card>
  );
};

export default VisionItemCard;
