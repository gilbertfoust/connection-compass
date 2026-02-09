export type LoveLanguageKey =
  | 'words_of_affirmation'
  | 'acts_of_service'
  | 'receiving_gifts'
  | 'quality_time'
  | 'physical_touch';

export interface LoveLanguageResult {
  id: string;
  user_id: string;
  couple_id: string;
  words_of_affirmation: number;
  acts_of_service: number;
  receiving_gifts: number;
  quality_time: number;
  physical_touch: number;
  primary_language: string;
  secondary_language: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  options: { label: string; language: LoveLanguageKey }[];
}

export const LOVE_LANGUAGE_INFO: Record<LoveLanguageKey, { label: string; emoji: string; color: string; description: string; tips: string[] }> = {
  words_of_affirmation: {
    label: 'Words of Affirmation',
    emoji: '💬',
    color: 'hsl(var(--chart-1))',
    description: 'You feel most loved when your partner expresses love through spoken or written words — compliments, encouragement, and verbal appreciation.',
    tips: [
      'Leave surprise love notes in unexpected places',
      'Send a thoughtful "thinking of you" text during the day',
      'Verbally appreciate something specific they did',
      'Write a heartfelt letter on special occasions',
      'Compliment them in front of others',
    ],
  },
  acts_of_service: {
    label: 'Acts of Service',
    emoji: '🤝',
    color: 'hsl(var(--chart-2))',
    description: 'You feel most loved when your partner does helpful things — cooking a meal, running errands, or taking on a responsibility without being asked.',
    tips: [
      'Take over a chore they dislike without being asked',
      'Prepare their favorite meal after a long day',
      'Handle a stressful task they\'ve been putting off',
      'Fill up their car with gas or charge their devices',
      'Set up something they need before they ask',
    ],
  },
  receiving_gifts: {
    label: 'Receiving Gifts',
    emoji: '🎁',
    color: 'hsl(var(--chart-3))',
    description: 'You feel most loved through thoughtful gifts — it\'s not about the price but the meaning and effort behind the gesture.',
    tips: [
      'Pick up their favorite snack when you think of them',
      'Create a handmade gift or scrapbook',
      'Remember small things they mentioned wanting',
      'Surprise them with flowers or a small treat',
      'Give a "gift of presence" — show up when it matters',
    ],
  },
  quality_time: {
    label: 'Quality Time',
    emoji: '⏰',
    color: 'hsl(var(--chart-4))',
    description: 'You feel most loved when your partner gives you their undivided attention — being fully present, having deep conversations, and sharing experiences.',
    tips: [
      'Put phones away during dinner and conversations',
      'Plan a weekly date night just for the two of you',
      'Take a walk together without distractions',
      'Learn something new together as a couple',
      'Create rituals like morning coffee together',
    ],
  },
  physical_touch: {
    label: 'Physical Touch',
    emoji: '🤗',
    color: 'hsl(var(--chart-5))',
    description: 'You feel most loved through physical connection — hugs, holding hands, cuddles, and other forms of touch that communicate warmth and safety.',
    tips: [
      'Hold hands while walking or watching a movie',
      'Give a long hug when greeting or saying goodbye',
      'Offer a shoulder or back massage after a tough day',
      'Sit close together on the couch',
      'Initiate affectionate touch throughout the day',
    ],
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'After a long day, what would make you feel most loved?',
    options: [
      { label: 'Hearing "I\'m so proud of you"', language: 'words_of_affirmation' },
      { label: 'Coming home to a cooked meal', language: 'acts_of_service' },
      { label: 'A warm, long hug', language: 'physical_touch' },
      { label: 'Sitting together and talking about your day', language: 'quality_time' },
      { label: 'A small surprise gift waiting for you', language: 'receiving_gifts' },
    ],
  },
  {
    id: 2,
    prompt: 'On your birthday, which would mean the most?',
    options: [
      { label: 'A heartfelt card with personal words', language: 'words_of_affirmation' },
      { label: 'They planned the whole day so you don\'t have to', language: 'acts_of_service' },
      { label: 'A carefully chosen, meaningful gift', language: 'receiving_gifts' },
      { label: 'A full day spent together doing what you love', language: 'quality_time' },
      { label: 'Lots of cuddling and physical closeness', language: 'physical_touch' },
    ],
  },
  {
    id: 3,
    prompt: 'When you\'re feeling down, what helps most?',
    options: [
      { label: 'Words of encouragement and reassurance', language: 'words_of_affirmation' },
      { label: 'Someone taking things off your plate', language: 'acts_of_service' },
      { label: 'A comforting hug or hand squeeze', language: 'physical_touch' },
      { label: 'Undivided attention and deep conversation', language: 'quality_time' },
      { label: 'A thoughtful care package or treat', language: 'receiving_gifts' },
    ],
  },
  {
    id: 4,
    prompt: 'What makes you feel most appreciated in a relationship?',
    options: [
      { label: 'Being told specifically what they love about you', language: 'words_of_affirmation' },
      { label: 'When they help without you having to ask', language: 'acts_of_service' },
      { label: 'Receiving a "just because" gift', language: 'receiving_gifts' },
      { label: 'Regular one-on-one time together', language: 'quality_time' },
      { label: 'Holding hands, kisses, and close contact', language: 'physical_touch' },
    ],
  },
  {
    id: 5,
    prompt: 'Which gesture would surprise you the most (in a good way)?',
    options: [
      { label: 'A public compliment in front of friends', language: 'words_of_affirmation' },
      { label: 'They did all the laundry and cleaning', language: 'acts_of_service' },
      { label: 'Flowers or a treat delivered to you', language: 'receiving_gifts' },
      { label: 'A spontaneous adventure just for two', language: 'quality_time' },
      { label: 'A surprise back massage', language: 'physical_touch' },
    ],
  },
  {
    id: 6,
    prompt: 'How do you most naturally show love to others?',
    options: [
      { label: 'Telling them how much they mean to me', language: 'words_of_affirmation' },
      { label: 'Doing things to make their life easier', language: 'acts_of_service' },
      { label: 'Buying or making them something special', language: 'receiving_gifts' },
      { label: 'Giving them my full, focused attention', language: 'quality_time' },
      { label: 'Hugs, pats on the back, holding hands', language: 'physical_touch' },
    ],
  },
  {
    id: 7,
    prompt: 'What would hurt you most if it was missing from your relationship?',
    options: [
      { label: 'Never hearing "I love you" or compliments', language: 'words_of_affirmation' },
      { label: 'Feeling like you do everything yourself', language: 'acts_of_service' },
      { label: 'Never receiving any gifts, even small ones', language: 'receiving_gifts' },
      { label: 'Rarely spending focused time together', language: 'quality_time' },
      { label: 'No physical affection or closeness', language: 'physical_touch' },
    ],
  },
  {
    id: 8,
    prompt: 'Which of these date ideas appeals to you most?',
    options: [
      { label: 'A love letter exchange evening', language: 'words_of_affirmation' },
      { label: 'Cooking a new recipe together', language: 'acts_of_service' },
      { label: 'A shopping trip where you pick gifts for each other', language: 'receiving_gifts' },
      { label: 'A tech-free picnic in the park', language: 'quality_time' },
      { label: 'A couples massage or spa night at home', language: 'physical_touch' },
    ],
  },
  {
    id: 9,
    prompt: 'What would be the ideal way to reconnect after an argument?',
    options: [
      { label: 'Hearing a sincere apology with kind words', language: 'words_of_affirmation' },
      { label: 'Them making you coffee or tidying up', language: 'acts_of_service' },
      { label: 'A small peace offering — a flower or treat', language: 'receiving_gifts' },
      { label: 'Sitting down and talking it through calmly', language: 'quality_time' },
      { label: 'A long, warm embrace', language: 'physical_touch' },
    ],
  },
  {
    id: 10,
    prompt: 'If your partner could only do one of these every day, which would you pick?',
    options: [
      { label: 'Say something loving and specific to me', language: 'words_of_affirmation' },
      { label: 'Handle a task or errand for me', language: 'acts_of_service' },
      { label: 'Bring me a small token or treat', language: 'receiving_gifts' },
      { label: 'Spend 30 minutes of focused time with me', language: 'quality_time' },
      { label: 'Give me a hug and kiss', language: 'physical_touch' },
    ],
  },
];
