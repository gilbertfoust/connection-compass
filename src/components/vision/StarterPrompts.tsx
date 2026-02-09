import { Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const STARTER_PROMPTS = [
  { emoji: '🏠', text: 'Where do we see ourselves living?' },
  { emoji: '✈️', text: 'What trip would we love to take together?' },
  { emoji: '💰', text: 'What financial milestone excites us?' },
  { emoji: '👨‍👩‍👧‍👦', text: 'How do we picture our family evolving?' },
  { emoji: '🎯', text: 'What shared hobby or skill do we want to master?' },
  { emoji: '💜', text: 'Write an affirmation about your love story' },
];

interface StarterPromptsProps {
  onSelect: (text: string) => void;
}

const StarterPrompts = ({ onSelect }: StarterPromptsProps) => {
  return (
    <Card className="bg-muted/30 border-dashed">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Need inspiration?
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => onSelect(prompt.text)}
              className="flex items-center gap-2 text-left p-2 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span>{prompt.emoji}</span>
              <span>{prompt.text}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StarterPrompts;
