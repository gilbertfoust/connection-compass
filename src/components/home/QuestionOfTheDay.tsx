import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, RefreshCw } from 'lucide-react';
import { conversationDecks } from '@/data/conversationDecks';

const allQuestions = conversationDecks.flatMap((deck) =>
  deck.cards.map((card) => ({
    ...card,
    deckTitle: deck.title,
    deckEmoji: deck.emoji,
  }))
);

const QuestionOfTheDay = () => {
  const [currentIndex, setCurrentIndex] = useState(
    () => Math.floor(Date.now() / 86400000) % allQuestions.length
  );

  const question = allQuestions[currentIndex];

  const refresh = () => {
    setCurrentIndex((prev) => (prev + 1) % allQuestions.length);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-card gradient-card animate-fade-in-up">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Question of the Day
            </span>
          </div>
          <button
            onClick={refresh}
            className="p-1.5 rounded-full hover:bg-accent transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
        <p className="text-base font-medium text-card-foreground leading-relaxed">
          {question.question}
        </p>
        {question.followUp && (
          <p className="text-sm text-muted-foreground mt-2 italic">
            Follow-up: {question.followUp}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm">{question.deckEmoji}</span>
          <span className="text-xs text-muted-foreground">{question.deckTitle}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionOfTheDay;
