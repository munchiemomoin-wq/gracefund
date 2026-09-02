import { Client } from 'pg'

const connectionString = 'postgresql://postgres.qhmqmkfdoazngxubpzrc:Jesuslovesyoujosh@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=no-verify'

async function main() {
  const client = new Client({ connectionString })
  await client.connect()
  console.log('Connected to Supabase PostgreSQL')

  // Drop all tables (CASCADE handles indexes, constraints, foreign keys)
  const tables = [
    'InfoRequest', 'CampaignEdit', 'FundUsageItem', 'PrivateDocument',
    'Notification', 'RiskEvent', 'Verification', 'Favorite', 'Donation',
    'CampaignUpdate', 'Report', 'WithdrawalRequest', 'Campaign',
    'Organization', 'AuditLog', 'User', 'PlatformSettings',
    'City', 'State', 'Country', 'Category',
  ]

  for (const t of tables) {
    await client.query(`DROP TABLE IF EXISTS "${t}" CASCADE`)
  }
  console.log('Dropped all existing tables')

  // Also drop any leftover unique indexes
  const indexes = [
    'Category_slug_key', 'User_email_key', 'User_authUserId_key',
    'Campaign_slug_key', 'Organization_ownerId_key', 'Donation_idempotencyKey_key',
    'PlatformSettings_key_key', 'Country_code_key',
  ]
  for (const idx of indexes) {
    try { await client.query(`DROP INDEX IF EXISTS "${idx}"`) } catch {}
  }
  console.log('Cleaned up leftover indexes')

  // ===== CREATE TABLES =====
  const statements = [
    `CREATE TABLE "Country" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "code" TEXT NOT NULL,
      "currency" TEXT, "currencySymbol" TEXT, "active" BOOLEAN NOT NULL DEFAULT true
    )`,
    `CREATE TABLE "State" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL,
      "countryId" TEXT NOT NULL, "code" TEXT
    )`,
    `CREATE TABLE "City" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "stateId" TEXT NOT NULL
    )`,
    `CREATE TABLE "Category" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "slug" TEXT NOT NULL,
      "description" TEXT, "icon" TEXT, "active" BOOLEAN NOT NULL DEFAULT true,
      "sortOrder" INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE "PlatformSettings" (
      "id" TEXT NOT NULL PRIMARY KEY, "key" TEXT NOT NULL, "value" TEXT,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "User" (
      "id" TEXT NOT NULL PRIMARY KEY, "authUserId" TEXT, "name" TEXT,
      "email" TEXT NOT NULL, "phone" TEXT, "avatarUrl" TEXT,
      "role" TEXT NOT NULL DEFAULT 'visitor', "status" TEXT NOT NULL DEFAULT 'active',
      "verificationLevel" TEXT NOT NULL DEFAULT 'none',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "Campaign" (
      "id" TEXT NOT NULL PRIMARY KEY, "slug" TEXT NOT NULL, "title" TEXT NOT NULL,
      "shortDescription" TEXT, "story" TEXT, "categoryId" TEXT, "organizerId" TEXT,
      "beneficiaryName" TEXT, "beneficiaryRelationship" TEXT, "beneficiaryContact" TEXT,
      "countryId" TEXT, "stateId" TEXT, "cityId" TEXT,
      "goalAmount" DOUBLE PRECISION NOT NULL, "raisedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "currency" TEXT NOT NULL DEFAULT 'INR', "status" TEXT NOT NULL DEFAULT 'draft',
      "verificationLevel" TEXT NOT NULL DEFAULT 'none',
      "isFeatured" BOOLEAN NOT NULL DEFAULT false, "isUrgent" BOOLEAN NOT NULL DEFAULT false,
      "campaignType" TEXT NOT NULL DEFAULT 'individual', "campaignFeatures" TEXT,
      "coverImage" TEXT, "videoUrl" TEXT, "endDate" TIMESTAMP(3),
      "donorCount" INTEGER NOT NULL DEFAULT 0, "viewCount" INTEGER NOT NULL DEFAULT 0,
      "riskLevel" TEXT NOT NULL DEFAULT 'low', "investigationSettings" TEXT,
      "submittedAt" TIMESTAMP(3), "reviewedAt" TIMESTAMP(3),
      "reviewerId" TEXT, "reviewNotes" TEXT, "rejectionReason" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "Organization" (
      "id" TEXT NOT NULL PRIMARY KEY, "ownerId" TEXT NOT NULL, "name" TEXT NOT NULL,
      "type" TEXT NOT NULL, "description" TEXT, "logoUrl" TEXT, "coverImageUrl" TEXT,
      "website" TEXT, "country" TEXT, "city" TEXT, "registrationInfo" TEXT,
      "verificationStatus" TEXT NOT NULL DEFAULT 'pending', "socialLinks" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "Donation" (
      "id" TEXT NOT NULL PRIMARY KEY, "campaignId" TEXT NOT NULL,
      "donorId" TEXT, "donorName" TEXT, "donorEmail" TEXT,
      "amount" DOUBLE PRECISION NOT NULL, "currency" TEXT NOT NULL DEFAULT 'INR',
      "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "platformTipAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "paymentTotalAmount" DOUBLE PRECISION NOT NULL,
      "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
      "paymentProvider" TEXT, "paymentOrderId" TEXT, "paymentTransactionId" TEXT,
      "providerResponse" TEXT, "idempotencyKey" TEXT,
      "donorMessage" TEXT, "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
      "showNamePublicly" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "CampaignUpdate" (
      "id" TEXT NOT NULL PRIMARY KEY, "campaignId" TEXT NOT NULL,
      "title" TEXT NOT NULL, "content" TEXT, "imageUrl" TEXT,
      "status" TEXT NOT NULL DEFAULT 'published',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "WithdrawalRequest" (
      "id" TEXT NOT NULL PRIMARY KEY, "campaignId" TEXT NOT NULL,
      "requesterId" TEXT NOT NULL, "amount" DOUBLE PRECISION NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'requested', "bankDetails" TEXT,
      "rejectionReason" TEXT, "reviewerId" TEXT, "reviewedAt" TIMESTAMP(3),
      "reviewNotes" TEXT, "paymentReference" TEXT, "paidAt" TIMESTAMP(3),
      "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "processedAt" TIMESTAMP(3)
    )`,
    `CREATE TABLE "Report" (
      "id" TEXT NOT NULL PRIMARY KEY, "campaignId" TEXT NOT NULL,
      "reporterId" TEXT NOT NULL, "reason" TEXT NOT NULL, "description" TEXT,
      "status" TEXT NOT NULL DEFAULT 'new', "riskLevel" TEXT NOT NULL DEFAULT 'medium',
      "adminNotes" TEXT, "reviewerId" TEXT, "reviewedAt" TIMESTAMP(3),
      "resolvedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "AuditLog" (
      "id" TEXT NOT NULL PRIMARY KEY, "adminId" TEXT, "action" TEXT NOT NULL,
      "entityType" TEXT NOT NULL, "entityId" TEXT, "previousValue" TEXT,
      "newValue" TEXT, "metadata" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "Favorite" (
      "id" TEXT NOT NULL PRIMARY KEY, "campaignId" TEXT NOT NULL,
      "userId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "Verification" (
      "id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "level" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'not_started', "submittedAt" TIMESTAMP(3),
      "reviewedAt" TIMESTAMP(3), "reviewerId" TEXT, "reviewNotes" TEXT,
      "rejectionReason" TEXT, "expiryDate" TIMESTAMP(3), "documents" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "RiskEvent" (
      "id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT, "campaignId" TEXT,
      "eventType" TEXT NOT NULL, "severity" TEXT NOT NULL DEFAULT 'medium',
      "description" TEXT NOT NULL, "metadata" TEXT, "resolvedAt" TIMESTAMP(3),
      "resolvedBy" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "Notification" (
      "id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "type" TEXT NOT NULL,
      "title" TEXT NOT NULL, "message" TEXT NOT NULL, "entityType" TEXT,
      "entityId" TEXT, "isRead" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "CampaignEdit" (
      "id" TEXT NOT NULL PRIMARY KEY, "campaignId" TEXT NOT NULL,
      "field" TEXT NOT NULL, "oldValue" TEXT, "newValue" TEXT,
      "status" TEXT NOT NULL DEFAULT 'pending', "reviewerId" TEXT,
      "reviewedAt" TIMESTAMP(3), "reviewNotes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "FundUsageItem" (
      "id" TEXT NOT NULL PRIMARY KEY, "campaignId" TEXT NOT NULL,
      "category" TEXT NOT NULL, "amount" DOUBLE PRECISION NOT NULL,
      "description" TEXT, "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "PrivateDocument" (
      "id" TEXT NOT NULL PRIMARY KEY, "entityType" TEXT NOT NULL,
      "entityId" TEXT NOT NULL, "documentType" TEXT NOT NULL,
      "fileName" TEXT NOT NULL, "fileSize" INTEGER, "mimeType" TEXT,
      "storagePath" TEXT NOT NULL, "storageBucket" TEXT NOT NULL DEFAULT 'private-documents',
      "uploadedById" TEXT, "accessLevel" TEXT NOT NULL DEFAULT 'admin_only',
      "status" TEXT NOT NULL DEFAULT 'pending', "reviewNotes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE "InfoRequest" (
      "id" TEXT NOT NULL PRIMARY KEY, "campaignId" TEXT NOT NULL,
      "requesterId" TEXT NOT NULL, "message" TEXT NOT NULL,
      "requiredDocuments" TEXT, "dueDate" TIMESTAMP(3),
      "status" TEXT NOT NULL DEFAULT 'pending', "responseMessage" TEXT,
      "respondedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ]

  for (const sql of statements) {
    await client.query(sql)
  }
  console.log(`Created ${statements.length} tables`)

  // ===== UNIQUE INDEXES =====
  const uniqueIndexes = [
    `CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug")`,
    `CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`,
    `CREATE UNIQUE INDEX "User_authUserId_key" ON "User"("authUserId")`,
    `CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug")`,
    `CREATE UNIQUE INDEX "Organization_ownerId_key" ON "Organization"("ownerId")`,
    `CREATE UNIQUE INDEX "Donation_idempotencyKey_key" ON "Donation"("idempotencyKey")`,
    `CREATE UNIQUE INDEX "PlatformSettings_key_key" ON "PlatformSettings"("key")`,
    `CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code")`,
  ]

  for (const sql of uniqueIndexes) {
    await client.query(sql)
  }
  console.log(`Created ${uniqueIndexes.length} unique indexes`)

  // ===== REGULAR INDEXES =====
  const nonUniqueIndexes = [
    `CREATE INDEX "User_authUserId_idx" ON "User"("authUserId")`,
    `CREATE INDEX "User_email_idx" ON "User"("email")`,
    `CREATE INDEX "User_role_idx" ON "User"("role")`,
    `CREATE INDEX "User_status_idx" ON "User"("status")`,
    `CREATE INDEX "Campaign_status_idx" ON "Campaign"("status")`,
    `CREATE INDEX "Campaign_categoryId_idx" ON "Campaign"("categoryId")`,
    `CREATE INDEX "Campaign_organizerId_idx" ON "Campaign"("organizerId")`,
    `CREATE INDEX "Campaign_slug_idx" ON "Campaign"("slug")`,
    `CREATE INDEX "Campaign_createdAt_idx" ON "Campaign"("createdAt")`,
    `CREATE INDEX "Donation_campaignId_idx" ON "Donation"("campaignId")`,
    `CREATE INDEX "Donation_donorId_idx" ON "Donation"("donorId")`,
    `CREATE INDEX "Donation_paymentStatus_idx" ON "Donation"("paymentStatus")`,
    `CREATE INDEX "Donation_idempotencyKey_idx" ON "Donation"("idempotencyKey")`,
    `CREATE INDEX "Donation_createdAt_idx" ON "Donation"("createdAt")`,
    `CREATE INDEX "CampaignUpdate_campaignId_idx" ON "CampaignUpdate"("campaignId")`,
    `CREATE INDEX "Organization_ownerId_idx" ON "Organization"("ownerId")`,
    `CREATE INDEX "Organization_verificationStatus_idx" ON "Organization"("verificationStatus")`,
    `CREATE INDEX "WithdrawalRequest_campaignId_idx" ON "WithdrawalRequest"("campaignId")`,
    `CREATE INDEX "WithdrawalRequest_requesterId_idx" ON "WithdrawalRequest"("requesterId")`,
    `CREATE INDEX "WithdrawalRequest_status_idx" ON "WithdrawalRequest"("status")`,
    `CREATE INDEX "Report_campaignId_idx" ON "Report"("campaignId")`,
    `CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId")`,
    `CREATE INDEX "Report_status_idx" ON "Report"("status")`,
    `CREATE INDEX "Category_slug_idx" ON "Category"("slug")`,
    `CREATE INDEX "Category_active_idx" ON "Category"("active")`,
    `CREATE INDEX "AuditLog_adminId_idx" ON "AuditLog"("adminId")`,
    `CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType")`,
    `CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt")`,
    `CREATE INDEX "Favorite_campaignId_idx" ON "Favorite"("campaignId")`,
    `CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId")`,
    `CREATE INDEX "Verification_userId_idx" ON "Verification"("userId")`,
    `CREATE INDEX "Verification_status_idx" ON "Verification"("status")`,
    `CREATE INDEX "Verification_level_idx" ON "Verification"("level")`,
    `CREATE INDEX "RiskEvent_userId_idx" ON "RiskEvent"("userId")`,
    `CREATE INDEX "RiskEvent_campaignId_idx" ON "RiskEvent"("campaignId")`,
    `CREATE INDEX "RiskEvent_severity_idx" ON "RiskEvent"("severity")`,
    `CREATE INDEX "RiskEvent_createdAt_idx" ON "RiskEvent"("createdAt")`,
    `CREATE INDEX "Notification_userId_idx" ON "Notification"("userId")`,
    `CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead")`,
    `CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt")`,
    `CREATE INDEX "CampaignEdit_campaignId_idx" ON "CampaignEdit"("campaignId")`,
    `CREATE INDEX "CampaignEdit_status_idx" ON "CampaignEdit"("status")`,
    `CREATE INDEX "FundUsageItem_campaignId_idx" ON "FundUsageItem"("campaignId")`,
    `CREATE INDEX "PrivateDocument_entityType_idx" ON "PrivateDocument"("entityType")`,
    `CREATE INDEX "PrivateDocument_entityId_idx" ON "PrivateDocument"("entityId")`,
    `CREATE INDEX "PrivateDocument_uploadedById_idx" ON "PrivateDocument"("uploadedById")`,
    `CREATE INDEX "PrivateDocument_status_idx" ON "PrivateDocument"("status")`,
    `CREATE INDEX "InfoRequest_campaignId_idx" ON "InfoRequest"("campaignId")`,
    `CREATE INDEX "InfoRequest_requesterId_idx" ON "InfoRequest"("requesterId")`,
    `CREATE INDEX "InfoRequest_status_idx" ON "InfoRequest"("status")`,
    `CREATE INDEX "State_countryId_idx" ON "State"("countryId")`,
    `CREATE INDEX "City_stateId_idx" ON "City"("stateId")`,
    `CREATE INDEX "Country_code_idx" ON "Country"("code")`,
  ]

  for (const sql of indexes) {
    await client.query(sql)
  }
  console.log(`Created ${nonUniqueIndexes.length} indexes`)

  // ===== FOREIGN KEYS =====
  const fks = [
    `ALTER TABLE "State" ADD CONSTRAINT "State_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "City" ADD CONSTRAINT "City_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "Donation" ADD CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "CampaignUpdate" ADD CONSTRAINT "CampaignUpdate_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "Report" ADD CONSTRAINT "Report_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "Report" ADD CONSTRAINT "Report_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "Verification" ADD CONSTRAINT "Verification_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "RiskEvent" ADD CONSTRAINT "RiskEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "RiskEvent" ADD CONSTRAINT "RiskEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "RiskEvent" ADD CONSTRAINT "RiskEvent_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "CampaignEdit" ADD CONSTRAINT "CampaignEdit_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "CampaignEdit" ADD CONSTRAINT "CampaignEdit_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "FundUsageItem" ADD CONSTRAINT "FundUsageItem_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "PrivateDocument" ADD CONSTRAINT "PrivateDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "InfoRequest" ADD CONSTRAINT "InfoRequest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    `ALTER TABLE "InfoRequest" ADD CONSTRAINT "InfoRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
  ]

  for (const sql of fks) {
    await client.query(sql)
  }
  console.log(`Created ${fks.length} foreign keys`)

  await client.end()
  console.log('\nSchema push complete! All 21 tables with indexes and foreign keys.')
}

main().catch((e) => { console.error('Schema push failed:', e); process.exit(1) })
