const { Client } = require('pg');
const { randomUUID } = require('crypto');
const cs = 'postgresql://postgres.qhmqmkfdoazngxubpzrc:Jesuslovesyoujosh@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=no-verify';
const uid = () => randomUUID();
const run = async (client, sql, params) => (await client.query(sql, params)).rows;

async function main() {
  const client = new Client({ connectionString: cs });
  await client.connect();
  console.log('Connected');

  // Fresh start
  const tbls = ['inforequest','campaignedit','fundusageitem','privatedocument','notification','riskevent','verification','favorite','donation','campaignupdate','report','withdrawalrequest','campaign','organization','auditlog','platformsettings','city','state','country','category'];
  for (const t of tbls) await client.query('TRUNCATE TABLE ' + t + ' CASCADE');
  await client.query('TRUNCATE TABLE "User" CASCADE');
  console.log('Truncated all tables');

  // GEOGRAPHY
  const countries = await run(client, `INSERT INTO country (id,name,code,currency,currencysymbol) VALUES
    ($1,'India','IN','INR','₹'),($2,'United States','US','USD','$'),($3,'United Kingdom','GB','GBP','£'),
    ($4,'United Arab Emirates','AE','AED','د.إ'),($5,'Nigeria','NG','NGN','₦'),
    ($6,'Kenya','KE','KES','KSh'),($7,'Philippines','PH','PHP','₱'),($8,'Brazil','BR','BRL','R$') RETURNING id`,
    [uid(),uid(),uid(),uid(),uid(),uid(),uid(),uid(),uid()]);
  const india = countries[0];
  console.log('Created 8 countries');

  const states = await run(client, `INSERT INTO state (id,name,countryid,code) VALUES
    ($1,'Telangana',$2,'TG'),($3,'Andhra Pradesh',$2,'AP'),($4,'Karnataka',$2,'KA'),
    ($5,'Tamil Nadu',$2,'TN'),($6,'Maharashtra',$2,'MH') RETURNING id`,
    [uid(),india.id,uid(),uid(),uid()]);
  const [tg,ap,ka,tn,mh] = states;
  console.log('Created 5 states');

  await run(client, `INSERT INTO city (id,name,stateid) VALUES
    ($1,'Hyderabad',$2),($3,'Warangal',$2),($4,'Visakhapatnam',$5),($6,'Vijayawada',$5),
    ($7,'Bangalore',$8),($9,'Chennai',$10),($11,'Mumbai',$12)`,
    [uid(),tg.id,uid(),ap.id,uid(),uid(),ka.id,uid(),tn.id,uid(),mh.id]);
  console.log('Created 7 cities');

  // CATEGORIES
  const cats = await run(client, `INSERT INTO category (id,name,slug,description,icon,sortorder) VALUES
    ($1,'Medical & Health','medical-health','Medical treatment, surgery, emergency care','heart-pulse',1),
    ($2,'Education','education','School fees, college, educational projects','graduation-cap',2),
    ($3,'Emergency','emergency','Family emergencies, accidents, fires, natural disasters','alert-triangle',3),
    ($4,'Family & Personal','family-personal','Family support, housing, food support','home',4),
    ($5,'Funeral & Memorial','funeral-memorial','Funeral expenses, memorial support','flower-2',5),
    ($6,'Children','children','Child education, child welfare','baby',6),
    ($7,'Community','community','Community development, local projects','users',7),
    ($8,'Charity & Nonprofit','charity-nonprofit','Registered charities, NGOs','globe',8),
    ($9,'Animal Welfare','animal-welfare','Animal rescue, veterinary treatment','paw-print',9),
    ($10,'Disaster Relief','disaster-relief','Flood relief, fire relief, emergency supplies','cloud-rain',10) RETURNING id`,
    [uid(),uid(),uid(),uid(),uid(),uid(),uid(),uid(),uid(),uid()]);
  const [catMed,catEdu,catEmerg,catFamily,catFuneral,catChild,catComm] = cats;
  console.log('Created 10 categories');

  // USERS
  const users = await run(client, `INSERT INTO "User" (id,name,email,role,verificationlevel,status) VALUES
    ($1,'Admin User','admin@jodofund.org','admin','organization','active'),
    ($2,'Sarah Johnson','sarah@example.com','fundraiser','identity','active'),
    ($3,'David Menon','david@example.com','organization','organization','active'),
    ($4,'Maria Santos','maria@example.com','fundraiser','basic','active'),
    ($5,'James Okafor','james@example.com','fundraiser','identity','active'),
    ($6,'Ruth Kumar','ruth@example.com','fundraiser','identity','active'),
    ($7,'Priya Sharma','priya@example.com','fundraiser','identity','active'),
    ($8,'Michael Chen','michael@example.com','donor','basic','active'),
    ($9,'Grace Williams','grace@example.com','donor','basic','active') RETURNING id,name,email,role`,
    [uid(),uid(),uid(),uid(),uid(),uid(),uid(),uid(),uid(),uid()]);
  const [,,sarah,david,maria,james,ruth,priya,michael,grace] = users;
  console.log('Created 9 users');

  // ORGANIZATIONS
  await run(client, `INSERT INTO organization (id,ownerid,name,type,description,city,verificationstatus) VALUES
    ($1,$2,'Seva Foundation','ngo','Nonprofit in community development','Hyderabad','verified'),
    ($3,$4,'Hope Foundation','charity','Education and child welfare','Bangalore','verified')`,
    [uid(),david.id,uid(),priya.id]);
  console.log('Created 2 organizations');

  const covers = [
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=500&fit=crop',
  ];
  const features = JSON.stringify({donor_messages:true,anonymous_donations:true,campaign_updates:true});

  // CAMPAIGNS
  const campDefs = [
    {s:'emergency-medical-treatment-father',t:'Help a Father Receive Emergency Medical Treatment',d:'Rajesh needs urgent heart surgery.',cat:'catMed',org:'ruth',type:'family',goal:800000,raised:456000,feat:true,urg:true,vl:'identity',ci:0,donors:234,views:5670,end:'2026-10-15'},
    {s:'help-student-continue-education',t:'Help a Student Continue Her Education',d:'Anita is a bright 14-year-old from a low-income family.',cat:'catEdu',org:'sarah',type:'individual',goal:50000,raised:32500,feat:true,urg:false,vl:'identity',ci:1,donors:87,views:2340,end:'2026-12-31'},
    {s:'support-family-after-house-fire',t:'Support a Family After a House Fire',d:'The Patel family lost everything in a devastating house fire.',cat:'catEmerg',org:'maria',type:'family',goal:600000,raised:287000,feat:true,urg:true,vl:'basic',ci:2,donors:145,views:3890,end:'2026-11-30'},
    {s:'provide-school-supplies-children',t:'Provide School Supplies for 100 Children',d:'Children in rural areas attend school without proper supplies.',cat:'catChild',org:'james',type:'charity',goal:150000,raised:89700,feat:false,urg:false,vl:'identity',ci:3,donors:203,views:4210,end:'2026-11-30'},
    {s:'community-food-distribution',t:'Community Food Distribution Project',d:'Help us feed 500 families every weekend.',cat:'catComm',org:'sarah',type:'community',goal:600000,raised:234000,feat:false,urg:false,vl:'identity',ci:4,donors:178,views:3120,end:'2027-01-31'},
    {s:'rebuild-community-center',t:'Help Rebuild a Community Center',d:'A cyclone damaged our community center.',cat:'catComm',org:'priya',type:'community',goal:1500000,raised:875000,feat:true,urg:false,vl:'identity',ci:5,donors:312,views:6780,end:'2027-03-01'},
    {s:'funeral-support-grieving-family',t:'Funeral Support for a Grieving Family',d:'The Thomas family lost their mother unexpectedly.',cat:'catFuneral',org:'ruth',type:'family',goal:75000,raised:52000,feat:false,urg:true,vl:'basic',ci:6,donors:98,views:1890,end:'2026-09-30'},
    {s:'help-build-well-rural-village',t:'Help Build a Well in Rural Village',d:'Our village has no clean drinking water.',cat:'catComm',org:'james',type:'community',goal:150000,raised:0,feat:false,urg:false,vl:'basic',ci:7,donors:0,views:0,end:'2027-02-28',status:'under_review'},
    {s:'support-after-school-tutoring',t:'Support After-School Tutoring Program',d:'Free tutoring for underprivileged children.',cat:'catEdu',org:'maria',type:'charity',goal:200000,raised:0,feat:false,urg:false,vl:'none',ci:8,donors:0,views:0,end:'2027-03-31',status:'under_review'},
  ];

  const campaigns = [];
  for (const def of campDefs) {
    const cid = uid();
    const st = def.status || 'published';
    await run(client, `INSERT INTO campaign (id,slug,title,shortdescription,categoryid,organizerid,campaigntype,goalamount,raisedamount,currency,status,verificationlevel,isfeatured,isurgent,campaignfeatures,coverimage,donorcount,viewcount,enddate,submittedat,reviewedat,reviewerid,risklevel)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'INR',$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`,
      [cid,def.s,def.t,def.d,eval('cat.'+def.cat).id,def.org,def.type,def.goal,def.raised,st,def.vl,def.feat,def.urg,features,covers[def.ci],def.donors,def.views,new Date(def.end),new Date('2026-07-01'),new Date('2026-07-02'),adminId,'low']);
    campaigns.push({id:cid,...def});
  }
  console.log(`Created ${campaigns.length} campaigns`);

  // DONATIONS
  const donorNames = ['Anonymous Donor','Michael Chen','Grace Williams','John Smith','Emily Davis','Robert Wilson','Sarah Brown','David Lee','Jennifer Martinez','Chris Anderson'];
  const messages = ['You are in my thoughts.','Sending strength.','Keep going.','Wishing you the very best.','Stay strong.','Hope this helps.','Thinking of you.','Wishing a speedy recovery.','Well done for organizing this.','Proud to support this cause.'];
  const amounts = [500,1000,2500,5000,10000];
  let donCount = 0;
  for (let ci = 0; ci < 7; ci++) {
    const camp = campaigns[ci];
    const n = 5 + Math.floor(Math.random() * 10);
    for (let i = 0; i < n; i++) {
      const amt = amounts[Math.floor(Math.random() * amounts.length)];
      const tip = Math.random() > 0.6 ? [0, 25, 50, 100][Math.floor(Math.random() * 4)] : 0;
      await run(client, `INSERT INTO donation (id,campaignid,donorname,amount,currency,platformtipamount,paymenttotalamount,paymentstatus,paymentprovider,paymentorderid,paymenttransactionid,idempotencykey,donormessage,isanonymous,createdat)
        VALUES ($1,$2,$3,$4,'INR',$5,$6,'succeeded','demo',$7,$8,$9,$10,$11,$12)`,
        [uid(),camp.id,donorNames[Math.floor(Math.random()*donorNames.length)],amt,tip,amt+tip,`DEMO-${Date.now()}-${ci}-${i}`,`DEMO-TXN-${Date.now()}-${ci}-${i}`,`seed-${ci}-${i}-${Date.now()}`,messages[Math.floor(Math.random()*messages.length)],Math.random()>0.7,new Date(Date.now()-Math.random()*30*86400000)]);
      donCount++;
    }
  }
  console.log(`Created ${donCount} donations`);

  // CAMPAIGN UPDATES
  await run(client, `INSERT INTO campaignupdate (id,campaignid,title,content,createdat) VALUES ($1,$2,'Thank You!','We reached 65% of our goal!','2026-08-15')`, [uid(),campaigns[1].id]);
  await run(client, `INSERT INTO campaignupdate (id,campaignid,title,content,createdat) VALUES ($1,$2,'Anita Started Her New Term','Thanks to your support.','2026-07-20')`, [uid(),campaigns[1].id]);
  await run(client, `INSERT INTO campaignupdate (id,campaignid,title,content,createdat) VALUES ($1,$2,'Surgery Date Confirmed','Rajesh surgery has been scheduled.','2026-08-20')`, [uid(),campaigns[0].id]);
  await run(client, `INSERT INTO campaignupdate (id,campaignid,title,content,createdat) VALUES ($1,$2,'Cleanup Complete','The foundation is intact.','2026-08-10')`, [uid(),campaigns[5].id]);
  await run(client, `INSERT INTO campaignupdate (id,campaignid,title,content,createdat) VALUES ($1,$2,'Temporary Space Secured','A temporary space for programs is ready.','2026-08-25')`, [uid(),campaigns[5].id]);
  await run(client, `INSERT INTO campaignupdate (id,campaignid,title,content,createdat) VALUES ($1,$2,'Family Moved to Temporary Housing','The Patel family found temporary housing.','2026-08-22')`, [uid(),campaigns[2].id]);
  console.log('Created 6 campaign updates');

  // REPORTS
  await run(client, `INSERT INTO report (id,campaignid,reporterid,reason,description,status,risklevel,createdat) VALUES ($1,$2,$3,'Incorrect beneficiary information','Beneficiary name seems different.','new','low','2026-09-01')`, [uid(),campaigns[6].id,michael.id]);
  await run(client, `INSERT INTO report (id,campaignid,reporterid,reason,description,status,risklevel,createdat) VALUES ($1,$2,$3,'Misleading information','Amount seems inflated.','under_review','medium','2026-08-28')`, [uid(),campaigns[2].id,grace.id]);
  await run(client, `INSERT INTO report (id,campaignid,reporterid,reason,description,status,risklevel,createdat) VALUES ($1,$2,$3,'Suspicious use of funds','Campaign goal was increased.','dismissed','low','2026-08-15')`, [uid(),campaigns[4].id,michael.id]);
  console.log('Created 3 reports');

  // VERIFICATIONS
  await run(client, `INSERT INTO verification (id,userid,level,status,submittedat,reviewedat,reviewerid,reviewnotes,documents,expirydate) VALUES ($1,$2,'identity','verified','2026-06-01','2026-06-03',$3,'Government ID verified.','["identity_proof"]','2027-06-03')`, [uid(),sarah.id,adminId]);
  await run(client, `INSERT INTO verification (id,userid,level,status,submittedat,reviewedat,reviewerid,reviewnotes,documents,expirydate) VALUES ($1,$2,'identity','verified','2026-05-20','2026-05-22',$3,'Aadhaar card verified.','["identity_proof","address_proof"]','2027-05-22')`, [uid(),james.id,adminId]);
  await run(client, `INSERT INTO verification (id,userid,level,status,submittedat,reviewedat,reviewerid,reviewnotes,documents,expirydate) VALUES ($1,$2,'organization','verified','2026-04-01','2026-04-05',$3,'Organization registration verified.','["organization_registration"]','2027-04-05')`, [uid(),priya.id,adminId]);
  await run(client, `INSERT INTO verification (id,userid,level,status,submittedat,reviewedat,reviewerid,reviewnotes,documents,expirydate) VALUES ($1,$2,'identity','documents_submitted','2026-08-28',null,null,null,'["identity_proof"]',null)`, [uid(),maria.id]);
  console.log('Created 4 verifications');

  // WITHDRAWALS
  await run(client, `INSERT INTO withdrawalrequest (id,campaignid,requesterid,amount,status,reviewerid,reviewedat,reviewnotes,paymentreference,paidat,requestedat) VALUES ($1,$2,$3,200000,'approved',$4,'2026-08-25','First withdrawal approved.','PAY-2026-001','2026-08-26','2026-08-20')`, [uid(),campaigns[0].id,ruth.id,adminId]);
  await run(client, `INSERT INTO withdrawalrequest (id,campaignid,requesterid,amount,status,requestedat) VALUES ($1,$2,$3,150000,'under_review','2026-09-01')`, [uid(),campaigns[0].id,ruth.id]);
  await run(client, `INSERT INTO withdrawalrequest (id,campaignid,requesterid,amount,status,requestedat) VALUES ($1,$2,$3,20000,'requested','2026-09-01')`, [uid(),campaigns[1].id,sarah.id]);
  await run(client, `INSERT INTO withdrawalrequest (id,campaignid,requesterid,amount,status,reviewerid,reviewedat,reviewnotes,requestedat) VALUES ($1,$2,$3,500000,'documents_required',$4,'2026-08-30','Please upload contractor invoices.','2026-08-25')`, [uid(),campaigns[5].id,priya.id,adminId]);
  console.log('Created 4 withdrawal requests');

  // RISK EVENTS
  await run(client, `INSERT INTO riskevent (id,userid,campaignid,eventtype,severity,description,createdat) VALUES ($1,$2,$3,'multiple_campaigns','low','Created 2 campaigns in 30 days.','2026-09-01')`, [uid(),maria.id,campaigns[7]?.id]);
  await run(client, `INSERT INTO riskevent (id,campaignid,eventtype,severity,description,createdat) VALUES ($1,$2,'multiple_reports','medium','2 reports in 7 days.','2026-08-29')`, [uid(),campaigns[2].id]);
  await run(client, `INSERT INTO riskevent (id,userid,eventtype,severity,description,createdat) VALUES ($1,$2,'verification_failure','medium','Unclear document image.','2026-08-27')`, [uid(),maria.id]);
  console.log('Created 3 risk events');

  // NOTIFICATIONS
  await run(client, `INSERT INTO notification (id,userid,type,title,message,entitytype,entityid,isread,createdat) VALUES ($1,$2,'campaign_under_review','Campaign Under Review','Your campaign is under review.','campaign',$3,false,'2026-09-01')`, [uid(),james.id,campaigns[7]?.id]);
  await run(client, `INSERT INTO notification (id,userid,type,title,message,entitytype,entityid,isread,createdat) VALUES ($1,$2,'campaign_under_review','Campaign Under Review','Your campaign is under review.','campaign',$3,false,'2026-08-31')`, [uid(),maria.id,campaigns[8]?.id]);
  await run(client, `INSERT INTO notification (id,userid,type,title,message,entitytype,entityid,isread,createdat) VALUES ($1,$2,'withdrawal_status_changed','Withdrawal Under Review','Your withdrawal is under review.','withdrawal',$3,true,'2026-09-01')`, [uid(),ruth.id,campaigns[0]?.id]);
  await run(client, `INSERT INTO notification (id,userid,type,title,message,entitytype,entityid,isread,createdat) VALUES ($1,$2,'withdrawal_status_changed','Documents Required','Please upload contractor invoices.','withdrawal',$3,false,'2026-08-30')`, [uid(),priya.id,campaigns[5]?.id]);
  await run(client, `INSERT INTO notification (id,userid,type,title,message,entitytype,entityid,isread,createdat) VALUES ($1,$2,'new_campaign_submitted','New Campaign Submitted','A new campaign has been submitted.','campaign',$3,true,'2026-09-01')`, [uid(),adminId,campaigns[7]?.id]);
  await run(client, `INSERT INTO notification (id,userid,type,title,message,entitytype,entityid,isread,createdat) VALUES ($1,$2,'high_risk_detected','Risk Event Detected','Multiple reports received.','campaign',$3,false,'2026-08-29')`, [uid(),adminId,campaigns[2]?.id]);
  await run(client, `INSERT INTO notification (id,userid,type,title,message,entitytype,entityid,isread,createdat) VALUES ($1,$2,'withdrawal_requested','New Withdrawal Request','A withdrawal has been requested.','withdrawal',$3,true,'2026-09-01')`, [uid(),adminId,campaigns[0]?.id]);
  console.log('Created 7 notifications');

  // AUDIT LOGS
  await run(client, `INSERT INTO auditlog (id,adminid,action,entitytype,entityid,newvalue,createdat) VALUES ($1,$2,'campaign_approved','campaign',$3,'{"status":"published"}','2026-07-02')`, [uid(),adminId,campaigns[0].id]);
  await run(client, `INSERT INTO auditlog (id,adminid,action,entitytype,entityid,newvalue,createdat) VALUES ($1,$2,'campaign_approved','campaign',$3,'{"status":"published"}','2026-06-16')`, [uid(),adminId,campaigns[1].id]);
  await run(client, `INSERT INTO auditlog (id,adminid,action,entitytype,entityid,newvalue,createdat) VALUES ($1,$2,'verification_approved','verification',$3,'{"level":"identity"}','2026-06-03')`, [uid(),adminId,sarah.id]);
  await run(client, `INSERT INTO auditlog (id,adminid,action,entitytype,entityid,newvalue,createdat) VALUES ($1,$2,'withdrawal_approved','withdrawal',$3,'{"amount":200000}','2026-08-25')`, [uid(),adminId,campaigns[0].id]);
  await run(client, `INSERT INTO auditlog (id,adminid,action,entitytype,entityid,newvalue,createdat) VALUES ($1,$2,'report_dismissed','report',$3,'{"status":"dismissed"}','2026-08-20')`, [uid(),adminId,campaigns[4]?.id]);
  await run(client, `INSERT INTO auditlog (id,adminid,action,entitytype,entityid,newvalue,createdat) VALUES ($1,$2,'campaign_approved','campaign',$3,'{"status":"published"}','2026-07-21')`, [uid(),adminId,campaigns[2].id]);
  console.log('Created 6 audit logs');

  // PRIVATE DOCUMENTS
  await run(client, `INSERT INTO privatedocument (id,entitytype,entityid,documenttype,filename,filesize,mimetype,storagepath,uploadedbyid,accesslevel,status) VALUES ($1,'verification',$2,'identity_proof','sarah_aadhaar.jpg',245000,'image/jpeg','/private/verification/sarah.jpg',$3,'admin_only','approved')`, [uid(),sarah.id]);
  await run(client, `INSERT INTO privatedocument (id,entitytype,entityid,documenttype,filename,filesize,mimetype,storagepath,uploadedbyid,accesslevel,status) VALUES ($1,'verification',$2,'identity_proof','james_aadhaar.jpg',198000,'image/jpeg','/private/verification/james.jpg',$3,'admin_only','approved')`, [uid(),james.id]);
  await run(client, `INSERT INTO privatedocument (id,entitytype,entityid,documenttype,filename,filesize,mimetype,storagepath,uploadedbyid,accesslevel,status) VALUES ($1,'organization',$2,'organization_registration','hope_foundation.pdf',520000,'application/pdf','/private/org/hope.pdf',$3,'admin_only','approved')`, [uid(),priya.id]);
  await run(client, `INSERT INTO privatedocument (id,entitytype,entityid,documenttype,filename,filesize,mimetype,storagepath,uploadedbyid,accesslevel,status) VALUES ($1,'withdrawal',$2,'expense_proof','invoice.pdf',310000,'application/pdf','/private/withdrawal/invoice.pdf',$3,'admin_only','pending')`, [uid(),campaigns[5].id]);
  await run(client, `INSERT INTO privatedocument (id,entitytype,entityid,documenttype,filename,filesize,mimetype,storagepath,uploadedbyid,accesslevel,status) VALUES ($1,'verification',$2,'identity_proof','maria_id.jpg',180000,'image/jpeg','/private/verification/maria.jpg',$3,'admin_only','pending')`, [uid(),maria.id]);
  console.log('Created 5 private documents');

  // PLATFORM SETTINGS
  const settings = [['platform_fee_percent','5'],['fixed_transaction_fee','0'],['donor_tip_enabled','true'],['default_tip_percent','5'],['admin_moderation_enabled','true'],['international_donations_enabled','false'],['site_name','JodoFund'],['site_tagline','Connect. Contribute. Change.'],['auto_approve_basic_verified','false'],['withdrawal_requires_verification','true']];
  for (const [k, v] of settings) await run(client, `INSERT INTO platformsettings (id,key,value) VALUES ($1,$2)`, [uid(), k, v]);
  console.log('Created 9 platform settings');

  // INFO REQUEST
  await run(client, `INSERT INTO inforequest (id,campaignid,requesterid,message,requireddocuments,duedate,status,createdat) VALUES
    ($1,$2,$3,'Please upload contractor invoices and bank statements.','["expense_proof","bank_document"]','2026-09-10','pending','2026-08-30')`,
    [uid(),campaigns[5].id,adminId]);
  console.log('Created 1 info request');

  await client.end();
  console.log('\nSeed complete! Database is ready with demo data.');
}
main().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });
