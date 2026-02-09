import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { DateNightIdea } from '@/data/activities';

interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
}

export const useDateNightAI = () => {
  const { coupleId } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<DateNightIdea[]>([]);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      toast({ title: 'Location not supported', description: 'Your browser does not support geolocation.', variant: 'destructive' });
      return;
    }

    setLocationLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });

      const { latitude: lat, longitude: lng } = position.coords;

      // Reverse geocode to get city name
      let city = '';
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
        );
        const geoData = await geoResponse.json();
        city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || '';
      } catch {
        // Geocoding failed, continue without city name
      }

      setLocation({ lat, lng, city });
      toast({ title: `📍 Location set: ${city || 'Your area'}`, description: 'AI suggestions will include local recommendations!' });
    } catch (err) {
      toast({ title: 'Location denied', description: 'Enable location to get local suggestions.', variant: 'destructive' });
    } finally {
      setLocationLoading(false);
    }
  };

  const generateSuggestions = async (filters?: { budget?: string; setting?: string; energy?: string }) => {
    setIsGenerating(true);
    setAiSuggestions([]);

    try {
      const { data, error } = await supabase.functions.invoke('suggest-dates', {
        body: {
          filters: filters || {},
          location: location || null,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      const suggestions = (data?.suggestions || []).map((s: any, i: number) => ({
        id: `ai-${Date.now()}-${i}`,
        ...s,
        conversationPrompts: s.conversationPrompts || [],
      }));

      setAiSuggestions(suggestions);
    } catch (err) {
      console.error('AI suggestion error:', err);
      toast({
        title: 'Could not generate suggestions',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSuggestions = () => setAiSuggestions([]);

  return {
    isGenerating, aiSuggestions, location, locationLoading,
    requestLocation, generateSuggestions, clearSuggestions,
  };
};
