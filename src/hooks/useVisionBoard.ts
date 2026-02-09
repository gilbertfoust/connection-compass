import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { VisionItem, Timeframe, VisionItemType } from '@/types/vision';
import { toast } from '@/hooks/use-toast';

const ACCENT_COLORS = [
  'bg-primary/10 border-primary/30',
  'bg-chart-1/10 border-chart-1/30',
  'bg-chart-2/10 border-chart-2/30',
  'bg-chart-3/10 border-chart-3/30',
  'bg-chart-4/10 border-chart-4/30',
  'bg-chart-5/10 border-chart-5/30',
];

export const useVisionBoard = () => {
  const { coupleId, user } = useAuth();
  const [items, setItems] = useState<VisionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const mapDbItem = (i: any): VisionItem => ({
    id: i.id,
    type: i.type as VisionItemType,
    content: i.content,
    imageUrl: i.image_url || undefined,
    timeframe: i.timeframe as Timeframe,
    color: i.color || undefined,
    createdAt: i.created_at,
  });

  const fetchItems = useCallback(async () => {
    if (!coupleId) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('vision_items')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vision items:', error);
    } else {
      setItems((data || []).map(mapDbItem));
    }
    setLoading(false);
  }, [coupleId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Real-time subscription
  useEffect(() => {
    if (!coupleId) return;

    const channel = supabase
      .channel('vision-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vision_items', filter: `couple_id=eq.${coupleId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) => {
              if (prev.some((i) => i.id === (payload.new as any).id)) return prev;
              return [mapDbItem(payload.new), ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((i) => (i.id === (payload.new as any).id ? mapDbItem(payload.new) : i))
            );
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) => prev.filter((i) => i.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!user) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('vision-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('vision-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }, [user]);

  const addItem = useCallback(
    async (type: VisionItemType, content: string, timeframe: Timeframe, imageUrl?: string) => {
      if (!coupleId || !user) {
        toast({ title: 'Link a partner first', description: 'You need to link with a partner before adding shared items.', variant: 'destructive' });
        return;
      }
      const color = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
      const { error } = await supabase.from('vision_items').insert({
        couple_id: coupleId,
        type,
        content,
        timeframe,
        image_url: imageUrl || null,
        color,
        created_by: user.id,
      });
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
    },
    [coupleId, user]
  );

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('vision_items').delete().eq('id', id);
    if (error) console.error('Error deleting vision item:', error);
  }, []);

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

  return { items, addItem, deleteItem, getItemsByTimeframe, getCounts, uploadImage, loading };
};
