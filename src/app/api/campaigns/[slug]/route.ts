import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUser, requireAuth, requireOwnership, AuthError } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const user = await getCurrentUser();

    const campaign = await db.campaign.findUnique({
      where: { slug },
      include: {
        category: true,
        organizer: { select: { id: true, name: true, avatarUrl: true, role: true, verificationLevel: true } },
        updates: {
          where: { status: 'published' },
          orderBy: { createdAt: 'desc' },
        },
        donations: {
          where: { paymentStatus: 'succeeded' },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true, donorName: true, amount: true, donorMessage: true,
            isAnonymous: true, showNamePublicly: true, createdAt: true,
          },
        },
        fundUsageItems: {
          select: { id: true, category: true, amount: true, description: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
        reports: {
          select: { id: true },
          where: { status: { in: ['new', 'under_review'] } },
        },
        _count: { select: { donations: true, favorites: true } },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Only published campaigns are publicly accessible
    // (organizers can see their own drafts)
    if (campaign.status !== 'published') {
      if (!user || (campaign.organizerId !== user.id && user.role !== 'admin')) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }
    }

    // Increment view count (fire-and-forget)
    db.campaign.update({ where: { id: campaign.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    const { reports, riskLevel, investigationSettings, reviewNotes, rejectionReason, ...rest } = campaign;
    const result = {
      ...rest,
      openReportsCount: reports.length,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}
