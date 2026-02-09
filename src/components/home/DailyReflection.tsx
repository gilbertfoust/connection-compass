import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PenLine, Check } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const todayKey = () => `reflection-${new Date().toISOString().split('T')[0]}`;

const DailyReflection = () => {
  const [savedReflection, setSavedReflection] = useLocalStorage<string | null>(todayKey(), null);
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    if (text.trim()) {
      setSavedReflection(text.trim());
      setText('');
      setEditing(false);
    }
  };

  if (savedReflection && !editing) {
    return (
      <Card className="border-0 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                Today's Reflection
              </p>
              <p className="text-sm text-foreground italic">"{savedReflection}"</p>
            </div>
            <button
              onClick={() => { setEditing(true); setText(savedReflection); }}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              Edit
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-card">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Evening Reflection
          </span>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's one thing you're grateful for about your relationship today?"
          className="text-sm min-h-[60px] resize-none"
          rows={2}
        />
        <div className="flex justify-end gap-2">
          {editing && (
            <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setText(''); }}>
              Cancel
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={!text.trim()} className="rounded-full">
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyReflection;
