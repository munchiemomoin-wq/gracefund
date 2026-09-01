import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.prayer.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.campaignUpdate.deleteMany();
  await prisma.report.deleteMany();
  await prisma.withdrawalRequest.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.platformSettings.deleteMany();
  await prisma.city.deleteMany();
  await prisma.state.deleteMany();
  await prisma.country.deleteMany();

  // Create Countries
  const india = await prisma.country.create({
    data: { name: 'India', code: 'IN', currency: 'INR', currencySymbol: '₹' },
  });
  await prisma.country.create({ data: { name: 'United States', code: 'US', currency: 'USD', currencySymbol: '$' } });
  await prisma.country.create({ data: { name: 'United Kingdom', code: 'GB', currency: 'GBP', currencySymbol: '£' } });
  await prisma.country.create({ data: { name: 'United Arab Emirates', code: 'AE', currency: 'AED', currencySymbol: 'د.إ' } });
  await prisma.country.create({ data: { name: 'Nigeria', code: 'NG', currency: 'NGN', currencySymbol: '₦' } });
  await prisma.country.create({ data: { name: 'Kenya', code: 'KE', currency: 'KES', currencySymbol: 'KSh' } });
  await prisma.country.create({ data: { name: 'Philippines', code: 'PH', currency: 'PHP', currencySymbol: '₱' } });
  await prisma.country.create({ data: { name: 'Brazil', code: 'BR', currency: 'BRL', currencySymbol: 'R$' } });

  // Create States for India
  const telangana = await prisma.state.create({ data: { name: 'Telangana', countryId: india.id, code: 'TG' } });
  const andhra = await prisma.state.create({ data: { name: 'Andhra Pradesh', countryId: india.id, code: 'AP' } });
  const karnataka = await prisma.state.create({ data: { name: 'Karnataka', countryId: india.id, code: 'KA' } });
  const tamilNadu = await prisma.state.create({ data: { name: 'Tamil Nadu', countryId: india.id, code: 'TN' } });
  const maharashtra = await prisma.state.create({ data: { name: 'Maharashtra', countryId: india.id, code: 'MH' } });

  // Create Cities
  const hyd = await prisma.city.create({ data: { name: 'Hyderabad', stateId: telangana.id } });
  await prisma.city.create({ data: { name: 'Warangal', stateId: telangana.id } });
  const vizag = await prisma.city.create({ data: { name: 'Visakhapatnam', stateId: andhra.id } });
  await prisma.city.create({ data: { name: 'Vijayawada', stateId: andhra.id } });
  const blr = await prisma.city.create({ data: { name: 'Bangalore', stateId: karnataka.id } });
  const chennai = await prisma.city.create({ data: { name: 'Chennai', stateId: tamilNadu.id } });
  const mumbai = await prisma.city.create({ data: { name: 'Mumbai', stateId: maharashtra.id } });

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Medical', slug: 'medical', description: 'Medical emergencies and healthcare support', icon: 'heart-pulse', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Education', slug: 'education', description: 'School fees, books, and educational supplies', icon: 'graduation-cap', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Church & Ministry', slug: 'church-ministry', description: 'Church construction, renovation, and programs', icon: 'church', sortOrder: 3 } }),
    prisma.category.create({ data: { name: 'Missions', slug: 'missions', description: 'Mission trips, missionary support, and evangelism', icon: 'globe', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Emergency', slug: 'emergency', description: 'Emergency family support and urgent needs', icon: 'alert-triangle', sortOrder: 5 } }),
    prisma.category.create({ data: { name: 'Community', slug: 'community', description: 'Community development and poverty relief', icon: 'users', sortOrder: 6 } }),
    prisma.category.create({ data: { name: 'Funeral & Memorial', slug: 'funeral-memorial', description: 'Funeral support and memorial funds', icon: 'flower-2', sortOrder: 7 } }),
    prisma.category.create({ data: { name: 'Children', slug: 'children', description: 'Children support, orphan care, and sponsoring', icon: 'baby', sortOrder: 8 } }),
  ]);

  // Create Users
  await prisma.user.create({ data: { name: 'Admin User', email: 'admin@gracefund.org', role: 'admin', verificationLevel: 'organization', status: 'active' } });
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'fundraiser', verificationLevel: 'identity', status: 'active' } }),
    prisma.user.create({ data: { name: 'Pastor David Menon', email: 'david@example.com', role: 'organization', verificationLevel: 'organization', status: 'active' } }),
    prisma.user.create({ data: { name: 'Maria Santos', email: 'maria@example.com', role: 'fundraiser', verificationLevel: 'basic', status: 'active' } }),
    prisma.user.create({ data: { name: 'James Okafor', email: 'james@example.com', role: 'fundraiser', verificationLevel: 'identity', status: 'active' } }),
    prisma.user.create({ data: { name: 'Ruth Kumar', email: 'ruth@example.com', role: 'fundraiser', verificationLevel: 'basic', status: 'active' } }),
    prisma.user.create({ data: { name: 'Michael Chen', email: 'michael@example.com', role: 'donor', verificationLevel: 'basic', status: 'active' } }),
    prisma.user.create({ data: { name: 'Grace Williams', email: 'grace@example.com', role: 'donor', verificationLevel: 'basic', status: 'active' } }),
  ]);

  // Create Organization
  await prisma.organization.create({
    data: { ownerId: users[1].id, name: 'Grace Community Church', type: 'church', description: 'A vibrant community church serving the people of Hyderabad for over 30 years.', website: 'https://gracecommunity.org', country: 'India', city: 'Hyderabad', verificationStatus: 'verified', socialLinks: JSON.stringify({ facebook: '#', youtube: '#' }) },
  });

  // Campaign cover images
  const covers = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&h=500&fit=crop',
  ];

  // Create Campaigns
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        slug: 'help-anita-continue-education',
        title: 'Help a Child Continue Her Education',
        shortDescription: 'Anita is a bright 14-year-old girl from a low-income family in Hyderabad. Her father lost his job during the pandemic, and the family is struggling to pay her school fees.',
        story: 'Anita has always been a dedicated student. She dreams of becoming a doctor and serving her community. However, her family\'s financial situation has made it increasingly difficult to continue her education.\n\nHer father, who worked as a daily wage laborer, lost his job during the pandemic. Her mother works as a domestic helper, but her earnings are barely enough to cover basic necessities.\n\nAnita needs approximately ₹50,000 to cover her school fees, books, uniform, and other educational supplies for the next academic year. Without this support, she may have to drop out of school.\n\nEvery contribution, no matter how small, will help keep Anita in school and give her the chance to pursue her dreams.',
        categoryId: categories[1].id,
        organizerId: users[0].id,
        beneficiaryName: 'Anita Reddy',
        beneficiaryRelationship: 'Family friend',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id,
        goalAmount: 50000, raisedAmount: 32500, currency: 'INR',
        status: 'published', verificationLevel: 'identity',
        isFeatured: true, isUrgent: false,
        coverImage: covers[0],
        donorCount: 87, viewCount: 2340,
        endDate: new Date('2026-12-31'),
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'emergency-medical-support-raj-family',
        title: 'Emergency Medical Support for a Family',
        shortDescription: 'Rajesh, a 42-year-old father of three, was diagnosed with a serious heart condition. He needs urgent surgery that the family cannot afford.',
        story: 'Rajesh Kumar is a loving father of three young children and the sole breadwinner for his family. Two months ago, he was diagnosed with a critical heart condition that requires immediate surgical intervention.\n\nThe estimated cost of the surgery, including hospitalization and post-operative care, is ₹800,000. The family has already exhausted their savings on diagnostic tests and preliminary treatments.\n\nRajesh\'s wife, Lakshmi, is a homemaker who is now struggling to manage household expenses while caring for her husband and three children.',
        categoryId: categories[0].id,
        organizerId: users[4].id,
        beneficiaryName: 'Rajesh Kumar',
        beneficiaryRelationship: 'Brother-in-law',
        countryId: india.id, stateId: andhra.id, cityId: vizag.id,
        goalAmount: 800000, raisedAmount: 456000, currency: 'INR',
        status: 'published', verificationLevel: 'identity',
        isFeatured: true, isUrgent: true,
        coverImage: covers[1],
        donorCount: 234, viewCount: 5670,
        endDate: new Date('2026-10-15'),
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'rebuild-church-after-storm',
        title: 'Help Rebuild a Church After a Storm',
        shortDescription: 'Grace Community Church in Hyderabad suffered severe damage during a recent cyclone. The roof collapsed and the interior was destroyed.',
        story: 'Grace Community Church has been a beacon of hope in the Hyderabad community for over 30 years. During the recent cyclone, the church building suffered catastrophic damage. The roof collapsed, windows were shattered, and the interior was severely damaged by rain and debris.\n\nThe church serves over 500 families in the local community, providing not only spiritual guidance but also running a free tutoring program for underprivileged children, a weekly food distribution program, and a women\'s empowerment group.\n\nThe estimated cost of repairs is ₹2,000,000. Your support will help restore not just a building, but a community hub that touches hundreds of lives every week.',
        categoryId: categories[2].id,
        organizerId: users[1].id,
        beneficiaryName: 'Grace Community Church',
        beneficiaryRelationship: 'Senior Pastor',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id,
        goalAmount: 2000000, raisedAmount: 1250000, currency: 'INR',
        status: 'published', verificationLevel: 'organization',
        isFeatured: true, isUrgent: true,
        coverImage: covers[2],
        donorCount: 412, viewCount: 8930,
        endDate: new Date('2027-03-01'),
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'support-mission-work-rural-communities',
        title: 'Support Mission Work in Rural Communities',
        shortDescription: 'Help fund a year-long mission outreach to remote villages in Karnataka, bringing education, healthcare, and hope.',
        story: 'Our mission team is planning to spend the next year serving in remote villages in rural Karnataka. These communities have limited access to education, healthcare, and basic amenities.\n\nThe mission will focus on three key areas: setting up informal education centers for children who cannot attend school, organizing regular health check-up camps, and providing spiritual support and community building activities.\n\nWe need funds for travel, accommodation, educational materials, medical supplies, and community event organization.',
        categoryId: categories[3].id,
        organizerId: users[2].id,
        beneficiaryName: 'Rural Mission Team',
        beneficiaryRelationship: 'Mission Coordinator',
        countryId: india.id, stateId: karnataka.id, cityId: blr.id,
        goalAmount: 1200000, raisedAmount: 680000, currency: 'INR',
        status: 'published', verificationLevel: 'identity',
        isFeatured: false, isUrgent: false,
        coverImage: covers[3],
        donorCount: 156, viewCount: 3450,
        endDate: new Date('2027-06-30'),
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'school-bags-for-children',
        title: 'Provide School Bags for Children',
        shortDescription: 'Many children in rural areas attend school without proper bags or supplies. Help us provide 200 school bags filled with essential supplies.',
        story: 'In many rural communities, children walk several kilometers to school carrying their books in plastic bags or not at all. This affects their dignity, motivation, and ability to organize their learning materials.\n\nWe aim to provide 200 school bags, each containing notebooks, pens, pencils, erasers, a geometry box, and a water bottle. Each complete kit costs approximately ₹750.\n\nA school bag may seem like a small thing, but for these children, it represents hope, dignity, and the belief that their education matters.',
        categoryId: categories[1].id,
        organizerId: users[3].id,
        beneficiaryName: 'Village Children - Tamil Nadu',
        beneficiaryRelationship: 'Program Director',
        countryId: india.id, stateId: tamilNadu.id, cityId: chennai.id,
        goalAmount: 150000, raisedAmount: 89700, currency: 'INR',
        status: 'published', verificationLevel: 'identity',
        isFeatured: false, isUrgent: false,
        coverImage: covers[4],
        donorCount: 203, viewCount: 4210,
        endDate: new Date('2026-11-30'),
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'funeral-support-grieving-family',
        title: 'Funeral Support for a Grieving Family',
        shortDescription: 'The Thomas family lost their mother unexpectedly. They are struggling to arrange a dignified funeral and need support.',
        story: 'The Thomas family is going through an incredibly difficult time. Their beloved mother, Susamma Thomas (62), passed away unexpectedly due to a sudden cardiac arrest. She was the pillar of the family and is survived by her husband and four children.\n\nThe family is facing financial hardship and is struggling to arrange a dignified funeral. Any contribution will help the family give their mother the farewell she deserves.',
        categoryId: categories[6].id,
        organizerId: users[4].id,
        beneficiaryName: 'Thomas Family',
        beneficiaryRelationship: 'Church Member',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id,
        goalAmount: 75000, raisedAmount: 52000, currency: 'INR',
        status: 'published', verificationLevel: 'basic',
        isFeatured: false, isUrgent: true,
        coverImage: covers[5],
        donorCount: 98, viewCount: 1890,
        endDate: new Date('2026-09-30'),
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'community-food-distribution',
        title: 'Community Food Distribution Program',
        shortDescription: 'Help us feed 500 families every weekend for the next three months. Our community kitchen provides nutritious meals.',
        story: 'Food insecurity affects thousands of families in urban slums. Our community kitchen, run entirely by volunteers, has been providing meals every weekend for the past two years.\n\nWe currently serve about 300 families every weekend, but the demand has been increasing. With additional funding, we want to expand to serve 500 families and add a mid-week distribution.\n\nEvery meal we serve is prepared with love and care. For many families, this may be the only nutritious meal they receive all week.',
        categoryId: categories[5].id,
        organizerId: users[0].id,
        beneficiaryName: 'Community Kitchen Program',
        beneficiaryRelationship: 'Program Coordinator',
        countryId: india.id, stateId: maharashtra.id, cityId: mumbai.id,
        goalAmount: 600000, raisedAmount: 234000, currency: 'INR',
        status: 'published', verificationLevel: 'identity',
        isFeatured: false, isUrgent: false,
        coverImage: covers[6],
        donorCount: 178, viewCount: 3120,
        endDate: new Date('2027-01-31'),
      },
    }),
  ]);

  // Create donations
  const donorNames = ['Anonymous Donor', 'Michael Chen', 'Grace Williams', 'John Smith', 'Emily Davis', 'Robert Wilson', 'Sarah Brown', 'David Lee', 'Jennifer Martinez', 'Chris Anderson'];
  const messages = ['God bless you!', 'Praying for you.', 'Keep going, you are not alone.', 'Sending love and prayers.', 'Stay strong in faith.', 'The Lord is your shepherd.', 'You are in my prayers.', 'Blessings to you and your family.'];
  const amounts = [500, 1000, 2500, 5000, 10000];

  for (const campaign of campaigns) {
    const numDonations = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < numDonations; i++) {
      await prisma.donation.create({
        data: {
          campaignId: campaign.id,
          donorName: donorNames[Math.floor(Math.random() * donorNames.length)],
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          currency: campaign.currency,
          paymentStatus: 'completed',
          paymentProvider: 'demo',
          donorMessage: messages[Math.floor(Math.random() * messages.length)],
          isAnonymous: Math.random() > 0.7,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  // Create campaign updates
  await prisma.campaignUpdate.createMany({
    data: [
      { campaignId: campaigns[0].id, title: 'Thank You for Your Generosity!', content: 'We have reached 65% of our goal! Anita is so grateful for each one of you. She has been studying hard and got the highest marks in her class this term.', createdAt: new Date('2026-08-15') },
      { campaignId: campaigns[0].id, title: 'Anita Started Her New Term', content: 'Thanks to your support, Anita was able to start her new school term on time. She is now in 9th grade and doing exceptionally well.', createdAt: new Date('2026-07-20') },
      { campaignId: campaigns[1].id, title: 'Surgery Date Confirmed', content: 'Rajesh\'s surgery has been scheduled for next month. The doctors are optimistic about the outcome. Please continue to keep the family in your prayers.', createdAt: new Date('2026-08-20') },
      { campaignId: campaigns[2].id, title: 'Cleanup and Assessment Complete', content: 'Our volunteer team has completed the initial cleanup and structural assessment. The good news is that the foundation is intact.', createdAt: new Date('2026-08-10') },
      { campaignId: campaigns[2].id, title: 'Temporary Space Secured', content: 'While the church is being rebuilt, we have secured a temporary space for our Sunday services and community programs.', createdAt: new Date('2026-08-25') },
    ],
  });

  // Create prayers
  for (const campaign of campaigns) {
    const numPrayers = Math.floor(Math.random() * 50) + 10;
    for (let i = 0; i < numPrayers; i++) {
      await prisma.prayer.create({
        data: { campaignId: campaign.id, createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) },
      });
    }
  }

  // Create Platform Settings
  await prisma.platformSettings.createMany({
    data: [
      { key: 'platform_fee_percent', value: '5' },
      { key: 'fixed_transaction_fee', value: '0' },
      { key: 'donor_tip_enabled', value: 'true' },
      { key: 'default_tip_percent', value: '5' },
      { key: 'admin_moderation_enabled', value: 'true' },
      { key: 'site_name', value: 'GraceFund' },
      { key: 'site_tagline', value: 'Giving Hope. Sharing Grace. Changing Lives.' },
    ],
  });

  console.log('Seed completed successfully!');
  console.log(`Created ${campaigns.length} campaigns, ${categories.length} categories, ${users.length + 1} users`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
