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
    const { status, reviewNotes, rejectionReason } = body;

    if (!status || !['verified', 'rejected', 'under_review'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await db.verification.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    const previousStatus = existing.status;
    const updateData: Record<string, unknown> = {
      reviewerId: admin.id,
      status,
      reviewNotes: reviewNotes || null,
      rejectionReason: rejectionReason || null,
    };

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

    if (status === 'verified') {
      await db.user.update({
        where: { id: existing.userId },
        data: { verificationLevel: existing.level },
      });
      await db.notification.create({
        data: {
          userId: existing.userId,
          type: 'verification_approved',
          title: 'Verification Approved',
          message: `Your ${existing.level} verification has been approved.`,
          entityType: 'verification',
          entityId: id,
        },
      });
    } else if (status === 'rejected') {
      await db.notification.create({
        data: {
          userId: existing.userId,
          type: 'verification_rejected',
          title: 'Verification Rejected',
          message: `Your ${existing.level} verification was not approved. ${rejectionReason || ''}`,
          entityType: 'verification',
          entityId: id,
        },
      });
    }

    await createAuditLog({
      adminId: admin.id,
      action: `verification_${status}`,
      entityType: 'verification',
      entityId: id,
      previousValue: { status: previousStatus },
      newValue: { status },
      metadata: { reviewNotes, rejectionReason, level: existing.level },
    });

    return NextResponse.json(verification);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error updating verification:', error);
    return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
  }
}
