export interface ConversationCard {
  id: string;
  question: string;
  followUp?: string;
  level: 'starter' | 'deeper' | 'intimate';
}

export interface ConversationDeck {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  category: string;
  cards: ConversationCard[];
}

export const conversationDecks: ConversationDeck[] = [
  {
    id: 'deep-connection',
    title: 'Deep Connection',
    description: 'Questions that bring you closer emotionally',
    emoji: '💕',
    color: 'from-primary/20 to-accent',
    category: 'communication',
    cards: [
      { id: 'dc1', question: 'What is one thing I do that makes you feel most loved?', level: 'starter' },
      { id: 'dc2', question: 'When was the last time you felt truly understood by me?', followUp: 'What made that moment special?', level: 'starter' },
      { id: 'dc3', question: 'What dream have you been holding onto that you haven\'t shared with me yet?', level: 'deeper' },
      { id: 'dc4', question: 'If we could relive one moment together, which would you choose and why?', level: 'deeper' },
      { id: 'dc5', question: 'What part of our relationship makes you feel safest?', level: 'intimate' },
      { id: 'dc6', question: 'What vulnerability are you most afraid to show me?', followUp: 'What would help you feel safe enough to share it?', level: 'intimate' },
      { id: 'dc7', question: 'How has loving me changed who you are?', level: 'deeper' },
      { id: 'dc8', question: 'What is one fear you have about our future together?', level: 'intimate' },
    ],
  },
  {
    id: 'intimacy-builders',
    title: 'Intimacy Builders',
    description: 'Deepen your physical and emotional intimacy',
    emoji: '🔥',
    color: 'from-destructive/20 to-accent',
    category: 'intimacy',
    cards: [
      { id: 'ib1', question: 'What does intimacy mean to you beyond the physical?', level: 'starter' },
      { id: 'ib2', question: 'When do you feel most desired by me?', level: 'starter' },
      { id: 'ib3', question: 'What kind of touch makes you feel most connected to me?', level: 'deeper' },
      { id: 'ib4', question: 'Is there something new you\'d like us to explore together?', level: 'deeper' },
      { id: 'ib5', question: 'What makes you feel vulnerable during intimate moments?', level: 'intimate' },
      { id: 'ib6', question: 'How can I make you feel more comfortable expressing your desires?', level: 'intimate' },
    ],
  },
  {
    id: 'fun-playful',
    title: 'Fun & Playful',
    description: 'Lighthearted questions to spark joy',
    emoji: '🎉',
    color: 'from-chart-1/20 to-chart-2/20',
    category: 'fun',
    cards: [
      { id: 'fp1', question: 'If we won the lottery tomorrow, what\'s the first thing we\'d do together?', level: 'starter' },
      { id: 'fp2', question: 'What fictional couple reminds you most of us?', level: 'starter' },
      { id: 'fp3', question: 'If you could swap lives with me for a day, what would you do first?', level: 'starter' },
      { id: 'fp4', question: 'What\'s the funniest memory we share that still makes you laugh?', level: 'starter' },
      { id: 'fp5', question: 'If we had to pick a theme song for our relationship, what would it be?', level: 'starter' },
      { id: 'fp6', question: 'What\'s my most adorable habit that I probably don\'t know about?', level: 'deeper' },
    ],
  },
  {
    id: 'healing-growth',
    title: 'Healing & Growth',
    description: 'Navigate challenges with compassion',
    emoji: '🌱',
    color: 'from-chart-5/10 to-accent',
    category: 'healing',
    cards: [
      { id: 'hg1', question: 'Is there something from our past that still needs healing between us?', level: 'deeper' },
      { id: 'hg2', question: 'What\'s one thing I could do differently that would make you feel more supported?', level: 'starter' },
      { id: 'hg3', question: 'When we disagree, what do you need most from me?', level: 'deeper' },
      { id: 'hg4', question: 'What pattern in our relationship would you most like us to change?', level: 'intimate' },
      { id: 'hg5', question: 'How can we create a safer space for hard conversations?', level: 'deeper' },
      { id: 'hg6', question: 'What forgiveness do you still need to give or receive?', level: 'intimate' },
    ],
  },
  {
    id: 'values-dreams',
    title: 'Values & Dreams',
    description: 'Align on what matters most',
    emoji: '✨',
    color: 'from-chart-3/20 to-chart-4/20',
    category: 'trust',
    cards: [
      { id: 'vd1', question: 'What does your ideal life look like in 5 years?', level: 'starter' },
      { id: 'vd2', question: 'What value do you think is most important in our relationship?', level: 'starter' },
      { id: 'vd3', question: 'If money were no object, how would we spend our days?', level: 'deeper' },
      { id: 'vd4', question: 'What legacy do you want us to create together?', level: 'deeper' },
      { id: 'vd5', question: 'What does "home" mean to you?', level: 'intimate' },
      { id: 'vd6', question: 'What tradition would you love for us to start?', level: 'starter' },
    ],
  },
  {
    id: 'getting-to-know-again',
    title: 'Rediscovery',
    description: 'Fall in love all over again',
    emoji: '🦋',
    color: 'from-primary/15 to-chart-3/20',
    category: 'communication',
    cards: [
      { id: 'gk1', question: 'What\'s something new you\'ve learned about yourself recently?', level: 'starter' },
      { id: 'gk2', question: 'What hobby or interest have you been curious about lately?', level: 'starter' },
      { id: 'gk3', question: 'What part of your life do you feel I don\'t know enough about?', level: 'deeper' },
      { id: 'gk4', question: 'How have your priorities changed since we first met?', level: 'deeper' },
      { id: 'gk5', question: 'What\'s a small pleasure that brightens your day that I might not know about?', level: 'starter' },
      { id: 'gk6', question: 'What do you wish I would ask you more often?', level: 'intimate' },
    ],
  },
  {
    id: 'conflict-reflection',
    title: 'Conflict Reflection',
    description: 'Turn conflict into growth',
    emoji: '🕊️',
    color: 'from-muted to-accent',
    category: 'healing',
    cards: [
      { id: 'cr1', question: 'When we argue, what do you wish I understood about your perspective?', level: 'deeper' },
      { id: 'cr2', question: 'What triggers your defenses most in our disagreements?', level: 'intimate' },
      { id: 'cr3', question: 'How do you prefer to reconnect after a conflict?', level: 'starter' },
      { id: 'cr4', question: 'What\'s one argument we\'ve had that taught you something valuable?', level: 'deeper' },
      { id: 'cr5', question: 'What does it feel like in your body when we\'re not getting along?', level: 'intimate' },
    ],
  },
];

export const moodFilters = ['All', 'Happy', 'Reflective', 'Playful', 'Vulnerable', 'Adventurous'] as const;
export const focusAreas = ['All', 'communication', 'trust', 'intimacy', 'fun', 'healing'] as const;
export const energyLevels = ['All', 'Low', 'Medium', 'High'] as const;
