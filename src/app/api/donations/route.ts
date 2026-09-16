import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUser, createAuditLog, AuthError } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(); // optional — guests can donate
    const body = await request.json();
    const {
      campaignId, donorName, donorEmail, amount, currency,
      donorMessage, isAnonymous, showNamePublicly,
      platformTipAmount, paymentMode
    } = body;

    if (!campaignId || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const donationAmount = parseFloat(amount);
    const tipAmount = parseFloat(platformTipAmount || '0');
    const totalAmount = donationAmount + tipAmount;

    if (donationAmount <= 0) {
      return NextResponse.json({ error: 'Donation amount must be greater than zero' }, { status: 400 });
    }

    if (tipAmount < 0) {
      return NextResponse.json({ error: 'Tip amount cannot be negative' }, { status: 400 });
    }

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, title: true, status: true, raisedAmount: true, donorCount: true, organizerId: true },
    });
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    if (campaign.status !== 'published') {
      return NextResponse.json({ error: 'Campaign is not accepting donations' }, { status: 400 });
    }

    const isTestMode = process.env.PAYMENT_MODE !== 'production';
    const idempotencyKey = randomUUID();

    // In test mode, create donation as 'succeeded' directly
    // In production, status would be 'pending' until webhook confirms
    const paymentStatus = isTestMode ? 'succeeded' : 'pending';

    const donation = await db.donation.create({
      data: {
        campaignId,
        donorId: user?.id || null,
        donorName: isAnonymous ? 'Anonymous Donor' : (donorName || 'Generous Donor'),
        donorEmail: donorEmail || null,
        amount: donationAmount, // campaign donation ONLY
        currency,
        platformTipAmount: tipAmount, // JodoFund tip — separate
        paymentTotalAmount: totalAmount,
        paymentStatus,
        paymentProvider: isTestMode ? 'demo' : null,
        paymentOrderId: isTestMode ? `DEMO-${Date.now()}` : null,
        paymentTransactionId: isTestMode ? `DEMO-TXN-${Date.now()}` : null,
        idempotencyKey,
        donorMessage: donorMessage || null,
        isAnonymous: isAnonymous || false,
        showNamePublicly: showNamePublicly !== false,
      },
    });

    // Only update campaign raised amount for confirmed payments
    // raisedAmount ONLY includes campaign donations, NEVER tips
    if (paymentStatus === 'succeeded') {
      await db.campaign.update({
        where: { id: campaignId },
        data: {
          raisedAmount: { increment: donationAmount },
          donorCount: { increment: 1 },
        },
      });

      // Notify fundraiser
      if (campaign.organizerId) {
        await db.notification.create({
          data: {
            userId: campaign.organizerId,
            type: 'donation_confirmed',
            title: 'New Donation Received',
            message: `${isAnonymous ? 'Someone' : donorName} donated ${currency === 'INR' ? '₹' : ''}${donationAmount.toLocaleString()} to "${campaign.title}"`,
            entityType: 'campaign',
            entityId: campaignId,
          },
        });
      }
    }

    await createAuditLog({
      adminId: user?.id,
      action: 'donation_created',
      entityType: 'donation',
      entityId: donation.id,
      metadata: {
        campaignId, donationAmount, tipAmount, totalAmount,
        paymentStatus, isTestMode,
      },
    });

    return NextResponse.json({
      ...donation,
      isTestMode,
      message: isTestMode
        ? 'Donation recorded (test mode — no real payment processed)'
        : 'Donation initiated. Payment confirmation pending.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error creating donation:', error);
    return NextResponse.json({ error: 'Failed to process donation' }, { status: 500 });
  }
}
