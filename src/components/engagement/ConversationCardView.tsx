import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Shuffle, X } from 'lucide-react';
import type { ConversationDeck } from '@/data/conversationDecks';

interface ConversationCardViewProps {
  deck: ConversationDeck;
  onClose: () => void;
}

const levelColors = {
  starter: 'bg-chart-1/10 text-chart-1',
  deeper: 'bg-primary/10 text-primary',
  intimate: 'bg-destructive/10 text-destructive',
};

const levelLabels = {
  starter: 'Starter',
  deeper: 'Deeper',
  intimate: 'Intimate',
};

const ConversationCardView = ({ deck, onClose }: ConversationCardViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const card = deck.cards[currentIndex];

  const goNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipping(false);
      }, 200);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setIsFlipping(false);
      }, 200);
    }
  };

  const shuffle = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex(Math.floor(Math.random() * deck.cards.length));
      setIsFlipping(false);
    }, 200);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-accent transition-colors">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="text-center">
          <span className="text-lg">{deck.emoji}</span>
          <h2 className="text-sm font-semibold text-foreground">{deck.title}</h2>
        </div>
        <div className="w-9" />
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {deck.cards.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= currentIndex ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <Card
        className={`border-0 shadow-glow min-h-[280px] flex items-center justify-center transition-all duration-200 ${
          isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}
      >
        <CardContent className="p-8 text-center">
          <span className={`inline-block text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded-full mb-6 ${levelColors[card.level]}`}>
            {levelLabels[card.level]}
          </span>
          <p className="text-lg font-medium text-card-foreground leading-relaxed">
            {card.question}
          </p>
          {card.followUp && (
            <p className="text-sm text-muted-foreground mt-4 italic">
              {card.followUp}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3">
          <button
            onClick={shuffle}
            className="p-2.5 rounded-full bg-accent hover:bg-accent/80 transition-colors"
          >
            <Shuffle className="h-4 w-4 text-accent-foreground" />
          </button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {deck.cards.length}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goNext}
          disabled={currentIndex === deck.cards.length - 1}
          className="rounded-full"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationCardView;
