import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');
    const severity = searchParams.get('severity');

    const where: Record<string, unknown> = {};
    if (resolved === 'false') {
      where.resolvedAt = null;
    }
    if (severity) {
      where.severity = severity;
    }

    const riskEvents = await db.riskEvent.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        campaign: { select: { id: true, title: true, slug: true } },
        resolver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(riskEvents);
  } catch (error) {
    console.error('Error fetching risk events:', error);
    return NextResponse.json({ error: 'Failed to fetch risk events' }, { status: 500 });
  }
}
