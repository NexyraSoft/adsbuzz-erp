// filepath: src/hooks/useCustomers.ts
import { useCallback, useState } from 'react';
import { Customer } from '../types';
import { INITIAL_CUSTOMERS } from '../data/seedData';

type ToastFn = (
  type: 'success' | 'info' | 'warning' | 'danger',
  title: string,
  description?: string,
) => void;

/**
 * Owns the customer slice and its pure handlers.
 *
 * Cross-domain orchestrations (e.g. applying a sale's credit to a customer
 * wallet) live here too because they are mutations of *this* domain; the
 * App-level handler that calls them stays in App.tsx.
 */
export function useCustomers(triggerToast: ToastFn) {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  const addCustomer = useCallback(
    (customerData: Omit<Customer, 'id' | 'createdAt' | 'balanceBDT' | 'balanceUSD'>): Customer => {
      // Read latest length from a functional update to avoid stale closure
      // when multiple adds happen back-to-back.
      let generatedId = '';
      const today = new Date().toISOString().split('T')[0];

      setCustomers(prev => {
        const id = `CUST-${(prev.length + 101)}`;
        generatedId = id;
        const newCustomer: Customer = {
          ...customerData,
          id,
          createdAt: today,
          balanceBDT: 0,
          balanceUSD: 0,
        };
        return [newCustomer, ...prev];
      });

      const newCustomer: Customer = {
        ...customerData,
        id: generatedId,
        createdAt: today,
        balanceBDT: 0,
        balanceUSD: 0,
      };
      triggerToast('success', 'Customer Onboarded', `${customerData.name} added with ID ${generatedId}`);
      return newCustomer;
    },
    [triggerToast],
  );

  const updateCustomer = useCallback(
    (updatedCust: Customer) => {
      setCustomers(prev => prev.map(c => (c.id === updatedCust.id ? updatedCust : c)));
      triggerToast('success', 'Customer Updated', `Profile updated for ${updatedCust.name}`);
    },
    [triggerToast],
  );

  const updateCustomerNotes = useCallback(
    (customerId: string, notes: string) => {
      setCustomers(prev => prev.map(c => (c.id === customerId ? { ...c, notes } : c)));
      triggerToast('success', 'CRM Notes Updated', 'Customer relationship records synchronized.');
    },
    [triggerToast],
  );

  const toggleFavorite = useCallback(
    (customerId: string) => {
      setCustomers(prev => {
        const target = prev.find(c => c.id === customerId);
        if (target) {
          const nextState = !target.favorite;
          triggerToast(
            'info',
            nextState ? 'Added to Favorites' : 'Removed from Favorites',
            `${target.name} bookmarks toggled.`,
          );
        }
        return prev.map(c =>
          c.id === customerId ? { ...c, favorite: !c.favorite } : c,
        );
      });
    },
    [triggerToast],
  );

  /**
   * Apply a completed sale's credit amounts to the customer's wallet balances.
   * Pure customer-state mutation; called from the cross-domain App handler.
   */
  const applySaleCredit = useCallback(
    (customerId: string, paidAmountBDT: number, topupAmountUSD: number) => {
      setCustomers(prev =>
        prev.map(c =>
          c.id === customerId
            ? { ...c, balanceBDT: c.balanceBDT + paidAmountBDT, balanceUSD: c.balanceUSD + topupAmountUSD }
            : c,
        ),
      );
    },
    [],
  );

  return {
    customers,
    addCustomer,
    updateCustomer,
    updateCustomerNotes,
    toggleFavorite,
    applySaleCredit,
  };
}