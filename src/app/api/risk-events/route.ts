import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');
    const severity = searchParams.get('severity');

    const where: Record<string, unknown> = {};
    if (resolved === 'true') {
      where.resolvedAt = { not: null };
    } else if (resolved === 'false') {
      where.resolvedAt = null;
    }
    if (severity) where.severity = severity;

    const events = await db.riskEvent.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        campaign: { select: { id: true, title: true } },
        resolver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error fetching risk events:', error);
    return NextResponse.json({ error: 'Failed to fetch risk events' }, { status: 500 });
  }
}
