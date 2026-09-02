import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/auth';

// Admin-only: platform stats with financial breakdown
export async function GET() {
  try {
    const admin = await requireAdmin();
    const [
      totalRaised,
      totalDonors,
      activeCampaigns,
      countryCount,
      pendingVerifications,
      underReviewCampaigns,
      highRiskCampaigns,
      openReports,
      pendingWithdrawals,
      suspendedUsers,
      totalTips,
      totalRefunds,
    ] = await Promise.all([
      db.donation.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'succeeded' },
      }),
      db.donation.groupBy({ by: ['donorId'], where: { paymentStatus: 'succeeded' } }),
      db.campaign.count({ where: { status: 'published' } }),
      db.country.count({ where: { active: true } }),
      db.verification.count({ where: { status: { in: ['pending', 'documents_submitted', 'under_review'] } } }),
      db.campaign.count({ where: { status: { in: ['under_review', 'submitted'] } } }),
      db.campaign.count({ where: { riskLevel: 'high' } }),
      db.report.count({ where: { status: { in: ['new', 'under_review'] } } }),
      db.withdrawalRequest.count({ where: { status: { in: ['requested', 'under_review'] } } }),
      db.user.count({ where: { status: { in: ['suspended', 'banned'] } } }),
      db.donation.aggregate({
        _sum: { platformTipAmount: true },
        where: { paymentStatus: 'succeeded', platformTipAmount: { gt: 0 } },
      }),
      db.donation.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'refunded' },
      }),
    ]);

    return NextResponse.json({
      totalRaised: totalRaised._sum.amount || 0,
      peopleHelped: totalDonors.length,
      activeCampaigns,
      countriesReached: countryCount,
      pendingVerifications,
      underReviewCampaigns,
      highRiskCampaigns,
      openReports,
      pendingWithdrawals,
      suspendedUsers,
      totalPlatformTips: totalTips._sum.platformTipAmount || 0,
      totalRefunds: totalRefunds._sum.amount || 0,
      netPlatformRevenue: (totalTips._sum.platformTipAmount || 0),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
