import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [
      totalRaised,
      peopleHelped,
      activeCampaigns,
      countryCount,
      pendingVerifications,
      underReviewCampaigns,
      highRiskCampaigns,
      openReports,
      pendingWithdrawals,
      suspendedUsers,
    ] = await Promise.all([
      db.campaign.aggregate({ _sum: { raisedAmount: true }, where: { status: 'published' } }),
      db.campaign.aggregate({ _sum: { donorCount: true }, where: { status: 'published' } }),
      db.campaign.count({ where: { status: 'published' } }),
      db.country.count({ where: { active: true } }),
      db.verification.count({ where: { status: { in: ['pending', 'documents_submitted', 'under_review'] } } }),
      db.campaign.count({ where: { status: { in: ['under_review', 'submitted'] } } }),
      db.campaign.count({ where: { riskLevel: 'high' } }),
      db.report.count({ where: { status: { in: ['new', 'under_review'] } } }),
      db.withdrawalRequest.count({ where: { status: { in: ['requested', 'under_review'] } } }),
      db.user.count({ where: { status: { in: ['suspended', 'banned'] } } }),
    ]);

    return NextResponse.json({
      totalRaised: totalRaised._sum.raisedAmount || 0,
      peopleHelped: peopleHelped._sum.donorCount || 0,
      activeCampaigns,
      countriesReached: countryCount,
      pendingVerifications,
      underReviewCampaigns,
      highRiskCampaigns,
      openReports,
      pendingWithdrawals,
      suspendedUsers,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
