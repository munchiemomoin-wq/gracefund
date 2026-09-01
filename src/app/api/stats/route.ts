import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [totalRaised, peopleHelped, activeCampaigns, countryCount] = await Promise.all([
      db.campaign.aggregate({ _sum: { raisedAmount: true }, where: { status: 'published' } }),
      db.campaign.aggregate({ _sum: { donorCount: true }, where: { status: 'published' } }),
      db.campaign.count({ where: { status: 'published' } }),
      db.country.count({ where: { active: true } }),
    ]);

    return NextResponse.json({
      totalRaised: totalRaised._sum.raisedAmount || 0,
      peopleHelped: peopleHelped._sum.donorCount || 0,
      activeCampaigns,
      countriesReached: countryCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
