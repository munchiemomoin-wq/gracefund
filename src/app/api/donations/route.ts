import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaignId, donorName, donorEmail, amount, currency, donorMessage, isAnonymous, showNamePublicly } = body;

    if (!campaignId || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const campaign = await db.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // In demo mode, create a completed donation
    const donation = await db.donation.create({
      data: {
        campaignId,
        donorName: isAnonymous ? 'Anonymous Donor' : (donorName || 'Generous Donor'),
        donorEmail,
        amount: parseFloat(amount),
        currency,
        donorMessage,
        isAnonymous: isAnonymous || false,
        showNamePublicly: showNamePublicly !== false,
        paymentStatus: 'completed',
        paymentProvider: 'demo',
        transactionReference: `DEMO-${Date.now()}`,
      },
    });

    // Update campaign raised amount
    await db.campaign.update({
      where: { id: campaignId },
      data: {
        raisedAmount: { increment: parseFloat(amount) },
        donorCount: { increment: 1 },
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json({ error: 'Failed to process donation' }, { status: 500 });
  }
}
