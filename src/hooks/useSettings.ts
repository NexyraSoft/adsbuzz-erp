// filepath: src/hooks/useSettings.ts
import { useCallback, useState } from 'react';
import { GlobalSettings } from '../types';
import { INITIAL_SETTINGS } from '../data/seedData';

type ToastFn = (
  type: 'success' | 'info' | 'warning' | 'danger',
  title: string,
  description?: string,
) => void;

export function useSettings(triggerToast: ToastFn) {
  const [settings, setSettings] = useState<GlobalSettings>(INITIAL_SETTINGS);

  const updateBaseRate = useCallback(
    (newRate: number) => {
      setSettings(prev => ({ ...prev, defaultDollarRate: newRate }));
      triggerToast(
        'success',
        'Global Dollar Rate Synchronized',
        `Standard exchange rate updated to ৳${newRate}/$.`,
      );
    },
    [triggerToast],
  );

  const addPaymentMethod = useCallback(
    (newPm: string) => {
      setSettings(prev => ({ ...prev, paymentMethods: [...prev.paymentMethods, newPm] }));
      triggerToast('success', 'Channel Connected', `Logged operational income channel: ${newPm}`);
    },
    [triggerToast],
  );

  const deletePaymentMethod = useCallback(
    (pmToDelete: string) => {
      setSettings(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter(p => p !== pmToDelete),
      }));
      triggerToast('warning', 'Channel Disconnected', `Removed income channel: ${pmToDelete}`);
    },
    [triggerToast],
  );

  return { settings, updateBaseRate, addPaymentMethod, deletePaymentMethod };
}