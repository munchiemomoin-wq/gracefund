const { Client } = require('pg')
const cs = 'postgresql://postgres.qhmqmkfdoazngxubpzrc:Jesuslovesyoujosh@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=no-verify'

async function main() {
  const c = new Client({ connectionString: cs })
  await c.connect()
  console.log('Connected')

  // Drop all
  for (const t of ['InfoRequest','CampaignEdit','FundUsageItem','PrivateDocument','Notification','RiskEvent','Verification','Favorite','Donation','CampaignUpdate','Report','WithdrawalRequest','Campaign','Organization','AuditLog','User','PlatformSettings','City','State','Country','Category']) {
    await c.query(`DROP TABLE IF EXISTS "${t}" CASCADE`)
  }
  console.log('Dropped all tables')

  // Create all tables with lowercase column names (PostgreSQL convention)
  // No quoting needed anywhere
  await c.query(`
    CREATE TABLE country (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL UNIQUE,
      currency TEXT, currencysymbol TEXT, active BOOLEAN DEFAULT true
    );
    CREATE TABLE state (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, countryid TEXT NOT NULL REFERENCES country(id), code TEXT
    );
    CREATE TABLE city (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, stateid TEXT NOT NULL REFERENCES state(id)
    );
    CREATE TABLE category (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
      description TEXT, icon TEXT, active BOOLEAN DEFAULT true, sortorder INT DEFAULT 0
    );
    CREATE TABLE platformsettings (
      id TEXT PRIMARY KEY, key TEXT NOT NULL UNIQUE, value TEXT, updatedat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE \"User\" (
      id TEXT PRIMARY KEY, authuserid TEXT UNIQUE, name TEXT,
      email TEXT NOT NULL UNIQUE, phone TEXT, avatarurl TEXT,
      role TEXT DEFAULT 'visitor', status TEXT DEFAULT 'active',
      verificationlevel TEXT DEFAULT 'none',
      createdat TIMESTAMP DEFAULT NOW(), updatedat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE campaign (
      id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
      shortdescription TEXT, story TEXT, categoryid TEXT REFERENCES category(id),
      organizerid TEXT REFERENCES \"User\"(id),
      beneficiaryname TEXT, beneficiaryrelationship TEXT, beneficiarycontact TEXT,
      countryid TEXT, stateid TEXT, cityid TEXT,
      goalamount DOUBLE PRECISION NOT NULL, raisedamount DOUBLE PRECISION DEFAULT 0,
      currency TEXT DEFAULT 'INR', status TEXT DEFAULT 'draft',
      verificationlevel TEXT DEFAULT 'none',
      isfeatured BOOLEAN DEFAULT false, isurgent BOOLEAN DEFAULT false,
      campaigntype TEXT DEFAULT 'individual', campaignfeatures TEXT,
      coverimage TEXT, videourl TEXT, enddate TIMESTAMP,
      donorcount INT DEFAULT 0, viewcount INT DEFAULT 0,
      risklevel TEXT DEFAULT 'low', investigationsettings TEXT,
      submittedat TIMESTAMP, reviewedat TIMESTAMP,
      reviewerid TEXT REFERENCES \"User\"(id),
      reviewnotes TEXT, rejectionreason TEXT,
      createdat TIMESTAMP DEFAULT NOW(), updatedat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE organization (
      id TEXT PRIMARY KEY, ownerid TEXT NOT NULL UNIQUE REFERENCES \"User\"(id),
      name TEXT NOT NULL, type TEXT NOT NULL, description TEXT,
      logourl TEXT, coverimageurl TEXT, website TEXT,
      country TEXT, city TEXT, registrationinfo TEXT,
      verificationstatus TEXT DEFAULT 'pending', sociallinks TEXT,
      createdat TIMESTAMP DEFAULT NOW(), updatedat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE donation (
      id TEXT PRIMARY KEY, campaignid TEXT NOT NULL REFERENCES campaign(id),
      donorid TEXT REFERENCES \"User\"(id),
      donorname TEXT, donoremail TEXT,
      amount DOUBLE PRECISION NOT NULL, currency TEXT DEFAULT 'INR',
      platformfee DOUBLE PRECISION DEFAULT 0,
      platformtipamount DOUBLE PRECISION DEFAULT 0,
      paymenttotalamount DOUBLE PRECISION NOT NULL,
      paymentstatus TEXT DEFAULT 'pending',
      paymentprovider TEXT, paymentorderid TEXT, paymenttransactionid TEXT,
      providerresponse TEXT, idempotencykey TEXT UNIQUE,
      donormessage TEXT, isanonymous BOOLEAN DEFAULT false,
      shownamepublicly BOOLEAN DEFAULT true,
      createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE campaignupdate (
      id TEXT PRIMARY KEY, campaignid TEXT NOT NULL REFERENCES campaign(id),
      title TEXT NOT NULL, content TEXT, imageurl TEXT,
      status TEXT DEFAULT 'published', createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE withdrawalrequest (
      id TEXT PRIMARY KEY, campaignid TEXT NOT NULL REFERENCES campaign(id),
      requesterid TEXT NOT NULL REFERENCES \"User\"(id),
      amount DOUBLE PRECISION NOT NULL, status TEXT DEFAULT 'requested',
      bankdetails TEXT, rejectionreason TEXT,
      reviewerid TEXT REFERENCES \"User\"(id),
      reviewedat TIMESTAMP, reviewnotes TEXT,
      paymentreference TEXT, paidat TIMESTAMP,
      requestedat TIMESTAMP DEFAULT NOW(), processedat TIMESTAMP
    );
    CREATE TABLE report (
      id TEXT PRIMARY KEY, campaignid TEXT NOT NULL REFERENCES campaign(id),
      reporterid TEXT NOT NULL REFERENCES \"User\"(id),
      reason TEXT NOT NULL, description TEXT,
      status TEXT DEFAULT 'new', risklevel TEXT DEFAULT 'medium',
      adminnotes TEXT, reviewerid TEXT REFERENCES \"User\"(id),
      reviewedat TIMESTAMP, resolvedat TIMESTAMP,
      createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE auditlog (
      id TEXT PRIMARY KEY, adminid TEXT REFERENCES \"User\"(id),
      action TEXT NOT NULL, entitytype TEXT NOT NULL, entityid TEXT,
      previousvalue TEXT, newvalue TEXT, metadata TEXT,
      createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE favorite (
      id TEXT PRIMARY KEY, campaignid TEXT NOT NULL REFERENCES campaign(id),
      userid TEXT REFERENCES \"User\"(id), createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE verification (
      id TEXT PRIMARY KEY, userid TEXT NOT NULL REFERENCES \"User\"(id),
      level TEXT NOT NULL, status TEXT DEFAULT 'not_started',
      submittedat TIMESTAMP, reviewedat TIMESTAMP,
      reviewerid TEXT REFERENCES \"User\"(id),
      reviewnotes TEXT, rejectionreason TEXT, expirydate TIMESTAMP,
      documents TEXT, createdat TIMESTAMP DEFAULT NOW(), updatedat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE riskevent (
      id TEXT PRIMARY KEY, userid TEXT REFERENCES \"User\"(id),
      campaignid TEXT REFERENCES campaign(id),
      eventtype TEXT NOT NULL, severity TEXT DEFAULT 'medium',
      description TEXT NOT NULL, metadata TEXT, resolvedat TIMESTAMP,
      resolvedby TEXT REFERENCES \"User\"(id),
      createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE notification (
      id TEXT PRIMARY KEY, userid TEXT NOT NULL REFERENCES \"User\"(id),
      type TEXT NOT NULL, title TEXT NOT NULL, message TEXT NOT NULL,
      entitytype TEXT, entityid TEXT, isread BOOLEAN DEFAULT false,
      createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE campaignedit (
      id TEXT PRIMARY KEY, campaignid TEXT NOT NULL REFERENCES campaign(id),
      field TEXT NOT NULL, oldvalue TEXT, newvalue TEXT,
      status TEXT DEFAULT 'pending', reviewerid TEXT REFERENCES \"User\"(id),
      reviewedat TIMESTAMP, reviewnotes TEXT, createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE fundusageitem (
      id TEXT PRIMARY KEY, campaignid TEXT NOT NULL REFERENCES campaign(id),
      category TEXT NOT NULL, amount DOUBLE PRECISION NOT NULL,
      description TEXT, sortorder INT DEFAULT 0, createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE privatedocument (
      id TEXT PRIMARY KEY, entitytype TEXT NOT NULL, entityid TEXT NOT NULL,
      documenttype TEXT NOT NULL, filename TEXT NOT NULL, filesize INT,
      mimetype TEXT, storagepath TEXT NOT NULL,
      storagebucket TEXT DEFAULT 'private-documents',
      uploadedbyid TEXT REFERENCES \"User\"(id),
      accesslevel TEXT DEFAULT 'admin_only', status TEXT DEFAULT 'pending',
      reviewnotes TEXT, createdat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE inforequest (
      id TEXT PRIMARY KEY, campaignid TEXT NOT NULL REFERENCES campaign(id),
      requesterid TEXT NOT NULL REFERENCES \"User\"(id),
      message TEXT NOT NULL, requireddocuments TEXT, duedate TIMESTAMP,
      status TEXT DEFAULT 'pending', responsemessage TEXT,
      respondedat TIMESTAMP, createdat TIMESTAMP DEFAULT NOW()
    );

    -- INDEXES
    CREATE INDEX idx_user_authuserid ON \"User\"(authuserid);
    CREATE INDEX idx_user_email ON \"User\"(email);
    CREATE INDEX idx_user_role ON \"User\"(role);
    CREATE INDEX idx_user_status ON \"User\"(status);
    CREATE INDEX idx_campaign_status ON campaign(status);
    CREATE INDEX idx_campaign_categoryid ON campaign(categoryid);
    CREATE INDEX idx_campaign_organizerid ON campaign(organizerid);
    CREATE INDEX idx_campaign_slug ON campaign(slug);
    CREATE INDEX idx_campaign_createdat ON campaign(createdat);
    CREATE INDEX idx_donation_campaignid ON donation(campaignid);
    CREATE INDEX idx_donation_donorid ON donation(donorid);
    CREATE INDEX idx_donation_paymentstatus ON donation(paymentstatus);
    CREATE INDEX idx_donation_idempotencykey ON donation(idempotencykey);
    CREATE INDEX idx_donation_createdat ON donation(createdat);
    CREATE INDEX idx_withdrawalrequest_campaignid ON withdrawalrequest(campaignid);
    CREATE INDEX idx_withdrawalrequest_requesterid ON withdrawalrequest(requesterid);
    CREATE INDEX idx_withdrawalrequest_status ON withdrawalrequest(status);
    CREATE INDEX idx_report_campaignid ON report(campaignid);
    CREATE INDEX idx_report_reporterid ON report(reporterid);
    CREATE INDEX idx_report_status ON report(status);
    CREATE INDEX idx_auditlog_adminid ON auditlog(adminid);
    CREATE INDEX idx_auditlog_entitytype ON auditlog(entitytype);
    CREATE INDEX idx_auditlog_createdat ON auditlog(createdat);
    CREATE INDEX idx_favorite_campaignid ON favorite(campaignid);
    CREATE INDEX idx_favorite_userid ON favorite(userid);
    CREATE INDEX idx_verification_userid ON verification(userid);
    CREATE INDEX idx_verification_status ON verification(status);
    CREATE INDEX idx_verification_level ON verification(level);
    CREATE INDEX idx_riskevent_userid ON riskevent(userid);
    CREATE INDEX idx_riskevent_campaignid ON riskevent(campaignid);
    CREATE INDEX idx_riskevent_severity ON riskevent(severity);
    CREATE INDEX idx_riskevent_createdat ON riskevent(createdat);
    CREATE INDEX idx_notification_userid ON notification(userid);
    CREATE INDEX idx_notification_isread ON notification(isread);
    CREATE INDEX idx_notification_createdat ON notification(createdat);
    CREATE INDEX idx_campaignedit_campaignid ON campaignedit(campaignid);
    CREATE INDEX idx_campaignedit_status ON campaignedit(status);
    CREATE INDEX idx_fundusageitem_campaignid ON fundusageitem(campaignid);
    CREATE INDEX idx_privatedocument_entitytype ON privatedocument(entitytype);
    CREATE INDEX idx_privatedocument_entityid ON privatedocument(entityid);
    CREATE INDEX idx_privatedocument_uploadedbyid ON privatedocument(uploadedbyid);
    CREATE INDEX idx_privatedocument_status ON privatedocument(status);
    CREATE INDEX idx_inforequest_campaignid ON inforequest(campaignid);
    CREATE INDEX idx_inforequest_requesterid ON inforequest(requesterid);
    CREATE INDEX idx_inforequest_status ON inforequest(status);
    CREATE INDEX idx_state_countryid ON state(countryid);
    CREATE INDEX idx_city_stateid ON city(stateid);
  `)
  console.log('All 21 tables created with indexes and foreign keys')
  await c.end()
}
main().catch(e => { console.error('FAILED:', e.message); process.exit(1) })
