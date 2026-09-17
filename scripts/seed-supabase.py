#!/usr/bin/env python3
"""Seed JodoFund database with sample data via Supabase pooler."""
import psycopg2, uuid
from datetime import datetime, timedelta, timezone

CONN = "postgresql://postgres.rdrlvbxxmfpooghmhwmk:Jesuslovesyoujosh@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require"
def uid(): return uuid.uuid4().hex[:25]

def main():
    conn = psycopg2.connect(CONN, connect_timeout=15)
    conn.autocommit = True
    cur = conn.cursor()
    now = datetime.now(timezone.utc)

    # Clear
    for t in ['auditlog','notification','report','riskevent','inforequest','campaignedit','favorite','fundusageitem','withdrawalrequest','verification','privatedocument','donation','jodofundallocation','jodofundcontribution','campaignupdate','campaign','organization','platformsettings','category','city','state','country','"User"']:
        try: cur.execute(f'DELETE FROM {t}')
        except: pass

    # Categories
    cat_ids = [uid() for _ in range(10)]
    for i,(n,s,d,ic) in enumerate([
        ('Medical & Health','medical-health','Medical bills, hospital expenses, surgeries, treatments, and health-related fundraising','heart-pulse'),
        ('Education','education','School fees, college tuition, scholarships, and educational support','graduation-cap'),
        ('Emergency','emergency','Urgent needs, natural disasters, accidents, and emergency relief','alert-triangle'),
        ('Community','community','Community projects, neighborhood support, and local initiatives','users'),
        ('Family & Children','family-children','Support for families, children in need, and household essentials','baby'),
        ('Animal Welfare','animal-welfare','Animal rescue, veterinary care, shelter, and animal support','paw-print'),
        ('Creative Projects','creative-projects','Art, music, film, and creative community projects','palette'),
        ('Sports','sports','Sports equipment, team support, and athletic programs','trophy'),
        ('Funeral & Memorial','funeral-memorial','Funeral expenses, memorial services, and end-of-life support','heart'),
        ('Disaster Relief','disaster-relief','Flood relief, fire relief, storm relief, emergency supplies, and disaster recovery','cloud-rain'),
    ]):
        cur.execute('INSERT INTO category (id,name,slug,description,icon,sortorder) VALUES (%s,%s,%s,%s,%s,%s)',(cat_ids[i],n,s,d,ic,i+1))
    print("Categories: 10")

    # Users
    u = [uid() for _ in range(8)]
    for uid_val,ah,nm,em,ph,rl,vl in [
        (u[0],None,'Admin User','admin@jodofund.org',None,'admin','organization'),
        (u[1],None,'Sarah Johnson','sarah@example.com','+91-9876543210','fundraiser','identity'),
        (u[2],None,'David Menon','david@example.com','+91-9876543211','organization','organization'),
        (u[3],None,'Maria Santos','maria@example.com',None,'fundraiser','basic'),
        (u[4],None,'James Okafor','james@example.com','+91-9876543212','fundraiser','identity'),
        (u[5],None,'Priya Sharma','priya@example.com','+91-9876543213','donor','basic'),
        (u[6],None,'Rahul Kapoor','rahul@example.com','+91-9876543214','donor','basic'),
        (u[7],None,'Anita Desai','anita@example.com','+91-9876543215','donor','identity'),
    ]:
        cur.execute('INSERT INTO "User" (id,authuserid,name,email,phone,avatarurl,role,status,verificationlevel,createdat,updatedat) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',(uid_val,ah,nm,em,ph,None,rl,'active',vl,now,now))
    print("Users: 8")

    # Organization
    cur.execute('INSERT INTO organization (id,ownerid,name,type,description,createdat,updatedat) VALUES (%s,%s,%s,%s,%s,%s,%s)',(uid(),u[2],'Menon Foundation','nonprofit','A non-profit organization dedicated to community development.',now,now))
    print("Organizations: 1")

    # Campaigns (status=active, verificationlevel=verified)
    c = [uid() for _ in range(6)]
    for cid,sl,ti,sh,st,ci,oi,bn,ga,ra,dc in [
        (c[0],'help-arjun-fight-cancer','Help Arjun Fight Cancer','Arjun needs urgent cancer treatment','<p>Arjun, a 7-year-old boy, has been diagnosed with leukemia.</p>',cat_ids[0],u[1],'Arjun Patel',500000,150000,25),
        (c[1],'educate-rural-girls','Educate Rural Girls','Supporting girls education','<p>Help us send 50 girls to school in rural Maharashtra.</p>',cat_ids[1],u[2],'Girls Education Program',2000000,450000,18),
        (c[2],'kerala-flood-relief','Kerala Flood Relief','Emergency flood relief','<p>Thousands of families displaced by severe flooding.</p>',cat_ids[9],u[4],'Kerala Flood Victims',5000000,1200000,42),
        (c[3],'save-stray-dogs','Save Stray Dogs','Rescue stray dogs','<p>Bangalore has over 200,000 stray dogs suffering on the streets.</p>',cat_ids[5],u[3],'Bangalore Stray Dogs',300000,85000,12),
        (c[4],'support-widow-family','Support Lakshmi','A widow needs help','<p>Lakshmi lost her husband and is struggling to provide for her children.</p>',cat_ids[4],u[1],'Lakshmi Devi',200000,67000,8),
        (c[5],'community-water-well','Community Water Well','Build a clean water well','<p>A village in Rajasthan has no access to clean water.</p>',cat_ids[3],u[4],'Rajasthan Village',800000,200000,15),
    ]:
        cur.execute('''INSERT INTO campaign (id,slug,title,shortdescription,story,categoryid,organizerid,beneficiaryname,
            goalamount,raisedamount,currency,donorcount,status,verificationlevel,createdat,updatedat)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)''',
            (cid,sl,ti,sh,st,ci,oi,bn,ga,ra,'INR',dc,'active','verified',now,now))
    print("Campaigns: 6")

    # Donations
    for di,ci2,di2,dn,de,am,pf,pt,tt,ts in [
        (uid(),c[0],u[5],'Priya Sharma','priya@example.com',5000,250,0,5000,now-timedelta(days=5)),
        (uid(),c[0],u[6],'Rahul Kapoor','rahul@example.com',10000,500,500,10500,now-timedelta(days=4)),
        (uid(),c[1],u[5],'Priya Sharma','priya@example.com',25000,1250,1000,26000,now-timedelta(days=3)),
        (uid(),c[1],u[7],'Anita Desai','anita@example.com',15000,750,0,15000,now-timedelta(days=2)),
        (uid(),c[2],u[5],'Priya Sharma','priya@example.com',50000,2500,2000,52000,now-timedelta(days=2)),
        (uid(),c[2],u[6],'Rahul Kapoor','rahul@example.com',25000,1250,1000,26000,now-timedelta(days=1)),
        (uid(),c[3],u[7],'Anita Desai','anita@example.com',5000,250,250,5250,now-timedelta(days=1)),
        (uid(),c[4],u[5],'Priya Sharma','priya@example.com',10000,500,0,10000,now-timedelta(hours=12)),
        (uid(),c[5],u[6],'Rahul Kapoor','rahul@example.com',20000,1000,1000,21000,now-timedelta(hours=6)),
        (uid(),c[5],u[7],'Anita Desai','anita@example.com',30000,1500,1500,31500,now),
    ]:
        cur.execute('''INSERT INTO donation (id,campaignid,donorid,donorname,donoremail,amount,currency,
            platformfee,platformtipamount,paymenttotalamount,paymentstatus,paymentprovider,paymentorderid,
            paymenttransactionid,donormessage,isanonymous,shownamepublicly,createdat)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)''',
            (di,ci2,di2,dn,de,am,'INR',pf,pt,tt,'succeeded','demo',f'DEMO-{uid()[:12]}',None,None,False,True,ts))
    print("Donations: 10")

    # Settings
    for k,v in [('platform_fee_percent','5'),('fixed_transaction_fee','0'),('donor_tip_enabled','true'),('default_tip_percent','5'),('admin_moderation_enabled','true'),('international_donations_enabled','false'),('site_name','JodoFund'),('site_tagline','Connect. Contribute. Change.'),('auto_approve_basic_verified','false'),('withdrawal_requires_verification','true')]:
        cur.execute('INSERT INTO platformsettings (id,key,value,updatedat) VALUES (%s,%s,%s,%s)',(uid(),k,v,now))
    print("Settings: 10")

    # Verify
    for t in ['"User"','campaign','donation','category']:
        cur.execute(f'SELECT count(*) FROM {t}')
        print(f"  {t}: {cur.fetchone()[0]}")
    print("\n✅ Seed complete!")
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
