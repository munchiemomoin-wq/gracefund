import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { campaignId, reason, description } = body;

    if (!campaignId || !reason) {
      return NextResponse.json(
        { error: 'campaignId and reason are required' },
        { status: 400 }
      );
    }

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, title: true, status: true, organizerId: true },
    });
    if (!campaign || campaign.status !== 'published') {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const report = await db.report.create({
      data: {
        campaignId,
        reporterId: user.id,
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

    const admins = await db.user.findMany({ where: { role: 'admin', status: 'active' } });
    for (const admin of admins) {
      await db.notification.create({
        data: {
          userId: admin.id,
          type: 'new_report',
          title: 'New Campaign Report',
          message: `Campaign "${campaign.title}" has been reported for: ${reason}`,
          entityType: 'report',
          entityId: report.id,
        },
      });
    }

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

// Admin-only: list all reports
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const campaignId = searchParams.get('campaignId');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (campaignId) where.campaignId = campaignId;

    const reports = await db.report.findMany({
      where,
      include: {
        campaign: { select: { id: true, title: true, slug: true } },
        reporter: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
