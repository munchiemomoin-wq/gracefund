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
    const { status, adminNotes } = body;

    const validStatuses = ['under_review', 'resolved', 'dismissed', 'escalated'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await db.report.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const previousStatus = existing.status;
    const updateData: Record<string, unknown> = {
      reviewerId: admin.id,
    };
    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    if (status === 'resolved' || status === 'dismissed') {
      updateData.resolvedAt = new Date();
      updateData.reviewedAt = new Date();
    }

    const report = await db.report.update({
      where: { id },
      data: updateData,
      include: {
        campaign: { select: { id: true, title: true } },
        reporter: { select: { id: true, name: true } },
        reviewer: { select: { id: true, name: true } },
      },
    });

    await createAuditLog({
      adminId: admin.id,
      action: 'report_updated',
      entityType: 'report',
      entityId: id,
      previousValue: { status: previousStatus },
      newValue: { status },
      metadata: { adminNotes },
    });

    return NextResponse.json(report);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}