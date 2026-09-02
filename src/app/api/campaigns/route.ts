import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUser, requireAuth, createAuditLog, AuthError } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const urgent = searchParams.get('urgent');
    const featured = searchParams.get('featured');
    const verified = searchParams.get('verified');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'newest';

    // Public: only published campaigns
    const where: Record<string, unknown> = { status: 'published' };
    if (category) where.categoryId = category;
    if (urgent === 'true') where.isUrgent = true;
    if (featured === 'true') where.isFeatured = true;
    if (verified === 'true') where.verificationLevel = { in: ['identity', 'organization'] };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    const orderBy: Record<string, string> =
    sort === 'most_funded' ? { raisedAmount: 'desc' } :
    sort === 'ending_soon' ? { endDate: 'asc' } :
    { createdAt: 'desc' };

    const campaigns = await db.campaign.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        category: true,
        organizer: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { donations: true } },
      },
    });

    // Strip internal fields from public response
    const safe = campaigns.map(c => ({
      ...c,
      riskLevel: undefined,
      investigationSettings: undefined,
      reviewNotes: undefined,
      rejectionReason: undefined,
    }));

    return NextResponse.json(safe);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const {
      title, shortDescription, story, categoryId, campaignType,
      goalAmount, currency, endDate, beneficiaryName,
      beneficiaryRelationship, beneficiaryContact,
      countryId, stateId, cityId, coverImage, campaignFeatures,
      fundUsageItems
    } = body;

    if (!title || !goalAmount) {
      return NextResponse.json({ error: 'Title and goal amount are required' }, { status: 400 });
    }

    // Generate slug
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
    let slug = baseSlug;
    let counter = 1;
    while (await db.campaign.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const campaign = await db.campaign.create({
      data: {
        slug,
        title,
        shortDescription: shortDescription || null,
        story: story || null,
        categoryId: categoryId || null,
        organizerId: user.id,
        campaignType: campaignType || 'individual',
        goalAmount: parseFloat(goalAmount),
        currency: currency || 'INR',
        endDate: endDate ? new Date(endDate) : null,
        beneficiaryName: beneficiaryName || null,
        beneficiaryRelationship: beneficiaryRelationship || null,
        beneficiaryContact: beneficiaryContact || null,
        countryId: countryId || null,
        stateId: stateId || null,
        cityId: cityId || null,
        coverImage: coverImage || null,
        campaignFeatures: campaignFeatures ? JSON.stringify(campaignFeatures) : null,
        status: 'submitted',
        submittedAt: new Date(),
        fundUsageItems: fundUsageItems ? {
          create: fundUsageItems.map((item: { category: string; amount: number; description?: string; sortOrder?: number }) => ({
            category: item.category,
            amount: parseFloat(String(item.amount)),
            description: item.description || null,
            sortOrder: item.sortOrder || 0,
          })),
        } : undefined,
      },
      include: { category: true },
    });

    // Create notification for admins
    const admins = await db.user.findMany({ where: { role: 'admin', status: 'active' } });
    for (const admin of admins) {
      await db.notification.create({
        data: {
          userId: admin.id,
          type: 'new_campaign_submitted',
          title: 'New Campaign Submitted',
          message: `A new campaign "${title}" has been submitted for review.`,
          entityType: 'campaign',
          entityId: campaign.id,
        },
      });
    }

    await createAuditLog({
      adminId: user.id,
      action: 'campaign_created',
      entityType: 'campaign',
      entityId: campaign.id,
      metadata: { title, slug },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}