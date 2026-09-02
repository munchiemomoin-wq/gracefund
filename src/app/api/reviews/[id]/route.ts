import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reviewerId, reviewNotes, rejectionReason } = body;

    if (!action || !reviewerId) {
      return NextResponse.json(
        { error: 'action and reviewerId are required' },
        { status: 400 }
      );
    }

    const validActions = ['approve', 'reject', 'request_info', 'pause', 'suspend'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      );
    }

    const existing = await db.campaign.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      reviewerId,
    };

    switch (action) {
      case 'approve':
        updateData.status = 'published';
        updateData.reviewedAt = new Date();
        updateData.reviewerId = reviewerId;
        if (reviewNotes) updateData.reviewNotes = reviewNotes;
        break;
      case 'reject':
        updateData.status = 'rejected';
        updateData.rejectionReason = rejectionReason || null;
        updateData.reviewedAt = new Date();
        updateData.reviewerId = reviewerId;
        break;
      case 'request_info':
        updateData.status = 'under_review';
        if (reviewNotes) updateData.reviewNotes = reviewNotes;
        break;
      case 'pause':
        updateData.status = 'paused';
        if (reviewNotes) updateData.reviewNotes = reviewNotes;
        break;
      case 'suspend':
        updateData.status = 'under_investigation';
        if (reviewNotes) updateData.reviewNotes = reviewNotes;
        break;
    }

    const campaign = await db.campaign.update({
      where: { id },
      data: updateData,
      include: {
        organizer: { select: { id: true, name: true, avatarUrl: true } },
        category: { select: { id: true, name: true } },
        reviewer: { select: { id: true, name: true } },
        _count: { select: { donations: true, reports: true } },
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error reviewing campaign:', error);
    return NextResponse.json({ error: 'Failed to review campaign' }, { status: 500 });
  }
}
