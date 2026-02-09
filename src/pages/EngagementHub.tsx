import { useState } from 'react';
import { conversationDecks } from '@/data/conversationDecks';
import DeckCard from '@/components/engagement/DeckCard';
import FilterBar from '@/components/engagement/FilterBar';
import ConversationCardView from '@/components/engagement/ConversationCardView';
import type { ConversationDeck } from '@/data/conversationDecks';

const EngagementHub = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeDeck, setActiveDeck] = useState<ConversationDeck | null>(null);

  const filteredDecks =
    activeFilter === 'All'
      ? conversationDecks
      : conversationDecks.filter((d) => d.category === activeFilter);

  if (activeDeck) {
    return <ConversationCardView deck={activeDeck} onClose={() => setActiveDeck(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1">
        <span className="text-xs font-semibold">{conversationDecks.reduce((s, d) => s + d.cards.length, 0)}+ questions</span>
        <span className="text-xs">across {conversationDecks.length} decks</span>
      </div>

      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="space-y-3">
        {filteredDecks.map((deck, i) => (
          <DeckCard key={deck.id} deck={deck} index={i} onClick={() => setActiveDeck(deck)} />
        ))}
      </div>

      {filteredDecks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No decks match this filter. Try another category!
        </div>
      )}
    </div>
  );
};

export default EngagementHub;
