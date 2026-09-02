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
    const { status, reviewNotes, rejectionReason, paymentReference } = body;

    const existing = await db.withdrawalRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    const previousStatus = existing.status;
    const updateData: Record<string, unknown> = {
      reviewerId: admin.id,
    };
    if (status !== undefined) updateData.status = status;
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
    if (paymentReference !== undefined) updateData.paymentReference = paymentReference;

    if (status === 'approved' || status === 'rejected') {
      updateData.reviewedAt = new Date();
    }
    if (status === 'paid') {
      updateData.paidAt = new Date();
      updateData.processedAt = new Date();
    }

    const withdrawal = await db.withdrawalRequest.update({
      where: { id },
      data: updateData,
      include: {
        campaign: { select: { id: true, title: true, slug: true, goalAmount: true, raisedAmount: true } },
        requester: { select: { id: true, name: true, email: true, avatarUrl: true } },
        reviewer: { select: { id: true, name: true } },
      },
    });

    // Notify requester
    await db.notification.create({
      data: {
        userId: existing.requesterId,
        type: 'withdrawal_status_changed',
        title: `Withdrawal ${status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : status === 'paid' ? 'Paid' : 'Updated'}`,
        message: `Your withdrawal request for ${existing.amount} has been ${status}. ${reviewNotes || ''}`,
        entityType: 'withdrawal',
        entityId: id,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      action: 'withdrawal_updated',
      entityType: 'withdrawal',
      entityId: id,
      previousValue: { status: previousStatus },
      newValue: { status },
      metadata: { reviewNotes, rejectionReason, paymentReference },
    });

    return NextResponse.json(withdrawal);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error updating withdrawal:', error);
    return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
  }
}
