export interface ProfileQuestion {
  key: string;
  title: string;
  subtitle: string;
  type: 'multi-select' | 'single-select' | 'text';
  options?: string[];
  placeholder?: string;
  field: string;
}

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    key: 'interests',
    title: '🎯 What lights you up?',
    subtitle: 'Pick the things you enjoy most — no wrong answers.',
    type: 'multi-select',
    field: 'interests',
    options: [
      'Cooking together', 'Outdoor adventures', 'Fitness & wellness',
      'Movies & shows', 'Music & concerts', 'Travel & exploring',
      'Reading & learning', 'Gaming', 'Art & creativity',
      'Sports', 'Board games & puzzles', 'Volunteering',
      'Photography', 'Home projects', 'Dancing',
      'Trying new restaurants', 'Meditation & mindfulness', 'Tech & gadgets',
    ],
  },
  {
    key: 'values',
    title: '💎 What matters most to you?',
    subtitle: 'Choose the values that guide your life and relationship.',
    type: 'multi-select',
    field: 'values',
    options: [
      'Trust', 'Communication', 'Growth', 'Adventure',
      'Family', 'Independence', 'Loyalty', 'Humor',
      'Honesty', 'Compassion', 'Ambition', 'Stability',
      'Creativity', 'Spirituality', 'Respect', 'Generosity',
    ],
  },
  {
    key: 'communication',
    title: '💬 How do you like to communicate?',
    subtitle: 'What feels natural when you\'re sharing how you feel?',
    type: 'single-select',
    field: 'communication_style',
    options: [
      'I like to talk things through right away',
      'I need time to process before I share',
      'I express myself better in writing',
      'I prefer to show rather than tell',
      'I use humor to ease into tough topics',
    ],
  },
  {
    key: 'strengths',
    title: '💪 What are your relationship superpowers?',
    subtitle: 'What do you bring to the table?',
    type: 'multi-select',
    field: 'relationship_strengths',
    options: [
      'Great listener', 'Romantic gestures', 'Problem solver',
      'Emotional support', 'Making plans', 'Keeping things fun',
      'Staying calm in conflict', 'Being spontaneous', 'Remembering details',
      'Physical affection', 'Encouraging growth', 'Making people laugh',
    ],
  },
  {
    key: 'growth',
    title: '🌱 Where do you want to grow?',
    subtitle: 'No one\'s perfect. What are you working on?',
    type: 'multi-select',
    field: 'growth_areas',
    options: [
      'Being more patient', 'Opening up emotionally', 'Active listening',
      'Managing stress better', 'Being more present', 'Expressing needs',
      'Letting go of control', 'Being more spontaneous', 'Conflict resolution',
      'Work-life balance', 'Showing more appreciation', 'Setting boundaries',
    ],
  },
  {
    key: 'quality_time',
    title: '⏰ How do you like spending quality time?',
    subtitle: 'Pick the ones that feel most like "us time" to you.',
    type: 'multi-select',
    field: 'quality_time_preferences',
    options: [
      'Deep conversations', 'Watching something together', 'Working out together',
      'Cooking a meal', 'Going for walks', 'Road trips',
      'Staying in bed late', 'Playing games', 'Double dates',
      'Learning something new', 'Quiet time in the same room', 'Planning the future',
    ],
  },
  {
    key: 'appreciation',
    title: '🙏 How do you like to be appreciated?',
    subtitle: 'What makes you feel truly seen and valued?',
    type: 'single-select',
    field: 'appreciation_style',
    options: [
      'Words — hearing "I love you" or specific compliments',
      'Actions — when they handle things without being asked',
      'Time — undivided attention, no distractions',
      'Touch — hugs, hand-holding, physical closeness',
      'Gifts — thoughtful surprises that show they were thinking of me',
    ],
  },
  {
    key: 'ideal_date',
    title: '✨ Describe your ideal date night',
    subtitle: 'Paint the picture — what does a perfect evening look like?',
    type: 'text',
    field: 'ideal_date',
    placeholder: 'e.g., A quiet dinner at home with candles, then stargazing on the roof...',
  },
  {
    key: 'stress_relief',
    title: '🧘 How do you unwind?',
    subtitle: 'When life gets heavy, what helps you reset?',
    type: 'text',
    field: 'stress_relief',
    placeholder: 'e.g., Going for a long run, taking a hot bath, or just sitting in silence for a while...',
  },
  {
    key: 'goals',
    title: '🎯 What are your relationship goals?',
    subtitle: 'What are you building toward together?',
    type: 'text',
    field: 'relationship_goals',
    placeholder: 'e.g., We want to travel more, build our dream home, and always keep the spark alive...',
  },
  {
    key: 'dreams',
    title: '🌟 What\'s your biggest dream?',
    subtitle: 'The one that excites you just thinking about it.',
    type: 'text',
    field: 'dreams_and_aspirations',
    placeholder: 'e.g., Starting a business together, living abroad for a year, writing a book...',
  },
];
