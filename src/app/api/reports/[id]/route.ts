import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes, reviewerId } = body;

    const existing = await db.report.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (reviewerId !== undefined) updateData.reviewerId = reviewerId;

    if (status === 'resolved' || status === 'dismissed') {
      updateData.resolvedAt = new Date();
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

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
