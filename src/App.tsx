/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ToastContainer, { ToastMessage } from './components/Toast';
import DashboardView from './components/views/DashboardView';
import CustomersView from './components/views/CustomersView';
import SalesView from './components/views/SalesView';
import AdAccountsView from './components/views/AdAccountsView';
import CardsView from './components/views/CardsView';
import TopupsView from './components/views/TopupsView';
import InvoicesView from './components/views/InvoicesView';
import SaleSetupView from './components/views/SaleSetupView';
import SeriesView from './components/views/SeriesView';
import VendorsView from './components/views/VendorsView';
import ReportsView from './components/views/ReportsView';
import InsightsView from './components/views/InsightsView';
import SettingsView from './components/views/SettingsView';
import {
  INITIAL_SETTINGS,
  INITIAL_SERIES,
  INITIAL_CARDS,
  INITIAL_CUSTOMERS,
  INITIAL_AD_ACCOUNTS,
  INITIAL_INVOICES,
  INITIAL_VENDORS,
  INITIAL_SETUPS,
  INITIAL_ACTIVITIES,
} from './data/seedData';
import { Customer, AdAccount, Invoice, BillingCard, Vendor, Series, SaleSetup, ActivityLog, GlobalSettings } from './types';
import { useCustomers } from './hooks/useCustomers';
import { useAdAccounts } from './hooks/useAdAccounts';
import { useInvoices } from './hooks/useInvoices';
import { useCards } from './hooks/useCards';
import { useVendors } from './hooks/useVendors';
import { useSeries } from './hooks/useSeries';
import { useSaleSetups } from './hooks/useSaleSetups';
import { useSettings } from './hooks/useSettings';
import { useActivities } from './hooks/useActivities';

export default function App() {
  // Navigation & Theme States
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toast helpers (declared early so domain hooks below can reference them)
  const triggerToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Primary Database States — one domain hook per slice
  const [selectedInsightsAccountId, setSelectedInsightsAccountId] = useState<string>('');

  const {
    customers,
    addCustomer,
    updateCustomer: handleUpdateCustomer,
    updateCustomerNotes: handleUpdateCustomerNotes,
    toggleFavorite: handleToggleFavorite,
    applySaleCredit,
  } = useCustomers(triggerToast);

  const {
    adAccounts,
    addAdAccount,
    updateAdAccount: handleUpdateAdAccount,
    updateAccountStatus: handleUpdateAccountStatus,
    bulkUpdateStatus: handleBulkUpdateStatus,
    markAccountSold,
  } = useAdAccounts(triggerToast);

  const {
    invoices,
    addInvoice,
    updateInvoice: handleUpdateInvoice,
    approveInvoice: handleApproveInvoice,
    rejectInvoice: handleRejectInvoice,
    syncTopupStatus: handleSyncTopupStatus,
  } = useInvoices(triggerToast);

  const { cards, addCard, updateCard, toggleCardStatus: handleToggleCardStatus, applyCardLoad } = useCards(triggerToast);
  const { vendors, addVendor, updateVendor: handleUpdateVendor } = useVendors(triggerToast);
  const { series, addSeries, updateSeries: handleUpdateSeries } = useSeries(triggerToast);
  const { setups, addSetup, updateSaleSetup: handleUpdateSaleSetup } = useSaleSetups(triggerToast);
  const {
    settings,
    updateBaseRate: handleUpdateBaseRate,
    addPaymentMethod: handleAddPaymentMethod,
    deletePaymentMethod: handleDeletePaymentMethod,
  } = useSettings(triggerToast);
  const { activities, addActivity } = useActivities();

  // Cross-view "auto-open" intent flags. Set before switching views so the
  // target child opens its modal / focuses its selection on mount.
  const [pendingOpenAddCustomer, setPendingOpenAddCustomer] = useState(false);
  const [pendingOpenAddAccount, setPendingOpenAddAccount] = useState(false);
  const [pendingInitialCheckoutStep, setPendingInitialCheckoutStep] = useState<number | null>(null);
  const [pendingInitialCustomerId, setPendingInitialCustomerId] = useState<string | null>(null);
  const [pendingInitialSalesCustomerId, setPendingInitialSalesCustomerId] = useState<string | null>(null);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd key
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            setActiveView('dashboard');
            triggerToast('info', 'View Routed', 'Switched to Operations Dashboard');
            break;
          case 'n':
            e.preventDefault();
            setActiveView('sales');
            triggerToast('info', 'View Routed', 'Switched to Shopify Checkout Entry');
            break;
          case 't':
            e.preventDefault();
            toggleTheme();
            break;
          case 'k':
            e.preventDefault();
            const searchInput = document.getElementById('global-search-input');
            if (searchInput) searchInput.focus();
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [darkMode]);

  // Clear pending "auto-open" intent flags after the target view mounts.
  // Each child reads the prop once on mount, then we reset so a subsequent
  // navigation doesn't replay the auto-open behavior.
  useEffect(() => {
    if (pendingOpenAddCustomer) setPendingOpenAddCustomer(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView === 'customers']);
  useEffect(() => {
    if (pendingOpenAddAccount) setPendingOpenAddAccount(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView === 'ad-accounts']);
  useEffect(() => {
    if (pendingInitialCheckoutStep !== null || pendingInitialSalesCustomerId !== null) {
      setPendingInitialCheckoutStep(null);
      setPendingInitialSalesCustomerId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView === 'sales']);
  useEffect(() => {
    if (pendingInitialCustomerId !== null) setPendingInitialCustomerId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView === 'customers']);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    triggerToast('success', 'Theme Updated', `Toggled to ${!darkMode ? 'Dark' : 'Light'} Mode`);
  };

  // ----------------------------------------------------
  // BUSINESS WORKFLOW HANDLERS (ERP ACTIONS)
  // ----------------------------------------------------

  // ----------------------------------------------------
  // Cross-domain orchestration handlers.
  //
  // Pure-domain mutations now live in the per-slice hooks. These handlers
  // remain here only because they fan out across multiple slices (sale
  // settlement, add-with-activity logging, etc.).
  // ----------------------------------------------------

  // Add Customer — also logs an activity entry.
  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'balanceBDT' | 'balanceUSD'>): Customer => {
    const newCustomer = addCustomer(customerData);
    addActivity({
      id: `act-${Date.now()}`,
      time: "Just now",
      user: "Rakibul Riyet",
      action: "Onboarded Customer",
      details: `Created profile for ${customerData.name} (${customerData.companyName})`,
      type: 'customer',
    });
    return newCustomer;
  };

  // Add Ad Account — also logs an activity entry.
  const handleAddAdAccount = (accountData: AdAccount) => {
    addAdAccount(accountData);
    addActivity({
      id: `act-${Date.now()}`,
      time: "Just now",
      user: "Rakibul R.",
      action: "Cataloged Ad Account",
      details: `Loaded ${accountData.adAccountName} (${accountData.platform}) to unassigned pool.`,
      type: 'account',
    });
  };

  // Submit New Sale Transaction — fans out to invoices, adAccounts,
  // customers, cards, and activities in one orchestrated write.
  const handleExecuteSale = (saleData: Omit<Invoice, 'invoiceNo' | 'date'>) => {
    const serial = invoices.length + 1;
    const invoiceNo = `ADB 202416${serial.toString().padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newInvoice: Invoice = {
      ...saleData,
      invoiceNo,
      date: today,
    };

    // 1. Invoices ledger
    addInvoice(newInvoice);

    // 2. Mark ad account as sold (if applicable)
    if (saleData.adAccountId && saleData.customerId) {
      markAccountSold(saleData.adAccountId, saleData.customerId);
    }

    // 3. Customer wallet credit
    if (saleData.customerId) {
      applySaleCredit(saleData.customerId, saleData.paidAmountBDT, saleData.topupAmountUSD);
    }

    // 4. Billing card load metrics (if a card was linked)
    const targetAccount = adAccounts.find(acc => acc.adAccountId === saleData.adAccountId);
    if (targetAccount?.billingCard) {
      applyCardLoad(targetAccount.billingCard, saleData.topupAmountUSD);
    }

    // 5. Activity log
    addActivity({
      id: `act-${Date.now()}`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      user: "Rakibul Riyet",
      action: "Completed Topup",
      details: `${invoiceNo} - Loaded $${saleData.topupAmountUSD.toFixed(1)} to ${saleData.adAccountName}`,
      type: 'sale',
    });

    // 6. Toast + route
    triggerToast(
      'success',
      'Sale Executed Successfully',
      `Invoice ${invoiceNo} generated. ৳${saleData.paidAmountBDT.toLocaleString()} settled.`,
    );
    setActiveView('dashboard');
  };

  // Simulate Reports PDF / Excel export
  const handleTriggerExport = (format: 'pdf' | 'excel' | 'csv') => {
    triggerToast(
      'info',
      'Generating Document export...',
      `Processing ledger rows into standard AdsBuzz ${format.toUpperCase()} layout.`,
    );
    setTimeout(() => {
      triggerToast(
        'success',
        'Download Complete',
        `AdsBuzz_Ledger_Statements_June2026.${format === 'excel' ? 'xlsx' : format}`,
      );
    }, 1500);
  };

  // Header global-search → cross-view navigation
  const handleSelectCustomerFromHeader = (id: string) => {
    setPendingInitialCustomerId(id);
    setActiveView('customers');
  };

  const handleSelectAdAccountFromHeader = (_id: string) => {
    setActiveView('ad-accounts');
  };

  // Dynamic statistics computations for dashboard KPIs
  const computeDashboardStats = () => {
    const today = "2026-06-01"; // lock to spreadsheet sample days for nice graphics
    const todayInvoices = invoices.filter(inv => inv.date === today && inv.paymentStatus === 'Paid');
    const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.topupAmountUSD, 0);

    const monthlySales = invoices
      .filter(inv => inv.paymentStatus === 'Paid')
      .reduce((sum, inv) => sum + inv.topupAmountUSD, 0);

    const pendingTopups = invoices.filter(inv => inv.topupStatus === 'Pending').length;
    const pendingApprovals = invoices.filter(inv => inv.approvalStatus === 'Pending').length;
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    const activeAccounts = adAccounts.filter(acc => acc.accountStatus === 'Active').length;
    const assignedAccounts = adAccounts.filter(acc => !!acc.assignedCustomer).length;
    const vendorDue = vendors.reduce((sum, v) => sum + v.outstandingBalanceUSD, 0);

    return {
      todaySales,
      monthlySales,
      pendingTopups,
      pendingApprovals,
      activeCustomers,
      activeAccounts,
      assignedAccounts,
      vendorDue
    };
  };

  const stats = useMemo(computeDashboardStats, [invoices, adAccounts, customers, vendors]);

  return (
    <div className={`flex font-sans min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-app-bg text-slate-800'}`} id="app-root-container">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        onNavigate={setActiveView} 
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div id="main-content-pane" className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        
        {/* Global Header */}
        <Header 
          onSearch={setSearchQuery} 
          darkMode={darkMode} 
          onToggleTheme={toggleTheme} 
          customers={customers}
          adAccounts={adAccounts}
          onSelectCustomer={handleSelectCustomerFromHeader}
          onSelectAdAccount={handleSelectAdAccountFromHeader}
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        {/* Dynamic Route Screen Frame */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          
          {activeView === 'dashboard' && (
            <DashboardView 
              stats={stats} 
              invoices={invoices}
              customers={customers}
              adAccounts={adAccounts}
              series={series}
              activities={activities}
              onNavigate={setActiveView}
              onQuickAction={(actionType) => {
                if (actionType === 'new-sale') {
                  setActiveView('sales');
                } else if (actionType === 'new-customer') {
                  setPendingOpenAddCustomer(true);
                  setActiveView('customers');
                } else if (actionType === 'new-topup') {
                  setPendingInitialCheckoutStep(2);
                  setActiveView('sales');
                } else if (actionType === 'assign-account') {
                  setPendingOpenAddAccount(true);
                  setActiveView('ad-accounts');
                }
              }}
              onSelectInsightsAccount={setSelectedInsightsAccountId}
            />
          )}

          {activeView === 'customers' && (
            <CustomersView
              customers={customers}
              adAccounts={adAccounts}
              invoices={invoices}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onUpdateCustomerNotes={handleUpdateCustomerNotes}
              onToggleFavorite={handleToggleFavorite}
              onTriggerTopup={(custId) => {
                setPendingInitialSalesCustomerId(custId);
                setActiveView('sales');
                triggerToast('info', 'Customer Selected', 'Initiating Shopify Checkout sequence');
              }}
              onTriggerAssign={() => {
                setPendingOpenAddAccount(true);
                setActiveView('ad-accounts');
              }}
              autoOpenAddModal={pendingOpenAddCustomer}
              initialCustomerId={pendingInitialCustomerId ?? undefined}
            />
          )}

          {activeView === 'sales' && (
            <SalesView
              customers={customers}
              adAccounts={adAccounts}
              invoices={invoices}
              paymentMethods={settings.paymentMethods}
              onSubmitSale={handleExecuteSale}
              onUpdateInvoice={handleUpdateInvoice}
              onAddCustomer={handleAddCustomer}
              onNavigateToCustomers={() => {
                setPendingOpenAddCustomer(true);
                setActiveView('customers');
              }}
              initialCheckoutStep={pendingInitialCheckoutStep ?? undefined}
              initialCustomerId={pendingInitialSalesCustomerId ?? undefined}
            />
          )}

          {activeView === 'sale-setup' && (
            <SaleSetupView
              setups={setups}
              customers={customers}
              adAccounts={adAccounts}
              onUpdateSetup={handleUpdateSaleSetup}
              onAddSetup={addSetup}
            />
          )}

          {activeView === 'topups' && (
            <TopupsView 
              invoices={invoices}
              customers={customers}
              onApproveInvoice={handleApproveInvoice}
              onRejectInvoice={handleRejectInvoice}
              onSyncTopupStatus={handleSyncTopupStatus}
            />
          )}

          {activeView === 'ad-accounts' && (
            <AdAccountsView
              adAccounts={adAccounts}
              customers={customers}
              cards={cards}
              series={series}
              onAddAdAccount={handleAddAdAccount}
              onUpdateAdAccount={handleUpdateAdAccount}
              onUpdateAccountStatus={handleUpdateAccountStatus}
              onBulkUpdateStatus={handleBulkUpdateStatus}
              autoOpenAddModal={pendingOpenAddAccount}
            />
          )}

          {activeView === 'series' && (
            <SeriesView
              series={series}
              adAccounts={adAccounts}
              onUpdateSeries={handleUpdateSeries}
              onAddSeries={addSeries}
            />
          )}

          {activeView === 'cards' && (
            <CardsView
              cards={cards}
              adAccounts={adAccounts}
              onUpdateCard={updateCard}
              onAddCard={addCard}
              onToggleCardStatus={handleToggleCardStatus}
            />
          )}

          {activeView === 'vendors' && (
            <VendorsView
              vendors={vendors}
              onUpdateVendor={handleUpdateVendor}
              onAddVendor={addVendor}
              paymentMethods={settings.paymentMethods}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView 
              invoices={invoices}
              onTriggerExport={handleTriggerExport}
            />
          )}

          {activeView === 'insights' && (
            <InsightsView 
              invoices={invoices}
              adAccounts={adAccounts}
              vendors={vendors}
              cards={cards}
              series={series}
              selectedAccId={selectedInsightsAccountId}
              onSelectAccId={setSelectedInsightsAccountId}
            />
          )}

          {activeView === 'invoices' && (
            <InvoicesView 
              invoices={invoices}
              customers={customers}
              onUpdateInvoice={handleUpdateInvoice}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateBaseRate={handleUpdateBaseRate}
              onAddPaymentMethod={handleAddPaymentMethod}
              onDeletePaymentMethod={handleDeletePaymentMethod}
            />
          )}

        </main>
      </div>

      {/* Floating Modern Toast Alerts Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

    </div>
  );
}
