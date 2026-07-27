// filepath: src/hooks/useSaleSetups.ts
import { useCallback, useState } from 'react';
import { SaleSetup } from '../types';
import { INITIAL_SETUPS } from '../data/seedData';

type ToastFn = (
  type: 'success' | 'info' | 'warning' | 'danger',
  title: string,
  description?: string,
) => void;

export function useSaleSetups(triggerToast: ToastFn) {
  const [setups, setSetups] = useState<SaleSetup[]>(INITIAL_SETUPS);

  const addSetup = useCallback(
    (newSetup: SaleSetup) => {
      setSetups(prev => [newSetup, ...prev]);
      triggerToast('success', 'Campaign Linked', `Group ID ${newSetup.groupId} successfully configured.`);
    },
    [triggerToast],
  );

  const updateSaleSetup = useCallback(
    (updatedSetup: SaleSetup) => {
      setSetups(prev =>
        prev.map(s =>
          s.groupId === updatedSetup.groupId && s.adAccountId === updatedSetup.adAccountId
            ? updatedSetup
            : s,
        ),
      );
      triggerToast('success', 'Sale Setup Updated', `Updated assignment for Group ID ${updatedSetup.groupId}`);
    },
    [triggerToast],
  );

  return { setups, addSetup, updateSaleSetup };
}