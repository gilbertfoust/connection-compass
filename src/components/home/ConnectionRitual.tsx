import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ChevronRight, RotateCcw } from 'lucide-react';
import { conversationDecks } from '@/data/conversationDecks';

/**
 * Connection Ritual: 1-3 deep questions pulled from relevant decks.
 * Uses a seed based on the day to provide consistent daily questions.
 */
const ConnectionRitual = () => {
  const daySeed = Math.floor(Date.now() / 86400000);

  // Pick 3 questions from different decks, seeded by the day
  const dailyQuestions = useMemo(() => {
    const allCards = conversationDecks.flatMap((deck) =>
      deck.cards
        .filter((c) => c.level === 'deeper' || c.level === 'intimate')
        .map((card) => ({
          ...card,
          deckTitle: deck.title,
          deckEmoji: deck.emoji,
        }))
    );

    if (allCards.length === 0) return [];

    const picked = [];
    const usedDecks = new Set<string>();
    let idx = daySeed;

    for (let i = 0; i < 3 && picked.length < 3; i++) {
      const cardIdx = idx % allCards.length;
      const card = allCards[cardIdx];
      // Try to avoid repeating same deck
      if (!usedDecks.has(card.deckTitle) || i >= allCards.length) {
        picked.push(card);
        usedDecks.add(card.deckTitle);
      }
      idx = (idx * 31 + 7) % allCards.length; // Simple hash
    }

    return picked;
  }, [daySeed]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  if (dailyQuestions.length === 0) return null;

  const current = dailyQuestions[currentIdx];
  const allAnswered = answered.size >= dailyQuestions.length;

  if (allAnswered) {
    return (
      <Card className="border-0 shadow-card">
        <CardContent className="p-4 text-center space-y-2">
          <Heart className="h-6 w-6 text-primary fill-primary mx-auto" />
          <p className="text-sm font-medium text-foreground">Today's questions answered ✨</p>
          <p className="text-xs text-muted-foreground">Great conversation! Come back tomorrow for new ones.</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => { setAnswered(new Set()); setCurrentIdx(0); }}
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Start over
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-card gradient-card animate-fade-in-up">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Connection Ritual
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {currentIdx + 1} of {dailyQuestions.length}
          </span>
        </div>

        <p className="text-base font-medium text-card-foreground leading-relaxed">
          {current.question}
        </p>

        {current.followUp && (
          <p className="text-sm text-muted-foreground italic">
            Follow-up: {current.followUp}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{current.deckEmoji}</span>
            <span className="text-[10px] text-muted-foreground">{current.deckTitle}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-xs rounded-full gap-1"
            onClick={() => {
              setAnswered((prev) => new Set(prev).add(currentIdx));
              if (currentIdx < dailyQuestions.length - 1) {
                setCurrentIdx(currentIdx + 1);
              }
            }}
          >
            {currentIdx < dailyQuestions.length - 1 ? (
              <>Next <ChevronRight className="h-3 w-3" /></>
            ) : (
              'Done ✓'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionRitual;
