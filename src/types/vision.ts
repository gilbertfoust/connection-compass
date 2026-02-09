export const TIMEFRAMES = [
  { value: '3-month', label: '3-Month Vision', emoji: '🌱', description: 'Near-term intentions' },
  { value: '1-year', label: '1-Year Vision', emoji: '🌻', description: 'This year together' },
  { value: '5-year', label: '5-Year Vision', emoji: '🌳', description: 'Long-term dreams' },
] as const;

export type Timeframe = typeof TIMEFRAMES[number]['value'];

export const ITEM_TYPES = [
  { value: 'image', label: 'Image', emoji: '🖼️' },
  { value: 'affirmation', label: 'Affirmation', emoji: '💜' },
  { value: 'goal', label: 'Goal', emoji: '🎯' },
  { value: 'text', label: 'Note', emoji: '📝' },
] as const;

export type VisionItemType = typeof ITEM_TYPES[number]['value'];

export interface VisionItem {
  id: string;
  type: VisionItemType;
  content: string;
  imageUrl?: string;
  timeframe: Timeframe;
  createdAt: string;
  color?: string;
}

export interface VisionBoard {
  items: VisionItem[];
}
