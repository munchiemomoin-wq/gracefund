import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUser, createAuditLog, AuthError } from '@/lib/auth';
import { randomUUID } from 'crypto';

const VALID_PURPOSES = [
  'food_support', 'shelter_housing', 'elderly_support', 'funeral_support',
  'medical_support', 'education_support', 'children_family_support',
  'disaster_relief', 'animal_welfare', 'community_projects',
  'where_most_needed', 'operations',
] as const;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(); // optional — guests can contribute
    const body = await request.json();
    const {
      amount, purpose, donorName, donorEmail, donorPhone, anonymous,
    } = body;

    if (!amount || !purpose) {
      return NextResponse.json({ error: 'Amount and purpose are required' }, { status: 400 });
    }

    const contributionAmount = parseFloat(amount);
    if (contributionAmount <= 0) {
      return NextResponse.json({ error: 'Contribution amount must be greater than zero' }, { status: 400 });
    }

    if (!VALID_PURPOSES.includes(purpose)) {
      return NextResponse.json({ error: 'Invalid purpose selected' }, { status: 400 });
    }

    const isTestMode = process.env.PAYMENT_MODE !== 'production';
    const idempotencyKey = randomUUID();
    const paymentStatus = isTestMode ? 'succeeded' : 'pending';

    const contribution = await db.gracefundContribution.create({
      data: {
        donorId: user?.id || null,
        donorName: anonymous ? 'Anonymous Supporter' : (donorName || 'Generous Supporter'),
        donorEmail: donorEmail || null,
        donorPhone: donorPhone || null,
        amount: contributionAmount,
        purpose,
        contributionType: 'GRACEFUND_DIRECT_CONTRIBUTION',
        paymentStatus,
        paymentProvider: isTestMode ? 'demo' : null,
        paymentOrderId: isTestMode ? `GF-${Date.now()}` : null,
        paymentTransactionId: isTestMode ? `GF-TXN-${Date.now()}` : null,
        idempotencyKey,
        anonymous: anonymous || false,
      },
    });

    await createAuditLog({
      adminId: user?.id,
      action: 'gracefund_contribution_created',
      entityType: 'gracefund_contribution',
      entityId: contribution.id,
      metadata: { amount: contributionAmount, purpose, paymentStatus, isTestMode },
    });

    return NextResponse.json({
      ...contribution,
      isTestMode,
      message: isTestMode
        ? 'Contribution recorded (test mode — no real payment processed)'
        : 'Contribution initiated. Payment confirmation pending.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error creating GraceFund contribution:', error);
    return NextResponse.json({ error: 'Failed to process contribution' }, { status: 500 });
  }
}
