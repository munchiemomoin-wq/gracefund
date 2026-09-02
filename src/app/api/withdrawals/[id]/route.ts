import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, reviewerId, reviewNotes, rejectionReason, paymentReference } = body;

    const existing = await db.withdrawalRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (reviewerId !== undefined) updateData.reviewerId = reviewerId;
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
    if (paymentReference !== undefined) updateData.paymentReference = paymentReference;

    // Set reviewedAt when transitioning to approved/rejected
    if (status === 'approved' || status === 'rejected') {
      updateData.reviewedAt = new Date();
    }

    // Set paidAt and status when marking as paid
    if (status === 'paid') {
      updateData.paidAt = new Date();
      updateData.status = 'paid';
    }

    const withdrawal = await db.withdrawalRequest.update({
      where: { id },
      data: updateData,
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
    });

    return NextResponse.json(withdrawal);
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
  }
}
