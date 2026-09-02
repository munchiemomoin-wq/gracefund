import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthError } from '@/lib/auth';

// Admin: list all verifications | User: list own
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const level = searchParams.get('level');

    const where: Record<string, unknown> = {};
    if (user.role !== 'admin') {
      where.userId = user.id;
    }
    if (status) where.status = status;
    if (level) where.level = level;

    const verifications = await db.verification.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        reviewer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(verifications);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error fetching verifications:', error);
    return NextResponse.json({ error: 'Failed to fetch verifications' }, { status: 500 });
  }
}

// User: submit verification request
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { level, documents } = body;

    const validLevels = ['basic', 'identity', 'beneficiary', 'organization'];
    if (!level || !validLevels.includes(level)) {
      return NextResponse.json(
        { error: `Invalid level. Must be one of: ${validLevels.join(', ')}` },
        { status: 400 }
      );
    }

    const verification = await db.verification.create({
      data: {
        userId: user.id,
        level,
        status: 'documents_submitted',
        submittedAt: new Date(),
        documents: documents ? JSON.stringify(documents) : null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Notify admins
    const admins = await db.user.findMany({ where: { role: 'admin', status: 'active' } });
    for (const admin of admins) {
      await db.notification.create({
        data: {
          userId: admin.id,
          type: 'new_verification_submitted',
          title: 'New Verification Request',
          message: `${user.name || user.email} submitted a ${level} verification request.`,
          entityType: 'verification',
          entityId: verification.id,
        },
      });
    }

    return NextResponse.json(verification, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error creating verification:', error);
    return NextResponse.json({ error: 'Failed to create verification' }, { status: 500 });
  }
}
