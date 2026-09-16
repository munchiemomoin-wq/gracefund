import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';

    // Build date filter
    let dateFilter: { gte?: Date; lte?: Date } | undefined;
    const now = new Date();

    switch (period) {
      case 'this_month': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = { gte: startOfMonth };
        break;
      }
      case 'last_3_months': {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        dateFilter = { gte: threeMonthsAgo };
        break;
      }
      case 'this_year': {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        dateFilter = { gte: startOfYear };
        break;
      }
      default:
        dateFilter = undefined;
    }

    const contributionWhere = {
      paymentStatus: 'succeeded',
      ...(dateFilter ? { createdAt: dateFilter } : {}),
    };

    const cancelledStatuses = ['cancelled'];
    const allocationWhere = {
      allocationStatus: { notIn: cancelledStatuses },
      ...(dateFilter ? { createdAt: dateFilter } : {}),
    };

    const [totalContributions, purposeBreakdown, allocatedTotal, programsSupported] = await Promise.all([
      db.jodofundContribution.aggregate({
        _sum: { amount: true },
        _count: true,
        where: contributionWhere,
      }),
      db.jodofundContribution.groupBy({
        by: ['purpose'],
        where: contributionWhere,
        _sum: { amount: true },
        _count: true,
      }),
      db.jodofundAllocation.aggregate({
        _sum: { amount: true },
        where: allocationWhere,
      }),
      db.jodofundAllocation.groupBy({
        by: ['purpose'],
        where: { ...allocationWhere, allocationStatus: 'completed' },
        _count: true,
      }),
    ]);

    const totalReceived = totalContributions._sum?.amount || 0;
    const totalAllocated = allocatedTotal._sum?.amount || 0;

    // Build purpose map
    const purposeLabels: Record<string, string> = {
      food_support: 'Food Support',
      shelter_housing: 'Shelter & Housing',
      elderly_support: 'Elderly Support',
      funeral_support: 'Funeral Support',
      medical_support: 'Medical Support',
      education_support: 'Education',
      children_family_support: 'Children & Families',
      disaster_relief: 'Emergency Relief',
      animal_welfare: 'Animal Welfare',
      community_projects: 'Community Projects',
      where_most_needed: 'Where Most Needed',
      operations: 'JodoFund Operations',
    };

    const breakdown: Record<string, { amount: number; count: number; label: string }> = {};
    for (const p of purposeBreakdown) {
      breakdown[p.purpose] = {
        amount: p._sum.amount || 0,
        count: p._count,
        label: purposeLabels[p.purpose] || p.purpose,
      };
    }

    // Count programs/people supported (unique completed allocations by purpose)
    let supportedCount = 0;
    for (const p of programsSupported) {
      supportedCount += p._count;
    }

    return NextResponse.json({
      period,
      totalReceived,
      totalAllocated,
      totalRemaining: totalReceived - totalAllocated,
      totalContributions: totalContributions._count,
      programsSupported: supportedCount,
      breakdown,
    });
  } catch (error) {
    console.error('Error fetching transparency data:', error);
    return NextResponse.json({ error: 'Failed to fetch transparency data' }, { status: 500 });
  }
}
