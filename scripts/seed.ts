import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
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
  const india = await prisma.country.create({ data: { name: 'India', code: 'IN', currency: 'INR', currencySymbol: '₹' } });
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

  // Create Categories (10 inclusive, secular categories)
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Medical & Health', slug: 'medical-health', description: 'Medical treatment, hospital expenses, surgery, emergency medical care, recovery, and disability support', icon: 'heart-pulse', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Education', slug: 'education', description: 'School fees, college fees, books, school supplies, student support, and educational projects', icon: 'graduation-cap', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Emergency', slug: 'emergency', description: 'Family emergencies, accidents, fires, natural disasters, and crisis support', icon: 'alert-triangle', sortOrder: 3 } }),
    prisma.category.create({ data: { name: 'Family & Personal', slug: 'family-personal', description: 'Family support, housing emergencies, food support, essential needs, and personal emergencies', icon: 'home', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Funeral & Memorial', slug: 'funeral-memorial', description: 'Funeral expenses, memorial support, burial expenses, and family bereavement support', icon: 'flower-2', sortOrder: 5 } }),
    prisma.category.create({ data: { name: 'Children', slug: 'children', description: 'Child education, child welfare, essential supplies, and community child support', icon: 'baby', sortOrder: 6 } }),
    prisma.category.create({ data: { name: 'Community', slug: 'community', description: 'Community development, local projects, community facilities, and public welfare', icon: 'users', sortOrder: 7 } }),
    prisma.category.create({ data: { name: 'Charity & Nonprofit', slug: 'charity-nonprofit', description: 'Registered charities, NGOs, social impact organizations, and humanitarian projects', icon: 'globe', sortOrder: 8 } }),
    prisma.category.create({ data: { name: 'Animal Welfare', slug: 'animal-welfare', description: 'Animal rescue, veterinary treatment, shelter support, and animal care', icon: 'paw-print', sortOrder: 9 } }),
    prisma.category.create({ data: { name: 'Disaster Relief', slug: 'disaster-relief', description: 'Flood relief, fire relief, storm relief, emergency supplies, and disaster recovery', icon: 'cloud-rain', sortOrder: 10 } }),
  ]);

  // Create Users (diverse, no religious titles)
  await prisma.user.create({ data: { name: 'Admin User', email: 'admin@gracefund.org', role: 'admin', verificationLevel: 'organization', status: 'active' } });
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'fundraiser', verificationLevel: 'identity', status: 'active' } }),
    prisma.user.create({ data: { name: 'David Menon', email: 'david@example.com', role: 'organization', verificationLevel: 'organization', status: 'active' } }),
    prisma.user.create({ data: { name: 'Maria Santos', email: 'maria@example.com', role: 'fundraiser', verificationLevel: 'basic', status: 'active' } }),
    prisma.user.create({ data: { name: 'James Okafor', email: 'james@example.com', role: 'fundraiser', verificationLevel: 'identity', status: 'active' } }),
    prisma.user.create({ data: { name: 'Ruth Kumar', email: 'ruth@example.com', role: 'fundraiser', verificationLevel: 'basic', status: 'active' } }),
    prisma.user.create({ data: { name: 'Priya Sharma', email: 'priya@example.com', role: 'fundraiser', verificationLevel: 'identity', status: 'active' } }),
    prisma.user.create({ data: { name: 'Michael Chen', email: 'michael@example.com', role: 'donor', verificationLevel: 'basic', status: 'active' } }),
    prisma.user.create({ data: { name: 'Grace Williams', email: 'grace@example.com', role: 'donor', verificationLevel: 'basic', status: 'active' } }),
  ]);

  // Create Organizations (secular, diverse types)
  await prisma.organization.create({
    data: { ownerId: users[1].id, name: 'Seva Foundation', type: 'ngo', description: 'A registered nonprofit working in community development and welfare across Telangana for over 15 years.', website: 'https://sevafoundation.org', country: 'India', city: 'Hyderabad', verificationStatus: 'verified', socialLinks: JSON.stringify({ facebook: '#', website: 'https://sevafoundation.org' }) },
  });
  await prisma.organization.create({
    data: { ownerId: users[5].id, name: 'Hope Foundation', type: 'charity', description: 'A registered charity focused on education and child welfare across rural India.', country: 'India', city: 'Bangalore', verificationStatus: 'verified', socialLinks: JSON.stringify({ website: 'https://hopefoundation.org' }) },
  });

  // Cover images - diverse, inclusive imagery
  const covers = [
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=500&fit=crop',
  ];

  const defaultFeatures = JSON.stringify({ donor_messages: true, anonymous_donations: true, campaign_updates: true, beneficiary_verification: false, fund_usage: false });

  // Create diverse, secular campaigns
  const campaigns = await Promise.all([
    // 1. Emergency Medical Treatment for a Father
    prisma.campaign.create({
      data: {
        slug: 'emergency-medical-treatment-father',
        title: 'Help a Father Receive Emergency Medical Treatment',
        shortDescription: 'Rajesh, a 42-year-old father of three, was diagnosed with a serious heart condition. He needs urgent surgery that the family cannot afford.',
        story: 'Rajesh Kumar is a loving father of three young children and the sole breadwinner for his family. Two months ago, he was diagnosed with a critical heart condition that requires immediate surgical intervention.\n\nThe estimated cost of the surgery, including hospitalization and post-operative care, is ₹8,00,000. The family has already exhausted their savings on diagnostic tests and preliminary treatments.\n\nRajesh\'s wife, Lakshmi, is a homemaker who is now struggling to manage household expenses while caring for her husband and three children. The surgery is scheduled for next month, and the family needs to arrange the funds urgently.\n\nEvery donation, no matter how small, brings this family closer to the care Rajesh needs.',
        categoryId: categories[0].id, organizerId: users[4].id, campaignType: 'family',
        beneficiaryName: 'Rajesh Kumar', beneficiaryRelationship: 'Brother-in-law',
        countryId: india.id, stateId: andhra.id, cityId: vizag.id,
        goalAmount: 800000, raisedAmount: 456000, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: true, isUrgent: true,
        campaignFeatures: defaultFeatures, coverImage: covers[0],
        donorCount: 234, viewCount: 5670, endDate: new Date('2026-10-15'),
      },
    }),
    // 2. Help a Student Continue Her Education
    prisma.campaign.create({
      data: {
        slug: 'help-student-continue-education',
        title: 'Help a Student Continue Her Education',
        shortDescription: 'Anita is a bright 14-year-old girl from a low-income family. Her father lost his job, and the family is struggling to pay her school fees.',
        story: 'Anita has always been a dedicated student. She dreams of becoming a doctor and serving her community. However, her family\'s financial situation has made it increasingly difficult to continue her education.\n\nHer father, who worked as a daily wage laborer, lost his job during an economic downturn. Her mother works as a domestic helper, but her earnings are barely enough to cover basic necessities.\n\nAnita needs approximately ₹50,000 to cover her school fees, books, uniform, and other educational supplies for the next academic year. Without this support, she may have to drop out of school.\n\nEvery contribution, no matter how small, will help keep Anita in school and give her the chance to pursue her dreams.',
        categoryId: categories[1].id, organizerId: users[0].id, campaignType: 'individual',
        beneficiaryName: 'Anita Reddy', beneficiaryRelationship: 'Family friend',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id,
        goalAmount: 50000, raisedAmount: 32500, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: true, isUrgent: false,
        campaignFeatures: defaultFeatures, coverImage: covers[1],
        donorCount: 87, viewCount: 2340, endDate: new Date('2026-12-31'),
      },
    }),
    // 3. Support a Family After a House Fire
    prisma.campaign.create({
      data: {
        slug: 'support-family-after-house-fire',
        title: 'Support a Family After a House Fire',
        shortDescription: 'The Patel family lost everything in a devastating house fire. They need help rebuilding their lives and finding temporary housing.',
        story: 'On a quiet Sunday morning, a fire broke out in the Patel family home. Within minutes, years of memories, belongings, and their sense of security were reduced to ashes. Thankfully, the family of five escaped unharmed, but they are now facing an incredibly difficult road ahead.\n\nSuresh Patel, a taxi driver, and his wife Meena were not insured. They are currently staying with relatives while trying to figure out how to rebuild. The estimated cost of repairs and replacing essential items is ₹6,00,000.\n\nThe couple has three children, the youngest just 4 years old. They need help with temporary accommodation, replacing clothing and school supplies, and eventually repairing their home.\n\nThis family has always been known for helping others in their community. Now, they are the ones who need support.',
        categoryId: categories[2].id, organizerId: users[2].id, campaignType: 'family',
        beneficiaryName: 'Patel Family', beneficiaryRelationship: 'Neighbor',
        countryId: india.id, stateId: maharashtra.id, cityId: mumbai.id,
        goalAmount: 600000, raisedAmount: 287000, currency: 'INR',
        status: 'published', verificationLevel: 'basic', isFeatured: true, isUrgent: true,
        campaignFeatures: defaultFeatures, coverImage: covers[2],
        donorCount: 145, viewCount: 3890, endDate: new Date('2026-11-30'),
      },
    }),
    // 4. Provide School Supplies for Children
    prisma.campaign.create({
      data: {
        slug: 'provide-school-supplies-children',
        title: 'Provide School Supplies for 100 Children',
        shortDescription: 'Many children in rural areas attend school without proper supplies. Help us provide 200 school kits to children in need across Tamil Nadu.',
        story: 'In many rural communities, children walk several kilometers to school carrying their books in plastic bags or not at all. This affects their dignity, motivation, and ability to organize their learning materials.\n\nWe aim to provide 200 school kits, each containing a school bag, notebooks, pens, pencils, erasers, a geometry box, and a water bottle. Each complete kit costs approximately ₹750.\n\nThese kits will be distributed to children from low-income families across 10 villages in Tamil Nadu. We have already identified the children and schools that will benefit from this program.\n\nA school kit may seem like a small thing, but for these children, it represents hope, dignity, and the belief that their education matters.',
        categoryId: categories[5].id, organizerId: users[3].id, campaignType: 'charity',
        beneficiaryName: 'Village Children - Tamil Nadu', beneficiaryRelationship: 'Program Director',
        countryId: india.id, stateId: tamilNadu.id, cityId: chennai.id,
        goalAmount: 150000, raisedAmount: 89700, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: false, isUrgent: false,
        campaignFeatures: defaultFeatures, coverImage: covers[3],
        donorCount: 203, viewCount: 4210, endDate: new Date('2026-11-30'),
      },
    }),
    // 5. Community Food Distribution Project
    prisma.campaign.create({
      data: {
        slug: 'community-food-distribution',
        title: 'Community Food Distribution Project',
        shortDescription: 'Help us feed 500 families every weekend for three months. Our community kitchen provides nutritious meals to those facing food insecurity.',
        story: 'Food insecurity affects thousands of families in urban slums. Our community kitchen, run entirely by volunteers, has been providing meals every weekend for the past two years.\n\nWe currently serve about 300 families every weekend, but the demand has been increasing. With additional funding, we want to expand to serve 500 families and add a mid-week distribution.\n\nThe program costs approximately ₹50,000 per week to run, covering groceries, cooking gas, packaging materials, and transportation. Our goal is to raise ₹6,00,000 to sustain the program for three months while we develop long-term partnerships.\n\nEvery meal we serve is prepared with care. For many families, this may be the only nutritious meal they receive all week.',
        categoryId: categories[6].id, organizerId: users[0].id, campaignType: 'community',
        beneficiaryName: 'Community Kitchen Program', beneficiaryRelationship: 'Program Coordinator',
        countryId: india.id, stateId: maharashtra.id, cityId: mumbai.id,
        goalAmount: 600000, raisedAmount: 234000, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: false, isUrgent: false,
        campaignFeatures: defaultFeatures, coverImage: covers[4],
        donorCount: 178, viewCount: 3120, endDate: new Date('2027-01-31'),
      },
    }),
    // 6. Help Rebuild a Community Center
    prisma.campaign.create({
      data: {
        slug: 'rebuild-community-center',
        title: 'Help Rebuild a Community Center',
        shortDescription: 'A cyclone severely damaged our community center that served 500+ families. We need support to restore this vital community hub.',
        story: 'Our community center has been a vital resource in Hyderabad for over 15 years. During a recent cyclone, the building suffered catastrophic damage. The roof collapsed, windows were shattered, and the interior was severely damaged.\n\nThe center serves over 500 families, providing free tutoring for underprivileged children, a weekly food distribution program, vocational training for women, and a senior citizens\' activity group.\n\nThe estimated cost of repairs is ₹15,00,000. The community has raised some funds, but we need additional support to complete the restoration.\n\nYour support will help restore not just a building, but a community hub that touches hundreds of lives every week.',
        categoryId: categories[6].id, organizerId: users[5].id, campaignType: 'community',
        beneficiaryName: 'Hyderabad Community Center', beneficiaryRelationship: 'Project Lead',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id,
        goalAmount: 1500000, raisedAmount: 875000, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: true, isUrgent: false,
        campaignFeatures: defaultFeatures, coverImage: covers[5],
        donorCount: 312, viewCount: 6780, endDate: new Date('2027-03-01'),
      },
    }),
    // 7. Funeral Support for a Grieving Family
    prisma.campaign.create({
      data: {
        slug: 'funeral-support-grieving-family',
        title: 'Funeral Support for a Grieving Family',
        shortDescription: 'The Thomas family lost their mother unexpectedly. They are struggling to arrange a dignified funeral and need support during this difficult time.',
        story: 'The Thomas family is going through an incredibly difficult time. Their beloved mother, Susamma Thomas (62), passed away unexpectedly due to a sudden cardiac arrest. She was the pillar of the family and is survived by her husband and four children.\n\nThe family is facing financial hardship and is struggling to arrange a dignified funeral. They need support with funeral home costs, coffin, burial expenses, and other related costs.\n\nThe family has always been active in their community and has helped many others in times of need. Now, they are the ones who need support.\n\nAny contribution, no matter how small, will help the family give their mother the farewell she deserves and ease their burden during this time of grief.',
        categoryId: categories[4].id, organizerId: users[4].id, campaignType: 'family',
        beneficiaryName: 'Thomas Family', beneficiaryRelationship: 'Community Member',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id,
        goalAmount: 75000, raisedAmount: 52000, currency: 'INR',
        status: 'published', verificationLevel: 'basic', isFeatured: false, isUrgent: true,
        campaignFeatures: defaultFeatures, coverImage: covers[6],
        donorCount: 98, viewCount: 1890, endDate: new Date('2026-09-30'),
      },
    }),
    // 8. Support a Registered Charity Project
    prisma.campaign.create({
      data: {
        slug: 'support-registered-charity-project',
        title: 'Support a Registered Charity Project',
        shortDescription: 'Hope Foundation is raising funds to build a learning center for underprivileged children in rural Karnataka. Every child deserves access to quality education.',
        story: 'Hope Foundation is a registered nonprofit that has been working in child education and welfare for 12 years. Our latest project aims to build a dedicated learning center in a rural district of Karnataka where educational infrastructure is severely lacking.\n\nThe learning center will serve 300+ children annually, providing after-school tutoring, computer literacy classes, a library, and a safe space for learning. The total project cost is ₹20,00,000, of which we have already raised ₹8,00,000 through grants and individual donors.\n\nWe need an additional ₹12,00,000 to complete construction and equip the center. Our organization is verified, and all financial records are available for review.\n\nEducation is the most powerful tool we can give a child. With your support, we can give hundreds of children the chance to break the cycle of poverty.',
        categoryId: categories[7].id, organizerId: users[5].id, campaignType: 'charity',
        beneficiaryName: 'Hope Foundation', beneficiaryRelationship: 'Director',
        countryId: india.id, stateId: karnataka.id, cityId: blr.id,
        goalAmount: 1200000, raisedAmount: 680000, currency: 'INR',
        status: 'published', verificationLevel: 'organization', isFeatured: true, isUrgent: false,
        campaignFeatures: defaultFeatures, coverImage: covers[8],
        donorCount: 267, viewCount: 5430, endDate: new Date('2027-04-30'),
      },
    }),
    // 9. Animal Rescue and Veterinary Care
    prisma.campaign.create({
      data: {
        slug: 'animal-rescue-veterinary-care',
        title: 'Animal Rescue and Veterinary Care',
        shortDescription: 'Our shelter has taken in 30 injured and abandoned animals after recent floods. We need funds for veterinary treatment, food, and shelter repairs.',
        story: 'After the recent floods in Telangana, our small animal shelter was overwhelmed with injured and abandoned animals. We have taken in 30 additional animals, including dogs, cats, and cattle, that were found stranded or injured in the floodwaters.\n\nThe veterinary bills for treating these animals are mounting. Many need surgery, vaccinations, and ongoing medication. Additionally, our shelter building suffered damage and needs repairs.\n\nWe need approximately ₹2,50,000 to cover veterinary care for all the animals, repair the shelter, and ensure we have enough food and supplies for the next three months.\n\nEvery animal deserves care and compassion. Your support helps us continue our mission of rescuing and rehabilitating animals in need.',
        categoryId: categories[8].id, organizerId: users[1].id, campaignType: 'organization',
        beneficiaryName: 'Hyderabad Animal Shelter', beneficiaryRelationship: 'Shelter Manager',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id,
        goalAmount: 250000, raisedAmount: 124000, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: false, isUrgent: true,
        campaignFeatures: defaultFeatures, coverImage: covers[7],
        donorCount: 89, viewCount: 2670, endDate: new Date('2026-10-31'),
      },
    }),
  ]);

  // Create donations
  const donorNames = ['Anonymous Donor', 'Michael Chen', 'Grace Williams', 'John Smith', 'Emily Davis', 'Robert Wilson', 'Sarah Brown', 'David Lee', 'Jennifer Martinez', 'Chris Anderson'];
  const messages = ['You are in my thoughts.', 'Sending strength and support.', 'Keep going, you are not alone.', 'Wishing you the very best.', 'Stay strong.', 'Hope this helps.', 'Thinking of you and your family.', 'Wishing you a speedy recovery.', 'Well done for organizing this.', 'Proud to support this cause.'];
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
          paymentStatus: 'completed', paymentProvider: 'demo',
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
      { campaignId: campaigns[1].id, title: 'Thank You for Your Generosity!', content: 'We have reached 65% of our goal! Anita is so grateful for each one of you. She has been studying hard and got the highest marks in her class this term.', createdAt: new Date('2026-08-15') },
      { campaignId: campaigns[1].id, title: 'Anita Started Her New Term', content: 'Thanks to your support, Anita was able to start her new school term on time. She is now in 9th grade and doing exceptionally well.', createdAt: new Date('2026-07-20') },
      { campaignId: campaigns[0].id, title: 'Surgery Date Confirmed', content: 'We are grateful to share that Rajesh\'s surgery has been scheduled for next month. The doctors are optimistic about the outcome. Please continue to keep the family in your thoughts.', createdAt: new Date('2026-08-20') },
      { campaignId: campaigns[5].id, title: 'Cleanup and Assessment Complete', content: 'Our volunteer team has completed the initial cleanup and structural assessment. The good news is that the foundation is intact.', createdAt: new Date('2026-08-10') },
      { campaignId: campaigns[5].id, title: 'Temporary Space Secured', content: 'While the center is being rebuilt, we have secured a temporary space for our programs. The work continues!', createdAt: new Date('2026-08-25') },
      { campaignId: campaigns[2].id, title: 'Family Moved to Temporary Housing', content: 'The Patel family has found a temporary place to stay thanks to a generous community member. The road ahead is still long, but this takes some pressure off.', createdAt: new Date('2026-08-22') },
    ],
  });

  // Platform Settings (secular, inclusive)
  await prisma.platformSettings.createMany({
    data: [
      { key: 'platform_fee_percent', value: '5' },
      { key: 'fixed_transaction_fee', value: '0' },
      { key: 'donor_tip_enabled', value: 'true' },
      { key: 'default_tip_percent', value: '5' },
      { key: 'admin_moderation_enabled', value: 'true' },
      { key: 'international_donations_enabled', value: 'false' },
      { key: 'site_name', value: 'GraceFund' },
      { key: 'site_tagline', value: 'Giving Hope. Changing Lives.' },
      { key: 'site_description', value: 'A trusted community crowdfunding platform that helps individuals, families, communities, organizations, and meaningful causes raise financial support when they need it most.' },
    ],
  });

  console.log('Seed completed successfully!');
  console.log(`Created ${campaigns.length} campaigns, ${categories.length} categories, ${users.length + 1} users`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
