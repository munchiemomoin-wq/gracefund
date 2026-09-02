const {Client} = require('pg');
const cs = 'postgresql://postgres.qhmqmkfdoazngxubpzrc:Jesuslovesyoujosh@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=no-verify';
async function main() {
  const c = new Client({connectionString: cs});
  await c.connect();
  const tables = ['country','state','city','category','platformsettings','auditlog','"User"','organization','campaign','campaignupdate','donation','favorite','report','withdrawalrequest','verification','riskevent','notification','campaignedit','fundusageitem','privatedocument','inforequest'];
  for (const t of tables) {
    try { await c.query(`DROP TABLE IF EXISTS "${t}" CASCADE`); console.log('Dropped:', t); } catch(e) { console.log('Error dropping', t, e.message); }
  }
  console.log('Done');
  await c.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
