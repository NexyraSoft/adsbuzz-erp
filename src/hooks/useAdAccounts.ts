// filepath: src/hooks/useAdAccounts.ts
import { useCallback, useState } from 'react';
import { AdAccount } from '../types';
import { INITIAL_AD_ACCOUNTS } from '../data/seedData';

type ToastFn = (
  type: 'success' | 'info' | 'warning' | 'danger',
  title: string,
  description?: string,
) => void;

/**
 * Owns the ad account slice and its pure handlers.
 * Cross-domain sale orchestration (mark-as-sold) lives in App.tsx and calls
 * `markAccountSold` here.
 */
export function useAdAccounts(triggerToast: ToastFn) {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>(INITIAL_AD_ACCOUNTS);

  const addAdAccount = useCallback(
    (accountData: AdAccount) => {
      setAdAccounts(prev => [accountData, ...prev]);
      triggerToast(
        'success',
        'Ad Account Loaded',
        `${accountData.adAccountName} is now ready for deployment.`,
      );
    },
    [triggerToast],
  );

  const updateAdAccount = useCallback(
    (updatedAcc: AdAccount) => {
      setAdAccounts(prev =>
        prev.map(a => (a.adAccountId === updatedAcc.adAccountId ? updatedAcc : a)),
      );
      triggerToast(
        'success',
        'Ad Account Updated',
        `Updated settings for ${updatedAcc.adAccountName}`,
      );
    },
    [triggerToast],
  );

  const updateAccountStatus = useCallback(
    (accountId: string, status: AdAccount['accountStatus']) => {
      setAdAccounts(prev =>
        prev.map(acc => (acc.adAccountId === accountId ? { ...acc, accountStatus: status } : acc)),
      );
      triggerToast(
        'success',
        'Account Status Sync',
        `Account ID ...${accountId.slice(-6)} set to ${status}.`,
      );
    },
    [triggerToast],
  );

  const bulkUpdateStatus = useCallback(
    (accountIds: string[], status: AdAccount['accountStatus']) => {
      const idSet = new Set(accountIds);
      setAdAccounts(prev =>
        prev.map(acc => (idSet.has(acc.adAccountId) ? { ...acc, accountStatus: status } : acc)),
      );
      triggerToast(
        'success',
        'Bulk Action Complete',
        `Successfully set ${accountIds.length} accounts to ${status}.`,
      );
    },
    [triggerToast],
  );

  /**
   * Mark an ad account as Sold to a customer. Pure ad-account mutation;
   * called from the cross-domain App sale handler. No toast (the sale
   * orchestrator emits its own "Sale Executed" toast).
   */
  const markAccountSold = useCallback((adAccountId: string, customerId: string) => {
    setAdAccounts(prev =>
      prev.map(acc =>
        acc.adAccountId === adAccountId
          ? { ...acc, accountStatus: 'Sold' as const, assignedCustomer: customerId }
          : acc,
      ),
    );
  }, []);

  return {
    adAccounts,
    addAdAccount,
    updateAdAccount,
    updateAccountStatus,
    bulkUpdateStatus,
    markAccountSold,
  };
}