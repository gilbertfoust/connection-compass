import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { VisionItem, Timeframe, VisionItemType } from '@/types/vision';

const ACCENT_COLORS = [
  'bg-primary/10 border-primary/30',
  'bg-chart-1/10 border-chart-1/30',
  'bg-chart-2/10 border-chart-2/30',
  'bg-chart-3/10 border-chart-3/30',
  'bg-chart-4/10 border-chart-4/30',
  'bg-chart-5/10 border-chart-5/30',
];

export const useVisionBoard = () => {
  const [items, setItems] = useLocalStorage<VisionItem[]>('tmla-vision-board', []);

  const addItem = useCallback(
    (type: VisionItemType, content: string, timeframe: Timeframe, imageUrl?: string) => {
      const color = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
      const newItem: VisionItem = {
        id: crypto.randomUUID(),
        type,
        content,
        imageUrl,
        timeframe,
        color,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
    },
    [setItems]
  );

  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setItems]
  );

  const getItemsByTimeframe = useCallback(
    (timeframe: Timeframe) => items.filter((item) => item.timeframe === timeframe),
    [items]
  );

  const getCounts = useCallback(() => {
    return {
      '3-month': items.filter((i) => i.timeframe === '3-month').length,
      '1-year': items.filter((i) => i.timeframe === '1-year').length,
      '5-year': items.filter((i) => i.timeframe === '5-year').length,
      total: items.length,
    };
  }, [items]);

  return { items, addItem, deleteItem, getItemsByTimeframe, getCounts };
};
