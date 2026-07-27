// filepath: src/hooks/useCards.ts
import { useCallback, useState } from 'react';
import { BillingCard } from '../types';
import { INITIAL_CARDS } from '../data/seedData';

type ToastFn = (
  type: 'success' | 'info' | 'warning' | 'danger',
  title: string,
  description?: string,
) => void;

/**
 * Owns the billing-card slice and its pure handlers.
 * Cross-domain sale orchestration (load-metrics increment) lives in App.tsx.
 */
export function useCards(triggerToast: ToastFn) {
  const [cards, setCards] = useState<BillingCard[]>(INITIAL_CARDS);

  const addCard = useCallback(
    (newCard: BillingCard) => {
      setCards(prev => [...prev, newCard]);
      triggerToast('success', 'Card Registered', `Successfully added corporate card: ${newCard.cardName}`);
    },
    [triggerToast],
  );

  const updateCard = useCallback(
    (updatedCard: BillingCard) => {
      setCards(prev => prev.map(c => (c.id === updatedCard.id ? updatedCard : c)));
      triggerToast('success', 'Card Updated', `Updated settings for ${updatedCard.cardName}`);
    },
    [triggerToast],
  );

  const toggleCardStatus = useCallback(
    (cardId: string) => {
      setCards(prev =>
        prev.map(c => {
          if (c.id !== cardId) return c;
          const nextStatus = c.status === 'Active' ? 'Disable' : 'Active';
          triggerToast('warning', 'Card Policy Modified', `Card ${c.cardName} set to ${nextStatus}.`);
          return { ...c, status: nextStatus as BillingCard['status'] };
        }),
      );
    },
    [triggerToast],
  );

  /**
   * Increment a card's load metrics. Pure card mutation; called from the
   * cross-domain App sale handler. No toast (sale orchestrator emits its own).
   */
  const applyCardLoad = useCallback((cardName: string, topupAmountUSD: number) => {
    setCards(prev =>
      prev.map(card =>
        card.cardName === cardName
          ? {
              ...card,
              usageCount: card.usageCount + 1,
              totalLoadedUSD: card.totalLoadedUSD + topupAmountUSD,
            }
          : card,
      ),
    );
  }, []);

  return { cards, addCard, updateCard, toggleCardStatus, applyCardLoad };
}