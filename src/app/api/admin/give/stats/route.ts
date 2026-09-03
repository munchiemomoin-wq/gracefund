import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalContributions,
      totalAllocated,
      totalDisbursed,
      operationsTotal,
      communityTotal,
      purposeBreakdown,
      allocationStatusBreakdown,
    ] = await Promise.all([
      // Total contributions received (succeeded only)
      db.gracefundContribution.aggregate({
        _sum: { amount: true },
        _count: true,
        where: { paymentStatus: 'succeeded' },
      }),
      // Total allocated (not cancelled)
      db.gracefundAllocation.aggregate({
        _sum: { amount: true },
        where: { allocationStatus: { notIn: ['cancelled'] } },
      }),
      // Total disbursed
      db.gracefundAllocation.aggregate({
        _sum: { amount: true },
        where: { allocationStatus: 'disbursed' },
      }),
      // Operations contributions
      db.gracefundContribution.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'succeeded', purpose: 'operations' },
      }),
      // Community support contributions (everything except operations)
      db.gracefundContribution.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'succeeded', purpose: { not: 'operations' } },
      }),
      // Breakdown by purpose
      db.gracefundContribution.groupBy({
        by: ['purpose'],
        where: { paymentStatus: 'succeeded' },
        _sum: { amount: true },
        _count: true,
      }),
      // Allocation status breakdown
      db.gracefundAllocation.groupBy({
        by: ['allocationStatus'],
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const totalReceived = totalContributions._sum.amount || 0;
    const allocatedAmount = totalAllocated._sum.amount || 0;
    const disbursedAmount = totalDisbursed._sum.amount || 0;
    const availableBalance = totalReceived - allocatedAmount;

    return NextResponse.json({
      totalReceived,
      totalContributions: totalContributions._count,
      allocatedAmount,
      disbursedAmount,
      availableBalance,
      operationsTotal: operationsTotal._sum.amount || 0,
      communityTotal: communityTotal._sum.amount || 0,
      purposeBreakdown: purposeBreakdown.map((p) => ({
        purpose: p.purpose,
        amount: p._sum.amount || 0,
        count: p._count,
      })),
      allocationStatusBreakdown: allocationStatusBreakdown.map((a) => ({
        status: a.allocationStatus,
        amount: a._sum.amount || 0,
        count: a._count,
      })),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch stats';
    const status = error instanceof Error && msg.includes('Unauthorized') ? 401 : msg.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
