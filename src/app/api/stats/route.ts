import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Public platform stats (safe aggregated data - no auth required)
export async function GET() {
  try {
    const [
      totalRaised,
      totalDonors,
      activeCampaigns,
      countryCount,
    ] = await Promise.all([
      db.donation.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'succeeded' },
      }),
      db.donation.groupBy({ by: ['donorId'], where: { paymentStatus: 'succeeded' } }),
      db.campaign.count({ where: { status: 'published' } }),
      db.country.count({ where: { active: true } }),
    ]);

    return NextResponse.json({
      totalRaised: totalRaised._sum.amount || 0,
      peopleHelped: totalDonors.length,
      activeCampaigns,
      countriesReached: countryCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ totalRaised: 0, peopleHelped: 0, activeCampaigns: 0, countriesReached: 0 });
  }
}
