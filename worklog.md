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
- Updated all 18 existing API routes with server-side auth enforcement
- Updated donation API with platform_tip_amount separation, payment statuses (pending/processing/succeeded/failed/cancelled/refunded), idempotency keys, test mode detection
- Updated Zustand store with AuthState (user, isLoading)
- Rewrote auth-modal for real Supabase Auth (login, register, password reset)
- Rewrote donation-modal with fixed tip amounts (₹0/₹25/₹50/₹100/Custom), clear separation of campaign donation vs GraceFund contribution
- Rewrote header with real auth state display, user menu, dynamic dashboard routing, logout
- Removed all client-provided reviewerId/reporterId (now server-derived from auth)
- Updated report-modal to not send client-provided reporterId
- Created .env.example with all Supabase variables
- Updated db.ts for PostgreSQL compatibility
- All lint checks pass

Stage Summary:
- 21 database tables preserved and enhanced for PostgreSQL
- 25+ API routes with server-side auth enforcement
- Supabase Auth integration (signup, login, logout, session, password reset)
- RLS policies for all sensitive tables
- Document upload + signed URL system
- Platform tip architecture (separate from campaign donations)
- Payment status workflow (pending → processing → succeeded/failed/cancelled/refunded)
- Webhook-ready architecture with idempotency keys
- Financial reporting separation (campaign donations vs platform tips vs refunds)
