import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, createAuditLog, AuthError } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const purpose = searchParams.get('purpose');

    const where: Record<string, unknown> = {};
    if (status) where.allocationStatus = status;
    if (purpose) where.purpose = purpose;

    const [allocations, total] = await Promise.all([
      db.jodofundAllocation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          contribution: { select: { id: true, donorName: true, amount: true, purpose: true } },
          campaign: { select: { id: true, title: true } },
          approver: { select: { id: true, name: true } },
        },
      }),
      db.jodofundAllocation.count({ where }),
    ]);

    return NextResponse.json({ allocations, total, page, limit });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch allocations';
    const status = error instanceof Error && msg.includes('Unauthorized') ? 401 : msg.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const {
      contributionId, purpose, amount,
      beneficiaryOrProgramReference, campaignId, notes,
    } = body;

    if (!contributionId || !purpose || !amount) {
      return NextResponse.json({ error: 'Contribution ID, purpose, and amount are required' }, { status: 400 });
    }

    const allocAmount = parseFloat(amount);
    if (allocAmount <= 0) {
      return NextResponse.json({ error: 'Allocation amount must be greater than zero' }, { status: 400 });
    }

    // Verify contribution exists and has enough unallocated funds
    const contribution = await db.jodofundContribution.findUnique({
      where: { id: contributionId },
    });

    if (!contribution) {
      return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
    }

    if (contribution.paymentStatus !== 'succeeded') {
      return NextResponse.json({ error: 'Can only allocate from confirmed contributions' }, { status: 400 });
    }

    // Check unallocated amount
    const existingAllocations = await db.jodofundAllocation.aggregate({
      _sum: { amount: true },
      where: {
        contributionId,
        allocationStatus: { notIn: ['cancelled'] },
      },
    });

    const allocated = existingAllocations._sum.amount || 0;
    const remaining = contribution.amount - allocated;

    if (allocAmount > remaining) {
      return NextResponse.json({
        error: `Allocation amount exceeds available balance. Remaining: ₹${remaining.toLocaleString()}`,
      }, { status: 400 });
    }

    const allocation = await db.jodofundAllocation.create({
      data: {
        contributionId,
        purpose,
        amount: allocAmount,
        beneficiaryOrProgramReference: beneficiaryOrProgramReference || null,
        campaignId: campaignId || null,
        allocationStatus: 'planned',
        approvedBy: admin.id,
        notes: notes || null,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      action: 'jodofund_allocation_created',
      entityType: 'jodofund_allocation',
      entityId: allocation.id,
      metadata: { contributionId, purpose, amount: allocAmount, campaignId },
    });

    return NextResponse.json(allocation, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error creating allocation:', error);
    return NextResponse.json({ error: 'Failed to create allocation' }, { status: 500 });
  }
}
