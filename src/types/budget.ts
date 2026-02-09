export const BUDGET_TEMPLATES = [
  {
    value: 'standard',
    label: 'Standard Budget',
    emoji: '📊',
    description: 'Custom categories with full flexibility',
    categories: [
      { category: 'housing', name: 'Housing', type: 'expense' as const },
      { category: 'utilities', name: 'Utilities', type: 'expense' as const },
      { category: 'groceries', name: 'Groceries', type: 'expense' as const },
      { category: 'transportation', name: 'Transportation', type: 'expense' as const },
      { category: 'entertainment', name: 'Entertainment', type: 'expense' as const },
      { category: 'dining', name: 'Dining Out', type: 'expense' as const },
      { category: 'subscriptions', name: 'Subscriptions', type: 'expense' as const },
      { category: 'personal', name: 'Personal', type: 'expense' as const },
      { category: 'savings', name: 'Savings', type: 'savings' as const },
      { category: 'debt', name: 'Debt Payments', type: 'expense' as const },
    ],
  },
  {
    value: '50-30-20',
    label: '50/30/20 Rule',
    emoji: '⚖️',
    description: '50% Needs, 30% Wants, 20% Savings',
    categories: [
      { category: 'housing', name: 'Housing (Need)', type: 'expense' as const },
      { category: 'utilities', name: 'Utilities (Need)', type: 'expense' as const },
      { category: 'groceries', name: 'Groceries (Need)', type: 'expense' as const },
      { category: 'transportation', name: 'Transportation (Need)', type: 'expense' as const },
      { category: 'insurance', name: 'Insurance (Need)', type: 'expense' as const },
      { category: 'dining', name: 'Dining Out (Want)', type: 'expense' as const },
      { category: 'entertainment', name: 'Entertainment (Want)', type: 'expense' as const },
      { category: 'shopping', name: 'Shopping (Want)', type: 'expense' as const },
      { category: 'hobbies', name: 'Hobbies (Want)', type: 'expense' as const },
      { category: 'savings', name: 'Emergency Fund (Save)', type: 'savings' as const },
      { category: 'investments', name: 'Investments (Save)', type: 'savings' as const },
      { category: 'debt', name: 'Debt Payoff (Save)', type: 'expense' as const },
    ],
  },
  {
    value: 'zero-based',
    label: 'Zero-Based',
    emoji: '🎯',
    description: 'Every dollar has a job — income minus expenses = 0',
    categories: [
      { category: 'giving', name: 'Giving', type: 'expense' as const },
      { category: 'housing', name: 'Housing', type: 'expense' as const },
      { category: 'utilities', name: 'Utilities', type: 'expense' as const },
      { category: 'food', name: 'Food', type: 'expense' as const },
      { category: 'transportation', name: 'Transportation', type: 'expense' as const },
      { category: 'health', name: 'Health', type: 'expense' as const },
      { category: 'insurance', name: 'Insurance', type: 'expense' as const },
      { category: 'personal', name: 'Personal Spending', type: 'expense' as const },
      { category: 'lifestyle', name: 'Lifestyle', type: 'expense' as const },
      { category: 'debt', name: 'Debt Snowball', type: 'expense' as const },
      { category: 'savings', name: 'Savings', type: 'savings' as const },
    ],
  },
  {
    value: 'envelope',
    label: 'Envelope System',
    emoji: '✉️',
    description: 'Cash-style budgeting with spending limits per envelope',
    categories: [
      { category: 'groceries', name: 'Groceries Envelope', type: 'expense' as const },
      { category: 'dining', name: 'Dining Envelope', type: 'expense' as const },
      { category: 'gas', name: 'Gas Envelope', type: 'expense' as const },
      { category: 'entertainment', name: 'Entertainment Envelope', type: 'expense' as const },
      { category: 'clothing', name: 'Clothing Envelope', type: 'expense' as const },
      { category: 'personal', name: 'Personal Envelope', type: 'expense' as const },
      { category: 'gifts', name: 'Gifts Envelope', type: 'expense' as const },
      { category: 'miscellaneous', name: 'Miscellaneous Envelope', type: 'expense' as const },
    ],
  },
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  housing: '🏠',
  utilities: '💡',
  groceries: '🛒',
  food: '🍽️',
  transportation: '🚗',
  entertainment: '🎬',
  dining: '🍕',
  subscriptions: '📱',
  personal: '👤',
  savings: '💰',
  debt: '💳',
  insurance: '🛡️',
  shopping: '🛍️',
  hobbies: '🎨',
  investments: '📈',
  giving: '❤️',
  health: '🏥',
  lifestyle: '✨',
  gas: '⛽',
  clothing: '👗',
  gifts: '🎁',
  miscellaneous: '📦',
  income: '💵',
  other: '📌',
};

export type BudgetTemplate = typeof BUDGET_TEMPLATES[number]['value'];

export interface Budget {
  id: string;
  couple_id: string;
  month: number;
  year: number;
  template: string;
  total_income: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: string;
  budget_id: string;
  couple_id: string;
  category: string;
  name: string;
  planned_amount: number;
  actual_amount: number;
  type: 'income' | 'expense' | 'savings';
  created_at: string;
}
