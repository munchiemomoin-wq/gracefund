import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const level = searchParams.get('level');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (level) where.level = level;

    const verifications = await db.verification.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(verifications);
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json({ error: 'Failed to fetch verifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, level } = body;

    if (!userId || !level) {
      return NextResponse.json(
        { error: 'userId and level are required' },
        { status: 400 }
      );
    }

    const validLevels = ['basic', 'identity', 'beneficiary', 'organization'];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: `Invalid level. Must be one of: ${validLevels.join(', ')}` },
        { status: 400 }
      );
    }

    const verification = await db.verification.create({
      data: {
        userId,
        level,
        status: 'pending',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(verification, { status: 201 });
  } catch (error) {
    console.error('Error creating verification:', error);
    return NextResponse.json({ error: 'Failed to create verification' }, { status: 500 });
  }
}
