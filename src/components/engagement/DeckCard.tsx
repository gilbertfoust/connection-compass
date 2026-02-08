import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import type { ConversationDeck } from '@/data/conversationDecks';

interface DeckCardProps {
  deck: ConversationDeck;
  onClick: () => void;
  index: number;
}

const DeckCard = ({ deck, onClick, index }: DeckCardProps) => {
  return (
    <Card
      className="border-0 shadow-card cursor-pointer hover:shadow-glow transition-all duration-300 overflow-hidden group"
      onClick={onClick}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${deck.color} flex items-center justify-center text-xl shrink-0`}>
            {deck.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground text-sm">{deck.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{deck.description}</p>
            <span className="text-[10px] text-muted-foreground">{deck.cards.length} questions</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckCard;
