import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, reporterId, reason, description } = body;

    if (!campaignId || !reporterId || !reason) {
      return NextResponse.json(
        { error: 'campaignId, reporterId, and reason are required' },
        { status: 400 }
      );
    }

    const report = await db.report.create({
      data: {
        campaignId,
        reporterId,
        reason,
        description: description || null,
        status: 'new',
        riskLevel: 'medium',
      },
      include: {
        campaign: { select: { id: true, title: true } },
        reporter: { select: { id: true, name: true, email: true } },
      },
    });

    // Note: In production, implement rate limiting per reporterId/IP
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const campaignId = searchParams.get('campaignId');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (campaignId) where.campaignId = campaignId;

    const reports = await db.report.findMany({
      where,
      include: {
        campaign: { select: { id: true, title: true } },
        reporter: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
