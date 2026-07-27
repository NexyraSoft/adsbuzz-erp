/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlatformType = 'Facebook' | 'TikTok' | 'Google' | 'Snapchat';

/** Lifecycle status used by Ad Accounts (extends the generic Status with Terminated). */
export type AdAccountStatus =
  | 'Active' | 'Terminated' | 'Disabled' | 'Restricted' | 'Available' | 'Sold' | 'Disable' | 'Need Support';

/** Lifecycle status used by Billing Cards. */
export type CardStatus =
  | 'Active' | 'Sold' | 'Disable' | 'Need Support' | 'Available' | 'Disabled' | 'Restricted' | 'FB Restricted';

/** Generic status shared by Vendor, Series, Sale Setup. */
export type EntityStatus =
  | 'Active' | 'Sold' | 'Disable' | 'Need Support' | 'Available' | 'Inactive';

/** Lifecycle status for Sale Setup (adds 'Pending' on top of EntityStatus). */
export type SaleSetupStatus =
  | 'Active' | 'Sold' | 'Disable' | 'Need Support' | 'Available' | 'Inactive' | 'Pending';

/** Invoice payment status (Pay / Due / Partial). */
export type InvoicePaymentStatus = 'Paid' | 'Due' | 'Partially Paid';

/** Invoice topup-status as reported by the publisher API. */
export type InvoiceTopupStatus = 'Successfull' | 'Failed' | 'Pending';

/** Auditor approval status for an invoice. */
export type InvoiceApprovalStatus = 'Approved' | 'Pending' | 'Rejected';

export interface AdAccount {
  adAccountId: string; // ID of the ad account
  adAccountName: string; // Display name
  platform: PlatformType;
  accountType: string; // e.g. "Agency Account", "Personal"
  dollarRate: number; // custom rate for BDT conversion
  monthlySpending: number; // standard or average spending
  accountOwner: string; // e.g. "ADSBUZZ", "LAMHA TECH"
  userGroupCode: string; // e.g. "GC - 321", "GC - 345"
  accountStatus: AdAccountStatus;
  note?: string;
  bmId?: string; // Business Manager ID
  bmName?: string; // Business Manager Name
  billingCard?: string; // Linked credit card display
  assignedCustomer?: string; // ID of assigned customer
  seriesId?: string; // linked series
  assignAdAccount?: string;
  productType?: string;
  fundAccountStatus?: boolean; // Fund Account Status Yes/No
  selectCard?: string;
}

export interface Customer {
  id: string; // custom e.g. "CUST-101"
  name: string;
  email: string;
  phone: string;
  companyName: string;
  status: 'Active' | 'Inactive' | 'Lost';
  createdAt: string;
  balanceBDT: number; // account credit/wallet BDT
  balanceUSD: number; // account credit/wallet USD
  creditLimitUSD: number;
  groupId?: string; // Group ID identifier e.g. "GC-BIJOY"
  notes?: string;
  avatar?: string;
  favorite?: boolean;
}

export interface Invoice {
  invoiceNo: string; // e.g. "ADB 202415001"
  date: string; // e.g. "2026-06-01"
  platform: PlatformType;
  adAccountName: string;
  adAccountId?: string;
  dollarRate: number;
  topupAmountUSD: number;
  totalAmountBDT: number;
  paidAmountBDT: number;
  dueAmountBDT: number;
  paymentStatus: InvoicePaymentStatus;
  paymentMethod: string; // e.g. "ADSBUZZ EBL - 1342"
  topupStatus: InvoiceTopupStatus;
  approvalStatus: InvoiceApprovalStatus;
  paymentVerificationStatus?: 'Pending' | 'Approved' | 'Declined';
  paymentScreenshot?: string; // data URL of uploaded payment proof image
  note?: string;
  customerId?: string; // reference to Customer.id
  groupId?: string;
  serviceType?: 'Ad Account Topup' | 'Others';
  serviceDetails?: string;
  status?: 'Active' | 'Sold' | 'Disable' | 'Need Support' | 'Available' | 'Approved' | 'Pending' | 'Rejected';
}

export interface BillingCard {
  id: string;
  cardName: string; // display name e.g. "ADSBUZZ DBBL - 7473"
  cardType?: string;
  cardPlatform?: string;
  cardInitial: string; // initials for avatar
  status: CardStatus;
  linkedAccountsCount: number;
  usageCount: number;
  totalLoadedUSD: number;
}

export interface Vendor {
  id: string;
  name: string; // e.g. "Facebook Ads Vendor A"
  platform: PlatformType;
  outstandingBalanceUSD: number;
  paymentHistory: Array<{
    date: string;
    amountUSD: number;
    paymentMethod: string;
    transactionId: string;
  }>;
  status: EntityStatus;
  email: string;
  phone: string;
}

export interface Series {
  seriesId: string;
  seriesName: string; // e.g. "90'S SERIES", "VH SERIES"
  platform: PlatformType;
  status: EntityStatus;
}

export interface SaleSetup {
  groupId: string;
  userId: string;
  adName: string;
  adAccountId: string;
  platform: PlatformType;
  dollarRate: number;
  monthlySpending: number;
  status: SaleSetupStatus;
  serviceType?: 'Ad Account Topup' | 'Others';
  serviceDetails?: string;
  serviceFee?: number;
}

export interface DashboardStats {
  todaySalesUSD: number;
  monthlySalesUSD: number;
  pendingTopupsCount: number;
  pendingApprovalsCount: number;
  activeCustomersCount: number;
  activeAccountsCount: number;
  assignedAccountsCount: number;
  vendorDueUSD: number;
}

export interface ActivityLog {
  id: string;
  time: string;
  user: string;
  action: string;
  details: string;
  type: 'sale' | 'customer' | 'account' | 'payment' | 'system';
}

export interface GlobalSettings {
  companyName: string;
  defaultDollarRate: number;
  paymentMethods: string[];
  roles: string[];
  permissions: { [role: string]: string[] };
}
