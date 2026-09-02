import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, createAuditLog, AuthError } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { action, reviewNotes, rejectionReason } = body;

    if (!action) {
      return NextResponse.json({ error: 'action is required' }, { status: 400 });
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

    const previousStatus = existing.status;
    const updateData: Record<string, unknown> = {
      reviewerId: admin.id,
    };

    switch (action) {
      case 'approve':
        updateData.status = 'published';
        updateData.reviewedAt = new Date();
        if (reviewNotes) updateData.reviewNotes = reviewNotes;
        break;
      case 'reject':
        updateData.status = 'rejected';
        updateData.rejectionReason = rejectionReason || null;
        updateData.reviewedAt = new Date();
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

    // Notify organizer
    if (existing.organizerId) {
      const notifType = action === 'approve' ? 'campaign_approved' : action === 'reject' ? 'campaign_rejected' : 'info_requested';
      const notifTitle = action === 'approve' ? 'Campaign Approved' : action === 'reject' ? 'Campaign Needs Changes' : 'Additional Information Requested';
      const notifMsg = action === 'approve'
        ? `Your campaign "${existing.title}" has been approved and is now live!`
        : action === 'reject'
        ? `Your campaign "${existing.title}" was not approved. ${rejectionReason || 'Please review the feedback.'}`
        : `More information is needed for your campaign "${existing.title}". ${reviewNotes || ''}`;

      await db.notification.create({
        data: {
          userId: existing.organizerId,
          type: notifType,
          title: notifTitle,
          message: notifMsg,
          entityType: 'campaign',
          entityId: id,
        },
      });
    }

    await createAuditLog({
      adminId: admin.id,
      action: `campaign_${action}`,
      entityType: 'campaign',
      entityId: id,
      previousValue: { status: previousStatus },
      newValue: { status: updateData.status },
      metadata: { reviewNotes, rejectionReason },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error reviewing campaign:', error);
    return NextResponse.json({ error: 'Failed to review campaign' }, { status: 500 });
  }
}
