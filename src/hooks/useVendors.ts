// filepath: src/hooks/useVendors.ts
import { useCallback, useState } from 'react';
import { Vendor } from '../types';
import { INITIAL_VENDORS } from '../data/seedData';

type ToastFn = (
  type: 'success' | 'info' | 'warning' | 'danger',
  title: string,
  description?: string,
) => void;

export function useVendors(triggerToast: ToastFn) {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);

  const addVendor = useCallback(
    (newVendor: Vendor) => {
      setVendors(prev => [...prev, newVendor]);
      triggerToast('success', 'Vendor Onboarded', `Onboarded Wholesaler: ${newVendor.name}`);
    },
    [triggerToast],
  );

  const updateVendor = useCallback(
    (updatedVendor: Vendor) => {
      setVendors(prev => prev.map(v => (v.id === updatedVendor.id ? updatedVendor : v)));
      triggerToast('success', 'Vendor Updated', `Updated vendor ${updatedVendor.name}`);
    },
    [triggerToast],
  );

  return { vendors, addVendor, updateVendor };
}