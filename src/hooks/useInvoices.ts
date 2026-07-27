// filepath: src/hooks/useInvoices.ts
import { useCallback, useState } from 'react';
import { Invoice } from '../types';
import { INITIAL_INVOICES } from '../data/seedData';

type ToastFn = (
  type: 'success' | 'info' | 'warning' | 'danger',
  title: string,
  description?: string,
) => void;

/**
 * Owns the invoice slice and its pure handlers. The execute-sale orchestrator
 * (which fans out to invoices, customers, adAccounts, cards, activities)
 * stays in App.tsx; this hook exposes only the invoice-local mutations.
 */
export function useInvoices(triggerToast: ToastFn) {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  /**
   * Prepend a new invoice to the ledger. Returns the generated invoiceNo so
   * the orchestrator can include it in its activity log / toast.
   */
  const addInvoice = useCallback(
    (newInvoice: Invoice): Invoice => {
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    },
    [],
  );

  const updateInvoice = useCallback(
    (updatedInvoice: Invoice) => {
      setInvoices(prev =>
        prev.map(inv => (inv.invoiceNo === updatedInvoice.invoiceNo ? updatedInvoice : inv)),
      );
      triggerToast('success', 'Record Updated', `Updated invoice ${updatedInvoice.invoiceNo}`);
    },
    [triggerToast],
  );

  const approveInvoice = useCallback(
    (invoiceNo: string) => {
      setInvoices(prev =>
        prev.map(inv =>
          inv.invoiceNo === invoiceNo
            ? { ...inv, approvalStatus: 'Approved' as const, paymentStatus: 'Paid' as const }
            : inv,
        ),
      );
      triggerToast('success', 'Payment Cleared', `Invoice ${invoiceNo} marked as settled.`);
    },
    [triggerToast],
  );

  const rejectInvoice = useCallback(
    (invoiceNo: string) => {
      setInvoices(prev =>
        prev.map(inv =>
          inv.invoiceNo === invoiceNo
            ? { ...inv, approvalStatus: 'Rejected' as const, paymentStatus: 'Due' as const }
            : inv,
        ),
      );
      triggerToast('danger', 'Payment Rejected', `Invoice ${invoiceNo} marked as Rejected.`);
    },
    [triggerToast],
  );

  const syncTopupStatus = useCallback(
    (invoiceNo: string) => {
      setInvoices(prev =>
        prev.map(inv =>
          inv.invoiceNo === invoiceNo ? { ...inv, topupStatus: 'Successfull' as const } : inv,
        ),
      );
      triggerToast('success', 'Publisher Sync Successful', `Publisher accounts refloaded for ${invoiceNo}.`);
    },
    [triggerToast],
  );

  return {
    invoices,
    addInvoice,
    updateInvoice,
    approveInvoice,
    rejectInvoice,
    syncTopupStatus,
  };
}