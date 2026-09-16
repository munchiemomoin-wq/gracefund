---
Task ID: 1
Agent: main
Task: GraceFund Phase 5 — Supabase Real Backend + Secure Documents + Donation & Platform Tip Architecture

Work Log:
- Installed @supabase/supabase-js and @supabase/ssr
- Created Supabase client utilities: browser client, server client, admin client (service role)
- Created Supabase middleware for session refresh
- Updated Prisma schema from SQLite to PostgreSQL with: UUID-ready IDs, authUserId field, platformTipAmount, paymentTotalAmount, paymentOrderId, paymentTransactionId, providerResponse, idempotencyKey, storageBucket fields, indexes on all foreign keys and query fields
- Created comprehensive RLS SQL migration with 40+ policies, helper functions (is_admin, current_app_user_id, current_user_role)
- Created auth utility library (lib/auth.ts) with getCurrentUser, requireAuth, requireAdmin, requireRole, requireOwnership, createAuditLog, AuthError
- Created 5 auth API routes: signup, login, logout, session, callback
- Created 2 document API routes: upload (with MIME/size validation), signed URL generation
- Created storage bucket setup API (POST creates required buckets, GET lists existing)
- Updated all 18 existing API routes with server-side auth enforcement
- Updated donation API with platform_tip_amount separation, payment statuses (pending/processing/succeeded/failed/cancelled/refunded), idempotency keys, test mode detection
- Updated Zustand store with AuthState (user, isLoading)
- Rewrote auth-modal for real Supabase Auth (login, register, password reset)
- Rewrote donation-modal with fixed tip amounts (₹0/₹25/₹50/₹100/Custom), clear separation of campaign donation vs GraceFund contribution
- Rewrote header with real auth state display, user menu, dynamic dashboard routing, logout
- Removed all client-provided reviewerId/reporterId (now server-derived from auth)
- Fixed paymentStatus references: 'completed' → 'succeeded' across campaigns/[slug] and stats routes
- Updated seed script: added paymentTotalAmount, platformTipAmount, paymentOrderId, paymentTransactionId, idempotencyKey to donations; removed PostgreSQL-incompatible `undefined` values
- Created .env.example with all Supabase variables, updated .env with user's Supabase URL
- All lint checks pass, production build succeeds (28 routes, zero errors)

Stage Summary:
- 21 database tables preserved and enhanced for PostgreSQL
- 28 API routes with server-side auth enforcement
- Supabase Auth integration (signup, login, logout, session, password reset)
- RLS policies for all 16+ sensitive tables
- Document upload + signed URL system + storage bucket management API
- Platform tip architecture (separate from campaign donations)
- Payment status workflow (pending → processing → succeeded/failed/cancelled/refunded)
- Webhook-ready architecture with idempotency keys
- Financial reporting separation (campaign donations vs platform tips vs refunds)
- **Build: CLEAN (0 errors, 28 routes compiled)**
- **Lint: CLEAN (0 warnings, 0 errors)**

---
Task ID: rebrand-jodofund
Agent: main
Task: Rebrand GraceFund → JodoFund with logo and color scheme

Work Log:
- Copied JodoFund logo SVG from /upload/jodofund_logo.svg to /public/logo.svg
- Updated globals.css with new oklch color palette: Deep Blue (#1B4F72) primary, Orange/Coral (#FF7A45) accent replacing gold, Medium Blue (#2E6DA4) forest
- Updated layout.tsx: title "JodoFund — Connect. Contribute. Change.", siteName, keywords, authors
- Updated header.tsx: logo "J" icon, "Jodo<span>Fund</span>" with orange accent, tagline "Connect. Contribute. Change.", nav "Give to JodoFund"
- Updated footer.tsx: brand name, email hello@jodofund.org, copyright
- Updated auth-modal.tsx: "Join JodoFund"
- Updated donation-modal.tsx: "JodoFund Contribution" and "Optional contribution to support JodoFund"
- Updated give-section.tsx and give-page.tsx: all GraceFund → JodoFund references
- Updated homepage-sections.tsx: "JodoFund is more than a platform..."
- Updated campaign-detail.tsx, trust-safety-page.tsx, report-modal.tsx, transparency-page.tsx
- Updated admin-give-views.tsx: all 6 label references
- Updated dashboards.tsx: "JodoFund Giving" sidebar
- Updated give-constants.ts: 4 description/label references
- Updated API routes: give/route.ts, transparency/route.ts, donations/route.ts
- Updated seed.ts and seed-pg.js: admin@jodofund.org, site_name JodoFund, tagline
- Updated Prisma schema: GracefundContribution → JodofundContribution, GracefundAllocation → JodofundAllocation, DB tables jodofundcontribution/jodofundallocation, JODFUND_DIRECT_CONTRIBUTION
- Updated all API route Prisma client calls: db.jodofundContribution, db.jodofundAllocation
- Renamed exports: GiveToJodoFundSection, GiveToJodoFundPage
- Production build: SUCCESS

Stage Summary:
- Full rebrand from GraceFund to JodoFund complete across all UI, API, schema, and seed files
- Color scheme changed from Navy+Gold to Deep Blue+Orange/Coral matching the JodoFund logo
- Tagline changed from "Giving Hope. Changing Lives." to "Connect. Contribute. Change."
- Build passes successfully
- Site cannot render until Supabase credentials are added to .env
