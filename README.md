# AdsBuzz ERP

Enterprise Resource Planning (ERP) suite for social ad account loading, reseller CRM, and billing card reconciliation.

## Features

- **Dashboard** — Real-time revenue, topups, and ad account performance
- **Customers** — Reseller CRM with company info, contact logs, and account assignments
- **Sales Entry** — Shopify checkout tracking and BDT reconciliation
- **Sale Setup** — BM/Ad account onboarding workflows
- **Topups Audit** — Pending and completed topup ledger
- **Ad Accounts** — Active/terminated account inventory across Facebook, TikTok, Google, Snapchat
- **Series** — Group-based ad account series management
- **Cards** — Billing card reconciliation with EBL rate feed
- **Vendors** — Vendor contact and balance tracking
- **Reports** — Operational and financial reporting
- **Insights** — Deep account-level analytics
- **Invoices** — Invoice lifecycle management
- **Settings** — Global configuration (rates, thresholds, integrations)

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** build tooling
- **Tailwind CSS 4** for styling
- **Motion** (Framer Motion) for animations
- **Recharts** for data visualization
- **Lucide React** for icons

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

The build output is generated in the `dist/` directory.

## Deploy

The project includes a `vercel.json` configured for Vite. Push to the connected Git branch and Vercel will auto-deploy.

```bash
git push origin main
```

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + D` | Go to Dashboard |
| `Ctrl + N` | New Sale Entry |
| `Ctrl + T` | Toggle light/dark theme |
| `Ctrl + K` | Focus global search |
