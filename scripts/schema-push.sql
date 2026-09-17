-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "authuserid" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "avatarurl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'visitor',
    "status" TEXT NOT NULL DEFAULT 'active',
    "verificationlevel" TEXT NOT NULL DEFAULT 'none',
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortdescription" TEXT,
    "story" TEXT,
    "categoryid" TEXT,
    "organizerid" TEXT,
    "beneficiaryname" TEXT,
    "beneficiaryrelationship" TEXT,
    "beneficiarycontact" TEXT,
    "countryid" TEXT,
    "stateid" TEXT,
    "cityid" TEXT,
    "goalamount" DOUBLE PRECISION NOT NULL,
    "raisedamount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "verificationlevel" TEXT NOT NULL DEFAULT 'none',
    "isfeatured" BOOLEAN NOT NULL DEFAULT false,
    "isurgent" BOOLEAN NOT NULL DEFAULT false,
    "campaigntype" TEXT NOT NULL DEFAULT 'individual',
    "campaignfeatures" TEXT,
    "coverimage" TEXT,
    "videourl" TEXT,
    "enddate" TIMESTAMP(3),
    "donorcount" INTEGER NOT NULL DEFAULT 0,
    "viewcount" INTEGER NOT NULL DEFAULT 0,
    "risklevel" TEXT NOT NULL DEFAULT 'low',
    "investigationsettings" TEXT,
    "submittedat" TIMESTAMP(3),
    "reviewedat" TIMESTAMP(3),
    "reviewerid" TEXT,
    "reviewnotes" TEXT,
    "rejectionreason" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation" (
    "id" TEXT NOT NULL,
    "campaignid" TEXT NOT NULL,
    "donorid" TEXT,
    "donorname" TEXT,
    "donoremail" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "platformfee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "platformtipamount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymenttotalamount" DOUBLE PRECISION NOT NULL,
    "paymentstatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentprovider" TEXT,
    "paymentorderid" TEXT,
    "paymenttransactionid" TEXT,
    "providerresponse" TEXT,
    "idempotencykey" TEXT,
    "donormessage" TEXT,
    "isanonymous" BOOLEAN NOT NULL DEFAULT false,
    "shownamepublicly" BOOLEAN NOT NULL DEFAULT true,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaignupdate" (
    "id" TEXT NOT NULL,
    "campaignid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "imageurl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaignupdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "ownerid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "logourl" TEXT,
    "coverimageurl" TEXT,
    "website" TEXT,
    "country" TEXT,
    "city" TEXT,
    "registrationinfo" TEXT,
    "verificationstatus" TEXT NOT NULL DEFAULT 'pending',
    "sociallinks" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawalrequest" (
    "id" TEXT NOT NULL,
    "campaignid" TEXT NOT NULL,
    "requesterid" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "bankdetails" TEXT,
    "rejectionreason" TEXT,
    "reviewerid" TEXT,
    "reviewedat" TIMESTAMP(3),
    "reviewnotes" TEXT,
    "paymentreference" TEXT,
    "paidat" TIMESTAMP(3),
    "requestedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedat" TIMESTAMP(3),

    CONSTRAINT "withdrawalrequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" TEXT NOT NULL,
    "campaignid" TEXT NOT NULL,
    "reporterid" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "risklevel" TEXT NOT NULL DEFAULT 'medium',
    "adminnotes" TEXT,
    "reviewerid" TEXT,
    "reviewedat" TIMESTAMP(3),
    "resolvedat" TIMESTAMP(3),
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortorder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditlog" (
    "id" TEXT NOT NULL,
    "adminid" TEXT,
    "action" TEXT NOT NULL,
    "entitytype" TEXT NOT NULL,
    "entityid" TEXT,
    "previousvalue" TEXT,
    "newvalue" TEXT,
    "metadata" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" TEXT NOT NULL,
    "campaignid" TEXT NOT NULL,
    "userid" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platformsettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platformsettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "currency" TEXT,
    "currencysymbol" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryid" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stateid" TEXT NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "submittedat" TIMESTAMP(3),
    "reviewedat" TIMESTAMP(3),
    "reviewerid" TEXT,
    "reviewnotes" TEXT,
    "rejectionreason" TEXT,
    "expirydate" TIMESTAMP(3),
    "documents" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riskevent" (
    "id" TEXT NOT NULL,
    "userid" TEXT,
    "campaignid" TEXT,
    "eventtype" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "resolvedat" TIMESTAMP(3),
    "resolvedby" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riskevent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entitytype" TEXT,
    "entityid" TEXT,
    "isread" BOOLEAN NOT NULL DEFAULT false,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaignedit" (
    "id" TEXT NOT NULL,
    "campaignid" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldvalue" TEXT,
    "newvalue" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewerid" TEXT,
    "reviewedat" TIMESTAMP(3),
    "reviewnotes" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaignedit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fundusageitem" (
    "id" TEXT NOT NULL,
    "campaignid" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "sortorder" INTEGER NOT NULL DEFAULT 0,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fundusageitem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privatedocument" (
    "id" TEXT NOT NULL,
    "entitytype" TEXT NOT NULL,
    "entityid" TEXT NOT NULL,
    "documenttype" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filesize" INTEGER,
    "mimetype" TEXT,
    "storagepath" TEXT NOT NULL,
    "storagebucket" TEXT NOT NULL DEFAULT 'private-documents',
    "uploadedbyid" TEXT,
    "accesslevel" TEXT NOT NULL DEFAULT 'admin_only',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewnotes" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "privatedocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inforequest" (
    "id" TEXT NOT NULL,
    "campaignid" TEXT NOT NULL,
    "requesterid" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "requireddocuments" TEXT,
    "duedate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "responsemessage" TEXT,
    "respondedat" TIMESTAMP(3),
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inforequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jodofundcontribution" (
    "id" TEXT NOT NULL,
    "donorid" TEXT,
    "donorname" TEXT,
    "donoremail" TEXT,
    "donorphone" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "purpose" TEXT NOT NULL,
    "contributiontype" TEXT NOT NULL DEFAULT 'JODFUND_DIRECT_CONTRIBUTION',
    "paymentstatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentprovider" TEXT,
    "paymentorderid" TEXT,
    "paymenttransactionid" TEXT,
    "providerresponse" TEXT,
    "idempotencykey" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jodofundcontribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jodofundallocation" (
    "id" TEXT NOT NULL,
    "contributionid" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "beneficiaryorprogramreference" TEXT,
    "campaignid" TEXT,
    "allocationstatus" TEXT NOT NULL DEFAULT 'planned',
    "allocatedat" TIMESTAMP(3),
    "approvedby" TEXT,
    "notes" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jodofundallocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authuserid_key" ON "User"("authuserid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_authuserid_idx" ON "User"("authuserid");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_slug_key" ON "campaign"("slug");

-- CreateIndex
CREATE INDEX "campaign_status_idx" ON "campaign"("status");

-- CreateIndex
CREATE INDEX "campaign_categoryid_idx" ON "campaign"("categoryid");

-- CreateIndex
CREATE INDEX "campaign_organizerid_idx" ON "campaign"("organizerid");

-- CreateIndex
CREATE INDEX "campaign_slug_idx" ON "campaign"("slug");

-- CreateIndex
CREATE INDEX "campaign_createdat_idx" ON "campaign"("createdat");

-- CreateIndex
CREATE UNIQUE INDEX "donation_idempotencykey_key" ON "donation"("idempotencykey");

-- CreateIndex
CREATE INDEX "donation_campaignid_idx" ON "donation"("campaignid");

-- CreateIndex
CREATE INDEX "donation_donorid_idx" ON "donation"("donorid");

-- CreateIndex
CREATE INDEX "donation_paymentstatus_idx" ON "donation"("paymentstatus");

-- CreateIndex
CREATE INDEX "donation_idempotencykey_idx" ON "donation"("idempotencykey");

-- CreateIndex
CREATE INDEX "donation_createdat_idx" ON "donation"("createdat");

-- CreateIndex
CREATE INDEX "campaignupdate_campaignid_idx" ON "campaignupdate"("campaignid");

-- CreateIndex
CREATE UNIQUE INDEX "organization_ownerid_key" ON "organization"("ownerid");

-- CreateIndex
CREATE INDEX "organization_ownerid_idx" ON "organization"("ownerid");

-- CreateIndex
CREATE INDEX "organization_verificationstatus_idx" ON "organization"("verificationstatus");

-- CreateIndex
CREATE INDEX "withdrawalrequest_campaignid_idx" ON "withdrawalrequest"("campaignid");

-- CreateIndex
CREATE INDEX "withdrawalrequest_requesterid_idx" ON "withdrawalrequest"("requesterid");

-- CreateIndex
CREATE INDEX "withdrawalrequest_status_idx" ON "withdrawalrequest"("status");

-- CreateIndex
CREATE INDEX "report_campaignid_idx" ON "report"("campaignid");

-- CreateIndex
CREATE INDEX "report_reporterid_idx" ON "report"("reporterid");

-- CreateIndex
CREATE INDEX "report_status_idx" ON "report"("status");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE INDEX "category_slug_idx" ON "category"("slug");

-- CreateIndex
CREATE INDEX "category_active_idx" ON "category"("active");

-- CreateIndex
CREATE INDEX "auditlog_adminid_idx" ON "auditlog"("adminid");

-- CreateIndex
CREATE INDEX "auditlog_entitytype_idx" ON "auditlog"("entitytype");

-- CreateIndex
CREATE INDEX "auditlog_createdat_idx" ON "auditlog"("createdat");

-- CreateIndex
CREATE INDEX "favorite_campaignid_idx" ON "favorite"("campaignid");

-- CreateIndex
CREATE INDEX "favorite_userid_idx" ON "favorite"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "platformsettings_key_key" ON "platformsettings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "country_code_key" ON "country"("code");

-- CreateIndex
CREATE INDEX "country_code_idx" ON "country"("code");

-- CreateIndex
CREATE INDEX "state_countryid_idx" ON "state"("countryid");

-- CreateIndex
CREATE INDEX "city_stateid_idx" ON "city"("stateid");

-- CreateIndex
CREATE INDEX "verification_userid_idx" ON "verification"("userid");

-- CreateIndex
CREATE INDEX "verification_status_idx" ON "verification"("status");

-- CreateIndex
CREATE INDEX "verification_level_idx" ON "verification"("level");

-- CreateIndex
CREATE INDEX "riskevent_userid_idx" ON "riskevent"("userid");

-- CreateIndex
CREATE INDEX "riskevent_campaignid_idx" ON "riskevent"("campaignid");

-- CreateIndex
CREATE INDEX "riskevent_severity_idx" ON "riskevent"("severity");

-- CreateIndex
CREATE INDEX "riskevent_createdat_idx" ON "riskevent"("createdat");

-- CreateIndex
CREATE INDEX "notification_userid_idx" ON "notification"("userid");

-- CreateIndex
CREATE INDEX "notification_isread_idx" ON "notification"("isread");

-- CreateIndex
CREATE INDEX "notification_createdat_idx" ON "notification"("createdat");

-- CreateIndex
CREATE INDEX "campaignedit_campaignid_idx" ON "campaignedit"("campaignid");

-- CreateIndex
CREATE INDEX "campaignedit_status_idx" ON "campaignedit"("status");

-- CreateIndex
CREATE INDEX "fundusageitem_campaignid_idx" ON "fundusageitem"("campaignid");

-- CreateIndex
CREATE INDEX "privatedocument_entitytype_idx" ON "privatedocument"("entitytype");

-- CreateIndex
CREATE INDEX "privatedocument_entityid_idx" ON "privatedocument"("entityid");

-- CreateIndex
CREATE INDEX "privatedocument_uploadedbyid_idx" ON "privatedocument"("uploadedbyid");

-- CreateIndex
CREATE INDEX "privatedocument_status_idx" ON "privatedocument"("status");

-- CreateIndex
CREATE INDEX "inforequest_campaignid_idx" ON "inforequest"("campaignid");

-- CreateIndex
CREATE INDEX "inforequest_requesterid_idx" ON "inforequest"("requesterid");

-- CreateIndex
CREATE INDEX "inforequest_status_idx" ON "inforequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "jodofundcontribution_idempotencykey_key" ON "jodofundcontribution"("idempotencykey");

-- CreateIndex
CREATE INDEX "jodofundcontribution_donorid_idx" ON "jodofundcontribution"("donorid");

-- CreateIndex
CREATE INDEX "jodofundcontribution_paymentstatus_idx" ON "jodofundcontribution"("paymentstatus");

-- CreateIndex
CREATE INDEX "jodofundcontribution_purpose_idx" ON "jodofundcontribution"("purpose");

-- CreateIndex
CREATE INDEX "jodofundcontribution_createdat_idx" ON "jodofundcontribution"("createdat");

-- CreateIndex
CREATE INDEX "jodofundallocation_contributionid_idx" ON "jodofundallocation"("contributionid");

-- CreateIndex
CREATE INDEX "jodofundallocation_purpose_idx" ON "jodofundallocation"("purpose");

-- CreateIndex
CREATE INDEX "jodofundallocation_allocationstatus_idx" ON "jodofundallocation"("allocationstatus");

-- CreateIndex
CREATE INDEX "jodofundallocation_campaignid_idx" ON "jodofundallocation"("campaignid");

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_organizerid_fkey" FOREIGN KEY ("organizerid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_reviewerid_fkey" FOREIGN KEY ("reviewerid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation" ADD CONSTRAINT "donation_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation" ADD CONSTRAINT "donation_donorid_fkey" FOREIGN KEY ("donorid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaignupdate" ADD CONSTRAINT "campaignupdate_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_ownerid_fkey" FOREIGN KEY ("ownerid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawalrequest" ADD CONSTRAINT "withdrawalrequest_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawalrequest" ADD CONSTRAINT "withdrawalrequest_requesterid_fkey" FOREIGN KEY ("requesterid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawalrequest" ADD CONSTRAINT "withdrawalrequest_reviewerid_fkey" FOREIGN KEY ("reviewerid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reporterid_fkey" FOREIGN KEY ("reporterid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reviewerid_fkey" FOREIGN KEY ("reviewerid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditlog" ADD CONSTRAINT "auditlog_adminid_fkey" FOREIGN KEY ("adminid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state" ADD CONSTRAINT "state_countryid_fkey" FOREIGN KEY ("countryid") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_stateid_fkey" FOREIGN KEY ("stateid") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification" ADD CONSTRAINT "verification_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification" ADD CONSTRAINT "verification_reviewerid_fkey" FOREIGN KEY ("reviewerid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riskevent" ADD CONSTRAINT "riskevent_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riskevent" ADD CONSTRAINT "riskevent_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riskevent" ADD CONSTRAINT "riskevent_resolvedby_fkey" FOREIGN KEY ("resolvedby") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaignedit" ADD CONSTRAINT "campaignedit_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaignedit" ADD CONSTRAINT "campaignedit_reviewerid_fkey" FOREIGN KEY ("reviewerid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fundusageitem" ADD CONSTRAINT "fundusageitem_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privatedocument" ADD CONSTRAINT "privatedocument_uploadedbyid_fkey" FOREIGN KEY ("uploadedbyid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inforequest" ADD CONSTRAINT "inforequest_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inforequest" ADD CONSTRAINT "inforequest_requesterid_fkey" FOREIGN KEY ("requesterid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jodofundcontribution" ADD CONSTRAINT "jodofundcontribution_donorid_fkey" FOREIGN KEY ("donorid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jodofundallocation" ADD CONSTRAINT "jodofundallocation_contributionid_fkey" FOREIGN KEY ("contributionid") REFERENCES "jodofundcontribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jodofundallocation" ADD CONSTRAINT "jodofundallocation_campaignid_fkey" FOREIGN KEY ("campaignid") REFERENCES "campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jodofundallocation" ADD CONSTRAINT "jodofundallocation_approvedby_fkey" FOREIGN KEY ("approvedby") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

