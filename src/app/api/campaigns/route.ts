import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

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
        _count: { select: { donations: true, prayers: true } },
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}