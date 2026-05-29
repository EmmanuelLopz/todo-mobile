import { useEffect, useState } from 'react';

import { getColors } from '@/services/colors/getColors';
import { Color } from '@/types/Color';

interface UseColorsResult {
  colors: Color[];
  loading: boolean;
  error: string | null;
}

export function useColors(): UseColorsResult {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchColors = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getColors();
        if (!cancelled) setColors(data);
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Failed to load colors');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchColors();

    return () => {
      cancelled = true;
    };
  }, []);

  return { colors, loading, error };
}
