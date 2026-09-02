import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/auth';

// Fundraiser: list own withdrawals | Admin: list all
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    // Non-admins see only their own withdrawals
    if (user.role !== 'admin') {
      where.requesterId = user.id;
    }

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
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}
