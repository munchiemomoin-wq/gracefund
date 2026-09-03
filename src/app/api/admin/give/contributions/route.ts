import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, createAuditLog } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const purpose = searchParams.get('purpose');

    const where: Record<string, unknown> = {};
    if (status) where.paymentStatus = status;
    if (purpose) where.purpose = purpose;

    const [contributions, total] = await Promise.all([
      db.gracefundContribution.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          donor: { select: { id: true, name: true, email: true } },
        },
      }),
      db.gracefundContribution.count({ where }),
    ]);

    return NextResponse.json({ contributions, total, page, limit });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch contributions';
    const status = error instanceof Error && msg.includes('Unauthorized') ? 401 : msg.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
