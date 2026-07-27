// filepath: src/hooks/useSeries.ts
import { useCallback, useState } from 'react';
import { Series } from '../types';
import { INITIAL_SERIES } from '../data/seedData';

type ToastFn = (
  type: 'success' | 'info' | 'warning' | 'danger',
  title: string,
  description?: string,
) => void;

export function useSeries(triggerToast: ToastFn) {
  const [series, setSeries] = useState<Series[]>(INITIAL_SERIES);

  const addSeries = useCallback(
    (newSeries: Series) => {
      setSeries(prev => [...prev, newSeries]);
      triggerToast('success', 'Series Cataloged', `Series ${newSeries.seriesName} is now active.`);
    },
    [triggerToast],
  );

  const updateSeries = useCallback(
    (updatedSeries: Series) => {
      setSeries(prev =>
        prev.map(s => (s.seriesId === updatedSeries.seriesId ? updatedSeries : s)),
      );
      triggerToast('success', 'Series Updated', `Updated series ${updatedSeries.seriesName}`);
    },
    [triggerToast],
  );

  return { series, addSeries, updateSeries };
}