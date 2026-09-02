import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const withdrawals = await db.withdrawalRequest.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            slug: true,
            goalAmount: true,
            raisedAmount: true,
          },
        },
        requester: { select: { id: true, name: true, email: true, avatarUrl: true } },
        reviewer: { select: { id: true, name: true } },
      },
      orderBy: { requestedAt: 'desc' },
    });

    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}
