import { useState } from 'react';
import { Send, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface InsightInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const promptSuggestions = [
  "We had a disagreement about finances and couldn't find common ground...",
  "We've been feeling disconnected lately and spending more time apart...",
  "We had a great weekend together but want to keep the momentum going...",
  "One of us feels unheard during important conversations...",
];

const InsightInput = ({ onSubmit, isLoading }: InsightInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim().length >= 20) {
      onSubmit(text.trim());
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              What's on your mind?
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Share what's been happening in your relationship — a recent conversation, a feeling, or a situation — and we'll suggest activities and prompts tailored to where you are right now.
          </p>
          <Textarea
            placeholder="Tell us what's been going on between you two..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] resize-none border-border/50 bg-background/50 text-sm"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-[10px] text-muted-foreground">
              {text.length < 20 ? `${20 - text.length} more characters needed` : '✓ Ready'}
            </span>
            <Button
              onClick={handleSubmit}
              disabled={text.trim().length < 20 || isLoading}
              size="sm"
              className="gap-1.5"
            >
              {isLoading ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Get Suggestions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!isLoading && text.length === 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground px-1">Try something like:</p>
          <div className="grid gap-2">
            {promptSuggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setText(suggestion)}
                className="text-left text-xs p-3 rounded-xl bg-card border border-border/30 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all duration-200"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightInput;
