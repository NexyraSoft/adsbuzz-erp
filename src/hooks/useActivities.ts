// filepath: src/hooks/useActivities.ts
import { useCallback, useState } from 'react';
import { ActivityLog } from '../types';
import { INITIAL_ACTIVITIES } from '../data/seedData';

export function useActivities() {
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);

  /**
   * Prepend an activity to the timeline. Caller composes the ActivityLog
   * (timestamp + details) — the hook stays a thin wrapper.
   */
  const addActivity = useCallback((activity: ActivityLog) => {
    setActivities(prev => [activity, ...prev]);
  }, []);

  return { activities, addActivity };
}