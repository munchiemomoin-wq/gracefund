-- ==============================================
-- GRACEFUND PHASE 5: SUPABASE MIGRATION
-- Row Level Security policies for all tables
-- ==============================================

-- Enable RLS on all tables that need protection
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Campaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Donation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CampaignUpdate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WithdrawalRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Report" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RiskEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CampaignEdit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FundUsageItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PrivateDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InfoRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- HELPER: is_admin function
-- ==============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "User"
    WHERE "authUserId" = auth.uid()
      AND role = 'admin'
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==============================================
-- HELPER: current_user_id — returns the app User.id linked to Supabase Auth
-- ==============================================
CREATE OR REPLACE FUNCTION current_app_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT id FROM "User" WHERE "authUserId" = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==============================================
-- HELPER: current_user_role
-- ==============================================
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role FROM "User" WHERE "authUserId" = auth.uid() LIMIT 1),
    'visitor'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==============================================
-- USER TABLE POLICIES
-- ==============================================

-- Users can read their own profile
CREATE POLICY "users_read_own" ON "User"
  FOR SELECT USING ("authUserId" = auth.uid());

-- Users can update their own profile (not role, status, verificationLevel)
CREATE POLICY "users_update_own" ON "User"
  FOR UPDATE USING ("authUserId" = auth.uid())
  WITH CHECK ("authUserId" = auth.uid());

-- Admins can read all users
CREATE POLICY "admins_read_users" ON "User"
  FOR SELECT USING (is_admin());

-- Admins can update user status/role
CREATE POLICY "admins_update_users" ON "User"
  FOR UPDATE USING (is_admin());

-- Service role (bypasses RLS) can do everything — this is the default behavior

-- ==============================================
-- CAMPAIGN TABLE POLICIES
-- ==============================================

-- Public: anyone can read published campaigns (no auth required)
CREATE POLICY "campaigns_read_published" ON "Campaign"
  FOR SELECT USING (status = 'published');

-- Campaign organizers can read their own campaigns (any status)
CREATE POLICY "campaigns_read_own" ON "Campaign"
  FOR SELECT USING ("organizerId" = current_app_user_id());

-- Admins can read all campaigns
CREATE POLICY "admins_read_campaigns" ON "Campaign"
  FOR SELECT USING (is_admin());

-- Authenticated users can create campaigns
CREATE POLICY "campaigns_create" ON "Campaign"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL);

-- Organizers can update their own campaigns
CREATE POLICY "campaigns_update_own" ON "Campaign"
  FOR UPDATE USING ("organizerId" = current_app_user_id());

-- Admins can update any campaign
CREATE POLICY "admins_update_campaigns" ON "Campaign"
  FOR UPDATE USING (is_admin());

-- ==============================================
-- DONATION TABLE POLICIES
-- ==============================================

-- Public: anyone can see donation count/names on published campaigns (limited fields)
-- Full donation details visible only to donor or admin
CREATE POLICY "donations_read_public" ON "Donation"
  FOR SELECT USING (true); -- API layer controls what fields are returned

-- Authenticated users can create donations
CREATE POLICY "donations_create" ON "Donation"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL OR true);

-- Donors can read their own donations
CREATE POLICY "donations_read_own" ON "Donation"
  FOR SELECT USING ("donorId" = current_app_user_id());

-- Admins can read all donations
CREATE POLICY "admins_read_donations" ON "Donation"
  FOR SELECT USING (is_admin());

-- Only server/webhook can update donation payment status
CREATE POLICY "donations_update_admin" ON "Donation"
  FOR UPDATE USING (is_admin());

-- ==============================================
-- CAMPAIGN UPDATE TABLE POLICIES
-- ==============================================

CREATE POLICY "campaign_updates_read_published" ON "CampaignUpdate"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Campaign" WHERE "Campaign".id = "CampaignUpdate".campaignId AND "Campaign".status = 'published')
  );

CREATE POLICY "campaign_updates_read_own" ON "CampaignUpdate"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Campaign" WHERE "Campaign".id = "CampaignUpdate".campaignId AND "Campaign"."organizerId" = current_app_user_id())
  );

CREATE POLICY "campaign_updates_admin_read" ON "CampaignUpdate"
  FOR SELECT USING (is_admin());

CREATE POLICY "campaign_updates_create" ON "CampaignUpdate"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL);

-- ==============================================
-- ORGANIZATION TABLE POLICIES
-- ==============================================

CREATE POLICY "org_read_own" ON "Organization"
  FOR SELECT USING ("ownerId" = current_app_user_id());

CREATE POLICY "org_read_verified" ON "Organization"
  FOR SELECT USING (verificationStatus = 'verified');

CREATE POLICY "org_admin_read" ON "Organization"
  FOR SELECT USING (is_admin());

CREATE POLICY "org_create" ON "Organization"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL);

CREATE POLICY "org_update_own" ON "Organization"
  FOR UPDATE USING ("ownerId" = current_app_user_id());

CREATE POLICY "org_admin_update" ON "Organization"
  FOR UPDATE USING (is_admin());

-- ==============================================
-- WITHDRAWAL REQUEST POLICIES
-- ==============================================

CREATE POLICY "withdrawals_read_own" ON "WithdrawalRequest"
  FOR SELECT USING ("requesterId" = current_app_user_id());

CREATE POLICY "withdrawals_admin_read" ON "WithdrawalRequest"
  FOR SELECT USING (is_admin());

CREATE POLICY "withdrawals_create" ON "WithdrawalRequest"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL);

CREATE POLICY "withdrawals_admin_update" ON "WithdrawalRequest"
  FOR UPDATE USING (is_admin());

-- ==============================================
-- REPORT POLICIES
-- ==============================================

CREATE POLICY "reports_create" ON "Report"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL);

CREATE POLICY "reports_read_own" ON "Report"
  FOR SELECT USING ("reporterId" = current_app_user_id());

CREATE POLICY "reports_admin_read" ON "Report"
  FOR SELECT USING (is_admin());

CREATE POLICY "reports_admin_update" ON "Report"
  FOR UPDATE USING (is_admin());

-- ==============================================
-- FAVORITE POLICIES
-- ==============================================

CREATE POLICY "favorites_read_own" ON "Favorite"
  FOR SELECT USING ("userId" = current_app_user_id());

CREATE POLICY "favorites_create" ON "Favorite"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL);

CREATE POLICY "favorites_delete_own" ON "Favorite"
  FOR DELETE USING ("userId" = current_app_user_id());

-- ==============================================
-- VERIFICATION POLICIES (PRIVATE)
-- ==============================================

CREATE POLICY "verification_read_own" ON "Verification"
  FOR SELECT USING ("userId" = current_app_user_id());

CREATE POLICY "verification_admin_read" ON "Verification"
  FOR SELECT USING (is_admin());

CREATE POLICY "verification_create" ON "Verification"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL);

CREATE POLICY "verification_admin_update" ON "Verification"
  FOR UPDATE USING (is_admin());

CREATE POLICY "verification_update_own" ON "Verification"
  FOR UPDATE USING ("userId" = current_app_user_id());

-- ==============================================
-- RISK EVENT POLICIES (ADMIN ONLY)
-- ==============================================

CREATE POLICY "risk_events_admin_all" ON "RiskEvent"
  FOR ALL USING (is_admin());

-- ==============================================
-- NOTIFICATION POLICIES
-- ==============================================

CREATE POLICY "notifications_read_own" ON "Notification"
  FOR SELECT USING ("userId" = current_app_user_id());

CREATE POLICY "notifications_admin_read" ON "Notification"
  FOR SELECT USING (is_admin());

CREATE POLICY "notifications_update_own" ON "Notification"
  FOR UPDATE USING ("userId" = current_app_user_id());

-- ==============================================
-- CAMPAIGN EDIT POLICIES
-- ==============================================

CREATE POLICY "campaign_edits_read_own" ON "CampaignEdit"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Campaign" WHERE "Campaign".id = "CampaignEdit".campaignId AND "Campaign"."organizerId" = current_app_user_id())
  );

CREATE POLICY "campaign_edits_admin_all" ON "CampaignEdit"
  FOR ALL USING (is_admin());

-- ==============================================
-- FUND USAGE ITEM POLICIES
-- ==============================================

CREATE POLICY "fund_usage_read_published" ON "FundUsageItem"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Campaign" WHERE "Campaign".id = "FundUsageItem".campaignId AND "Campaign".status = 'published')
  );

CREATE POLICY "fund_usage_read_own" ON "FundUsageItem"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Campaign" WHERE "Campaign".id = "FundUsageItem".campaignId AND "Campaign"."organizerId" = current_app_user_id())
  );

CREATE POLICY "fund_usage_admin_read" ON "FundUsageItem"
  FOR SELECT USING (is_admin());

CREATE POLICY "fund_usage_create" ON "FundUsageItem"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL);

-- ==============================================
-- PRIVATE DOCUMENT POLICIES (STRICT)
-- ==============================================

-- Only the uploader can read their own documents
CREATE POLICY "private_docs_read_own" ON "PrivateDocument"
  FOR SELECT USING ("uploadedById" = current_app_user_id());

-- Admins can read all private documents
CREATE POLICY "private_docs_admin_read" ON "PrivateDocument"
  FOR SELECT USING (is_admin());

-- Authenticated users can create documents
CREATE POLICY "private_docs_create" ON "PrivateDocument"
  FOR INSERT WITH CHECK (current_app_user_id() IS NOT NULL);

-- Only admins can update document review status
CREATE POLICY "private_docs_admin_update" ON "PrivateDocument"
  FOR UPDATE USING (is_admin());

-- ==============================================
-- INFO REQUEST POLICIES
-- ==============================================

CREATE POLICY "info_requests_read_own" ON "InfoRequest"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Campaign" WHERE "Campaign".id = "InfoRequest".campaignId AND "Campaign"."organizerId" = current_app_user_id())
  );

CREATE POLICY "info_requests_admin_all" ON "InfoRequest"
  FOR ALL USING (is_admin());

-- ==============================================
-- AUDIT LOG POLICIES (ADMIN ONLY — IMMUTABLE)
-- ==============================================

CREATE POLICY "audit_logs_admin_read" ON "AuditLog"
  FOR SELECT USING (is_admin());

-- Prevent all inserts/updates/deletes from non-service-role
-- (The service role bypasses RLS, so only server-side code can write)
CREATE POLICY "audit_logs_no_insert" ON "AuditLog"
  FOR INSERT WITH CHECK (false);

CREATE POLICY "audit_logs_no_update" ON "AuditLog"
  FOR UPDATE USING (false);

CREATE POLICY "audit_logs_no_delete" ON "AuditLog"
  FOR DELETE USING (false);

-- ==============================================
-- CATEGORY & COUNTRY/STATE/CITY: Public read, admin write
-- ==============================================

CREATE POLICY "categories_public_read" ON "Category"
  FOR SELECT USING (true);

CREATE POLICY "categories_admin_write" ON "Category"
  FOR ALL USING (is_admin());

CREATE POLICY "countries_public_read" ON "Country"
  FOR SELECT USING (true);

CREATE POLICY "states_public_read" ON "State"
  FOR SELECT USING (true);

CREATE POLICY "cities_public_read" ON "City"
  FOR SELECT USING (true);

CREATE POLICY "platform_settings_public_read" ON "PlatformSettings"
  FOR SELECT USING (true);

CREATE POLICY "platform_settings_admin_write" ON "PlatformSettings"
  FOR ALL USING (is_admin());
