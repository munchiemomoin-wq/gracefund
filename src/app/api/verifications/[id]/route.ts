import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, reviewerId, reviewNotes, rejectionReason } = body;

    const existing = await db.verification.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (reviewerId !== undefined) updateData.reviewerId = reviewerId;
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;

    if (status === 'verified' || status === 'rejected') {
      updateData.reviewedAt = new Date();
    }

    const verification = await db.verification.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(verification);
  } catch (error) {
    console.error('Error updating verification:', error);
    return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
  }
}
