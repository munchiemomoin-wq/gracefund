import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, createAuditLog, AuthError } from '@/lib/auth';

const VALID_STATUSES = ['planned', 'approved', 'allocated', 'disbursed', 'completed', 'cancelled'];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { allocationStatus, notes } = body;

    if (!allocationStatus || !VALID_STATUSES.includes(allocationStatus)) {
      return NextResponse.json({ error: 'Invalid allocation status' }, { status: 400 });
    }

    const existing = await db.jodofundAllocation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Allocation not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { allocationStatus };
    if (allocationStatus === 'approved' || allocationStatus === 'allocated' || allocationStatus === 'disbursed' || allocationStatus === 'completed') {
      updateData.allocatedAt = new Date();
    }
    if (notes !== undefined) updateData.notes = notes;

    const allocation = await db.jodofundAllocation.update({
      where: { id },
      data: updateData,
    });

    await createAuditLog({
      adminId: admin.id,
      action: 'jodofund_allocation_updated',
      entityType: 'jodofund_allocation',
      entityId: id,
      metadata: { from: existing.allocationStatus, to: allocationStatus },
    });

    return NextResponse.json(allocation);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error updating allocation:', error);
    return NextResponse.json({ error: 'Failed to update allocation' }, { status: 500 });
  }
}
