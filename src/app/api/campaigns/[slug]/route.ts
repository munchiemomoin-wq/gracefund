import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const campaign = await db.campaign.findUnique({
      where: { slug },
      include: {
        category: true,
        organizer: { select: { id: true, name: true, avatarUrl: true, role: true } },
        updates: { orderBy: { createdAt: 'desc' } },
        donations: {
          where: { paymentStatus: 'completed' },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { donations: true, prayers: true, favorites: true } },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}
