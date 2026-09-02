import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sort = searchParams.get('sort');

    const where: Record<string, unknown> = {
      status: { in: ['under_review', 'submitted'] },
    };

    if (status) {
      where.status = status;
    }

    let orderBy: Record<string, string> = { submittedAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { submittedAt: 'asc' };
    } else if (sort === 'highest_amount') {
      orderBy = { goalAmount: 'desc' };
    } else {
      orderBy = { submittedAt: 'desc' };
    }

    const campaigns = await db.campaign.findMany({
      where,
      include: {
        organizer: { select: { id: true, name: true, avatarUrl: true, verificationLevel: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { donations: true, reports: true } },
      },
      orderBy,
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching review queue:', error);
    return NextResponse.json({ error: 'Failed to fetch review queue' }, { status: 500 });
  }
}
