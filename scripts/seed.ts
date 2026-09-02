import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear all tables in dependency order (new models first)
  await prisma.infoRequest.deleteMany();
  await prisma.campaignEdit.deleteMany();
  await prisma.fundUsageItem.deleteMany();
  await prisma.privateDocument.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.riskEvent.deleteMany();
  await prisma.verification.deleteMany();
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

  // ===== GEOGRAPHY =====
  const india = await prisma.country.create({ data: { name: 'India', code: 'IN', currency: 'INR', currencySymbol: '₹' } });
  await prisma.country.create({ data: { name: 'United States', code: 'US', currency: 'USD', currencySymbol: '$' } });
  await prisma.country.create({ data: { name: 'United Kingdom', code: 'GB', currency: 'GBP', currencySymbol: '£' } });
  await prisma.country.create({ data: { name: 'United Arab Emirates', code: 'AE', currency: 'AED', currencySymbol: 'د.إ' } });
  await prisma.country.create({ data: { name: 'Nigeria', code: 'NG', currency: 'NGN', currencySymbol: '₦' } });
  await prisma.country.create({ data: { name: 'Kenya', code: 'KE', currency: 'KES', currencySymbol: 'KSh' } });
  await prisma.country.create({ data: { name: 'Philippines', code: 'PH', currency: 'PHP', currencySymbol: '₱' } });
  await prisma.country.create({ data: { name: 'Brazil', code: 'BR', currency: 'BRL', currencySymbol: 'R$' } });

  const telangana = await prisma.state.create({ data: { name: 'Telangana', countryId: india.id, code: 'TG' } });
  const andhra = await prisma.state.create({ data: { name: 'Andhra Pradesh', countryId: india.id, code: 'AP' } });
  const karnataka = await prisma.state.create({ data: { name: 'Karnataka', countryId: india.id, code: 'KA' } });
  const tamilNadu = await prisma.state.create({ data: { name: 'Tamil Nadu', countryId: india.id, code: 'TN' } });
  const maharashtra = await prisma.state.create({ data: { name: 'Maharashtra', countryId: india.id, code: 'MH' } });

  const hyd = await prisma.city.create({ data: { name: 'Hyderabad', stateId: telangana.id } });
  await prisma.city.create({ data: { name: 'Warangal', stateId: telangana.id } });
  const vizag = await prisma.city.create({ data: { name: 'Visakhapatnam', stateId: andhra.id } });
  await prisma.city.create({ data: { name: 'Vijayawada', stateId: andhra.id } });
  const blr = await prisma.city.create({ data: { name: 'Bangalore', stateId: karnataka.id } });
  const chennai = await prisma.city.create({ data: { name: 'Chennai', stateId: tamilNadu.id } });
  const mumbai = await prisma.city.create({ data: { name: 'Mumbai', stateId: maharashtra.id } });

  // ===== CATEGORIES (10 secular) =====
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

  // ===== USERS (diverse, no religious titles) =====
  const admin = await prisma.user.create({ data: { name: 'Admin User', email: 'admin@gracefund.org', role: 'admin', verificationLevel: 'organization', status: 'active' } });
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+91-9876543210', role: 'fundraiser', verificationLevel: 'identity', status: 'active' } }),
    prisma.user.create({ data: { name: 'David Menon', email: 'david@example.com', phone: '+91-9876543211', role: 'organization', verificationLevel: 'organization', status: 'active' } }),
    prisma.user.create({ data: { name: 'Maria Santos', email: 'maria@example.com', role: 'fundraiser', verificationLevel: 'basic', status: 'active' } }),
    prisma.user.create({ data: { name: 'James Okafor', email: 'james@example.com', role: 'fundraiser', verificationLevel: 'identity', status: 'active' } }),
    prisma.user.create({ data: { name: 'Ruth Kumar', email: 'ruth@example.com', role: 'fundraiser', verificationLevel: 'basic', status: 'active' } }),
    prisma.user.create({ data: { name: 'Priya Sharma', email: 'priya@example.com', role: 'fundraiser', verificationLevel: 'identity', status: 'active' } }),
    prisma.user.create({ data: { name: 'Michael Chen', email: 'michael@example.com', role: 'donor', verificationLevel: 'basic', status: 'active' } }),
    prisma.user.create({ data: { name: 'Grace Williams', email: 'grace@example.com', role: 'donor', verificationLevel: 'basic', status: 'active' } }),
  ]);

  // ===== ORGANIZATIONS =====
  await prisma.organization.create({
    data: { ownerId: users[1].id, name: 'Seva Foundation', type: 'ngo', description: 'A registered nonprofit working in community development and welfare across Telangana for over 15 years.', website: 'https://sevafoundation.org', country: 'India', city: 'Hyderabad', verificationStatus: 'verified', socialLinks: JSON.stringify({ facebook: '#', website: 'https://sevafoundation.org' }) },
  });
  await prisma.organization.create({
    data: { ownerId: users[5].id, name: 'Hope Foundation', type: 'charity', description: 'A registered charity focused on education and child welfare across rural India.', country: 'India', city: 'Bangalore', verificationStatus: 'verified', socialLinks: JSON.stringify({ website: 'https://hopefoundation.org' }) },
  });

  // ===== COVER IMAGES =====
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

  // ===== CAMPAIGNS (7 published + 2 pending review) =====
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        slug: 'emergency-medical-treatment-father', title: 'Help a Father Receive Emergency Medical Treatment',
        shortDescription: 'Rajesh, a 42-year-old father of three, was diagnosed with a serious heart condition. He needs urgent surgery that the family cannot afford.',
        story: 'Rajesh Kumar is a loving father of three young children and the sole breadwinner for his family. Two months ago, he was diagnosed with a critical heart condition that requires immediate surgical intervention.\n\nThe estimated cost of the surgery, including hospitalization and post-operative care, is ₹8,00,000. The family has already exhausted their savings on diagnostic tests and preliminary treatments.\n\nRajesh\'s wife, Lakshmi, is a homemaker who is now struggling to manage household expenses while caring for her husband and three children. The surgery is scheduled for next month, and the family needs to arrange the funds urgently.\n\nEvery donation, no matter how small, brings this family closer to the care Rajesh needs.',
        categoryId: categories[0].id, organizerId: users[4].id, campaignType: 'family', beneficiaryName: 'Rajesh Kumar', beneficiaryRelationship: 'Brother-in-law',
        countryId: india.id, stateId: andhra.id, cityId: vizag.id, goalAmount: 800000, raisedAmount: 456000, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: true, isUrgent: true, riskLevel: 'low',
        campaignFeatures: defaultFeatures, coverImage: covers[0], donorCount: 234, viewCount: 5670, endDate: new Date('2026-10-15'), submittedAt: new Date('2026-07-01'), reviewedAt: new Date('2026-07-02'), reviewerId: admin.id,
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'help-student-continue-education', title: 'Help a Student Continue Her Education',
        shortDescription: 'Anita is a bright 14-year-old girl from a low-income family. Her father lost his job, and the family is struggling to pay her school fees.',
        story: 'Anita has always been a dedicated student. She dreams of becoming a doctor and serving her community. However, her family\'s financial situation has made it increasingly difficult to continue her education.\n\nHer father, who worked as a daily wage laborer, lost his job during an economic downturn. Her mother works as a domestic helper, but her earnings are barely enough to cover basic necessities.\n\nAnita needs approximately ₹50,000 to cover her school fees, books, uniform, and other educational supplies for the next academic year. Without this support, she may have to drop out of school.\n\nEvery contribution, no matter how small, will help keep Anita in school and give her the chance to pursue her dreams.',
        categoryId: categories[1].id, organizerId: users[0].id, campaignType: 'individual', beneficiaryName: 'Anita Reddy', beneficiaryRelationship: 'Family friend',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id, goalAmount: 50000, raisedAmount: 32500, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: true, isUrgent: false, riskLevel: 'low',
        campaignFeatures: defaultFeatures, coverImage: covers[1], donorCount: 87, viewCount: 2340, endDate: new Date('2026-12-31'), submittedAt: new Date('2026-06-15'), reviewedAt: new Date('2026-06-16'), reviewerId: admin.id,
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'support-family-after-house-fire', title: 'Support a Family After a House Fire',
        shortDescription: 'The Patel family lost everything in a devastating house fire. They need help rebuilding their lives and finding temporary housing.',
        story: 'On a quiet Sunday morning, a fire broke out in the Patel family home. Within minutes, years of memories, belongings, and their sense of security were reduced to ashes. Thankfully, the family of five escaped unharmed, but they are now facing an incredibly difficult road ahead.\n\nSuresh Patel, a taxi driver, and his wife Meena were not insured. They are currently staying with relatives while trying to figure out how to rebuild. The estimated cost of repairs and replacing essential items is ₹6,00,000.\n\nThe couple has three children, the youngest just 4 years old. They need help with temporary accommodation, replacing clothing and school supplies, and eventually repairing their home.',
        categoryId: categories[2].id, organizerId: users[2].id, campaignType: 'family', beneficiaryName: 'Patel Family', beneficiaryRelationship: 'Neighbor',
        countryId: india.id, stateId: maharashtra.id, cityId: mumbai.id, goalAmount: 600000, raisedAmount: 287000, currency: 'INR',
        status: 'published', verificationLevel: 'basic', isFeatured: true, isUrgent: true, riskLevel: 'low',
        campaignFeatures: defaultFeatures, coverImage: covers[2], donorCount: 145, viewCount: 3890, endDate: new Date('2026-11-30'), submittedAt: new Date('2026-07-20'), reviewedAt: new Date('2026-07-21'), reviewerId: admin.id,
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'provide-school-supplies-children', title: 'Provide School Supplies for 100 Children',
        shortDescription: 'Many children in rural areas attend school without proper supplies. Help us provide 200 school kits to children in need across Tamil Nadu.',
        story: 'In many rural communities, children walk several kilometers to school carrying their books in plastic bags or not at all. This affects their dignity, motivation, and ability to organize their learning materials.\n\nWe aim to provide 200 school kits, each containing a school bag, notebooks, pens, pencils, erasers, a geometry box, and a water bottle. Each complete kit costs approximately ₹750.',
        categoryId: categories[5].id, organizerId: users[3].id, campaignType: 'charity', beneficiaryName: 'Village Children - Tamil Nadu', beneficiaryRelationship: 'Program Director',
        countryId: india.id, stateId: tamilNadu.id, cityId: chennai.id, goalAmount: 150000, raisedAmount: 89700, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: false, isUrgent: false, riskLevel: 'low',
        campaignFeatures: defaultFeatures, coverImage: covers[3], donorCount: 203, viewCount: 4210, endDate: new Date('2026-11-30'), submittedAt: new Date('2026-06-10'), reviewedAt: new Date('2026-06-12'), reviewerId: admin.id,
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'community-food-distribution', title: 'Community Food Distribution Project',
        shortDescription: 'Help us feed 500 families every weekend for three months. Our community kitchen provides nutritious meals to those facing food insecurity.',
        story: 'Food insecurity affects thousands of families in urban slums. Our community kitchen, run entirely by volunteers, has been providing meals every weekend for the past two years.\n\nWe currently serve about 300 families every weekend, but the demand has been increasing. With additional funding, we want to expand to serve 500 families and add a mid-week distribution.\n\nThe program costs approximately ₹50,000 per week to run, covering groceries, cooking gas, packaging materials, and transportation.',
        categoryId: categories[6].id, organizerId: users[0].id, campaignType: 'community', beneficiaryName: 'Community Kitchen Program', beneficiaryRelationship: 'Program Coordinator',
        countryId: india.id, stateId: maharashtra.id, cityId: mumbai.id, goalAmount: 600000, raisedAmount: 234000, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: false, isUrgent: false, riskLevel: 'low',
        campaignFeatures: defaultFeatures, coverImage: covers[4], donorCount: 178, viewCount: 3120, endDate: new Date('2027-01-31'), submittedAt: new Date('2026-05-15'), reviewedAt: new Date('2026-05-16'), reviewerId: admin.id,
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'rebuild-community-center', title: 'Help Rebuild a Community Center',
        shortDescription: 'A cyclone severely damaged our community center that served 500+ families. We need support to restore this vital community hub.',
        story: 'Our community center has been a vital resource in Hyderabad for over 15 years. During a recent cyclone, the building suffered catastrophic damage. The roof collapsed, windows were shattered, and the interior was severely damaged.\n\nThe center serves over 500 families, providing free tutoring for underprivileged children, a weekly food distribution program, vocational training for women, and a senior citizens\' activity group.\n\nThe estimated cost of repairs is ₹15,00,000. The community has raised some funds, but we need additional support to complete the restoration.',
        categoryId: categories[6].id, organizerId: users[5].id, campaignType: 'community', beneficiaryName: 'Hyderabad Community Center', beneficiaryRelationship: 'Project Lead',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id, goalAmount: 1500000, raisedAmount: 875000, currency: 'INR',
        status: 'published', verificationLevel: 'identity', isFeatured: true, isUrgent: false, riskLevel: 'low',
        campaignFeatures: defaultFeatures, coverImage: covers[5], donorCount: 312, viewCount: 6780, endDate: new Date('2027-03-01'), submittedAt: new Date('2026-04-10'), reviewedAt: new Date('2026-04-11'), reviewerId: admin.id,
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'funeral-support-grieving-family', title: 'Funeral Support for a Grieving Family',
        shortDescription: 'The Thomas family lost their mother unexpectedly. They are struggling to arrange a dignified funeral and need support during this difficult time.',
        story: 'The Thomas family is going through an incredibly difficult time. Their beloved mother, Susamma Thomas (62), passed away unexpectedly due to a sudden cardiac arrest. She was the pillar of the family and is survived by her husband and four children.\n\nThe family is facing financial hardship and is struggling to arrange a dignified funeral. They need support with funeral home costs, coffin, burial expenses, and other related costs.',
        categoryId: categories[4].id, organizerId: users[4].id, campaignType: 'family', beneficiaryName: 'Thomas Family', beneficiaryRelationship: 'Community Member',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id, goalAmount: 75000, raisedAmount: 52000, currency: 'INR',
        status: 'published', verificationLevel: 'basic', isFeatured: false, isUrgent: true, riskLevel: 'low',
        campaignFeatures: defaultFeatures, coverImage: covers[6], donorCount: 98, viewCount: 1890, endDate: new Date('2026-09-30'), submittedAt: new Date('2026-08-01'), reviewedAt: new Date('2026-08-02'), reviewerId: admin.id,
      },
    }),
    // === PENDING REVIEW CAMPAIGNS ===
    prisma.campaign.create({
      data: {
        slug: 'help-build-well-rural-village', title: 'Help Build a Well in Rural Village',
        shortDescription: 'Our village of 300 people has no access to clean drinking water. We need funds to drill a borewell and install a handpump.',
        story: 'The village of Narsapur in Telangana has been facing a severe water crisis for over two years. The nearest clean water source is 3 kilometers away, and women and children spend hours each day fetching water.\n\nWe plan to drill a borewell and install a handpump at an estimated cost of ₹1,50,000. The village panchayat has identified the site and obtained the necessary permissions.\n\nThis project will provide clean drinking water to over 300 residents, improving health, education attendance, and overall quality of life.',
        categoryId: categories[6].id, organizerId: users[3].id, campaignType: 'community', beneficiaryName: 'Narsapur Village', beneficiaryRelationship: 'Village Representative',
        countryId: india.id, stateId: telangana.id, cityId: hyd.id, goalAmount: 150000, raisedAmount: 0, currency: 'INR',
        status: 'under_review', verificationLevel: 'basic', isFeatured: false, isUrgent: false, riskLevel: 'low',
        campaignFeatures: defaultFeatures, coverImage: covers[7], donorCount: 0, viewCount: 0, endDate: new Date('2027-02-28'), submittedAt: new Date('2026-09-01'),
      },
    }),
    prisma.campaign.create({
      data: {
        slug: 'support-after-school-tutoring', title: 'Support After-School Tutoring Program',
        shortDescription: 'We want to start a free after-school tutoring program for underprivileged children in Mumbai slums. Help us fund teachers and supplies.',
        story: 'Children in low-income communities often lack access to quality academic support outside of school. We are a group of volunteer teachers who want to establish a structured after-school tutoring program.\n\nThe program will serve 100 children initially, providing daily tutoring in Mathematics, Science, and English. We need funds for teaching materials, a small rental space, and a part-time coordinator.\n\nTotal budget: ₹2,00,000 for the first 6 months.',
        categoryId: categories[1].id, organizerId: users[2].id, campaignType: 'charity', beneficiaryName: 'Slum Children - Mumbai', beneficiaryRelationship: 'Program Coordinator',
        countryId: india.id, stateId: maharashtra.id, cityId: mumbai.id, goalAmount: 200000, raisedAmount: 0, currency: 'INR',
        status: 'under_review', verificationLevel: 'none', isFeatured: false, isUrgent: false, riskLevel: 'medium',
        campaignFeatures: defaultFeatures, coverImage: covers[8], donorCount: 0, viewCount: 0, endDate: new Date('2027-03-31'), submittedAt: new Date('2026-08-31'),
      },
    }),
  ]);

  // ===== FUND USAGE ITEMS (for published campaigns) =====
  await prisma.fundUsageItem.createMany({
    data: [
      { campaignId: campaigns[0].id, category: 'Surgery & Hospitalization', amount: 500000, description: 'Heart surgery including hospital stay and ICU charges', sortOrder: 1 },
      { campaignId: campaigns[0].id, category: 'Post-Operative Care', amount: 200000, description: 'Medicines, follow-up visits, and recovery support', sortOrder: 2 },
      { campaignId: campaigns[0].id, category: 'Travel & Accommodation', amount: 100000, description: 'Family travel and stay near the hospital during treatment', sortOrder: 3 },
      { campaignId: campaigns[2].id, category: 'Temporary Housing', amount: 200000, description: 'Three months of rental accommodation for the family', sortOrder: 1 },
      { campaignId: campaigns[2].id, category: 'Essential Items', amount: 250000, description: 'Clothing, school supplies, kitchen essentials, and furniture', sortOrder: 2 },
      { campaignId: campaigns[2].id, category: 'Home Repairs', amount: 150000, description: 'Structural repairs and restoration of the damaged home', sortOrder: 3 },
      { campaignId: campaigns[5].id, category: 'Structural Repairs', amount: 800000, description: 'Roof replacement, window installation, and structural reinforcement', sortOrder: 1 },
      { campaignId: campaigns[5].id, category: 'Interior Restoration', amount: 400000, description: 'Flooring, painting, electrical work, and plumbing', sortOrder: 2 },
      { campaignId: campaigns[5].id, category: 'Furniture & Equipment', amount: 300000, description: 'Desks, chairs, computers, and teaching supplies', sortOrder: 3 },
    ],
  });

  // ===== DONATIONS =====
  const donorNames = ['Anonymous Donor', 'Michael Chen', 'Grace Williams', 'John Smith', 'Emily Davis', 'Robert Wilson', 'Sarah Brown', 'David Lee', 'Jennifer Martinez', 'Chris Anderson'];
  const messages = ['You are in my thoughts.', 'Sending strength and support.', 'Keep going, you are not alone.', 'Wishing you the very best.', 'Stay strong.', 'Hope this helps.', 'Thinking of you and your family.', 'Wishing you a speedy recovery.', 'Well done for organizing this.', 'Proud to support this cause.'];
  const amounts = [500, 1000, 2500, 5000, 10000];

  for (let ci = 0; ci < 7; ci++) {
    const campaign = campaigns[ci];
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

  // ===== CAMPAIGN UPDATES =====
  await prisma.campaignUpdate.createMany({
    data: [
      { campaignId: campaigns[1].id, title: 'Thank You for Your Generosity!', content: 'We have reached 65% of our goal! Anita is so grateful for each one of you. She has been studying hard and got the highest marks in her class this term.', createdAt: new Date('2026-08-15') },
      { campaignId: campaigns[1].id, title: 'Anita Started Her New Term', content: 'Thanks to your support, Anita was able to start her new school term on time. She is now in 9th grade and doing exceptionally well.', createdAt: new Date('2026-07-20') },
      { campaignId: campaigns[0].id, title: 'Surgery Date Confirmed', content: 'We are grateful to share that Rajesh\'s surgery has been scheduled for next month. The doctors are optimistic about the outcome.', createdAt: new Date('2026-08-20') },
      { campaignId: campaigns[5].id, title: 'Cleanup and Assessment Complete', content: 'Our volunteer team has completed the initial cleanup and structural assessment. The good news is that the foundation is intact.', createdAt: new Date('2026-08-10') },
      { campaignId: campaigns[5].id, title: 'Temporary Space Secured', content: 'While the center is being rebuilt, we have secured a temporary space for our programs. The work continues!', createdAt: new Date('2026-08-25') },
      { campaignId: campaigns[2].id, title: 'Family Moved to Temporary Housing', content: 'The Patel family has found a temporary place to stay thanks to a generous community member. The road ahead is still long, but this takes some pressure off.', createdAt: new Date('2026-08-22') },
    ],
  });

  // ===== REPORTS (demo) =====
  await prisma.report.create({
    data: { campaignId: campaigns[6].id, reporterId: users[6].id, reason: 'Incorrect beneficiary information', description: 'The beneficiary name seems different from what was mentioned in an earlier version of this campaign. Please verify.', status: 'new', riskLevel: 'low', createdAt: new Date('2026-09-01') },
  });
  await prisma.report.create({
    data: { campaignId: campaigns[2].id, reporterId: users[7].id, reason: 'Misleading information', description: 'The amount requested seems inflated compared to actual repair costs in the area.', status: 'under_review', riskLevel: 'medium', reviewerId: admin.id, reviewedAt: new Date('2026-09-01'), createdAt: new Date('2026-08-28') },
  });
  await prisma.report.create({
    data: { campaignId: campaigns[4].id, reporterId: users[6].id, reason: 'Suspicious use of funds', description: 'I noticed the campaign goal was recently increased from ₹4L to ₹6L without explanation.', status: 'dismissed', riskLevel: 'low', reviewerId: admin.id, adminNotes: 'Goal increase was explained in the latest campaign update.', reviewedAt: new Date('2026-08-20'), resolvedAt: new Date('2026-08-20'), createdAt: new Date('2026-08-15') },
  });

  // ===== VERIFICATIONS (demo) =====
  await prisma.verification.create({
    data: { userId: users[0].id, level: 'identity', status: 'verified', submittedAt: new Date('2026-06-01'), reviewedAt: new Date('2026-06-03'), reviewerId: admin.id, reviewNotes: 'Government ID verified. Name matches account details.', documents: JSON.stringify(['identity_proof']), expiryDate: new Date('2027-06-03') },
  });
  await prisma.verification.create({
    data: { userId: users[3].id, level: 'identity', status: 'verified', submittedAt: new Date('2026-05-20'), reviewedAt: new Date('2026-05-22'), reviewerId: admin.id, reviewNotes: 'Aadhaar card verified. Address confirmed.', documents: JSON.stringify(['identity_proof', 'address_proof']), expiryDate: new Date('2027-05-22') },
  });
  await prisma.verification.create({
    data: { userId: users[5].id, level: 'organization', status: 'verified', submittedAt: new Date('2026-04-01'), reviewedAt: new Date('2026-04-05'), reviewerId: admin.id, reviewNotes: 'Organization registration verified. 12A and 80G certificates on file. Authorized representative confirmed.', documents: JSON.stringify(['organization_registration', 'identity_proof']), expiryDate: new Date('2027-04-05') },
  });
  await prisma.verification.create({
    data: { userId: users[2].id, level: 'identity', status: 'documents_submitted', submittedAt: new Date('2026-08-28'), documents: JSON.stringify(['identity_proof']) },
  });

  // ===== WITHDRAWAL REQUESTS (demo) =====
  await prisma.withdrawalRequest.create({
    data: { campaignId: campaigns[0].id, requesterId: users[4].id, amount: 200000, status: 'approved', reviewerId: admin.id, reviewedAt: new Date('2026-08-25'), reviewNotes: 'First withdrawal approved. Medical bills verified.', paymentReference: 'PAY-2026-001', paidAt: new Date('2026-08-26'), requestedAt: new Date('2026-08-20') },
  });
  await prisma.withdrawalRequest.create({
    data: { campaignId: campaigns[0].id, requesterId: users[4].id, amount: 150000, status: 'under_review', requestedAt: new Date('2026-09-01') },
  });
  await prisma.withdrawalRequest.create({
    data: { campaignId: campaigns[1].id, requesterId: users[0].id, amount: 20000, status: 'requested', requestedAt: new Date('2026-09-01') },
  });
  await prisma.withdrawalRequest.create({
    data: { campaignId: campaigns[5].id, requesterId: users[5].id, amount: 500000, status: 'documents_required', reviewerId: admin.id, reviewedAt: new Date('2026-08-30'), reviewNotes: 'Please upload contractor invoices and bank statements for the first phase of repairs.', rejectionReason: undefined, requestedAt: new Date('2026-08-25') },
  });

  // ===== RISK EVENTS (demo) =====
  await prisma.riskEvent.create({
    data: { userId: users[2].id, campaignId: campaigns[8].id, eventType: 'multiple_campaigns', severity: 'low', description: 'User has created 2 campaigns in the last 30 days. Standard activity.', createdAt: new Date('2026-09-01') },
  });
  await prisma.riskEvent.create({
    data: { campaignId: campaigns[2].id, eventType: 'multiple_reports', severity: 'medium', description: 'Campaign has received 2 reports in the past 7 days. Monitor for additional reports.', metadata: JSON.stringify({ reportCount: 2, days: 7 }), createdAt: new Date('2026-08-29') },
  });
  await prisma.riskEvent.create({
    data: { userId: users[2].id, eventType: 'verification_failure', severity: 'medium', description: 'User submitted identity verification with an unclear document image. Resubmission requested.', createdAt: new Date('2026-08-27') },
  });

  // ===== NOTIFICATIONS (demo) =====
  await prisma.notification.createMany({
    data: [
      { userId: users[3].id, type: 'campaign_under_review', title: 'Campaign Under Review', message: 'Your campaign "Help Build a Well in Rural Village" is currently under review by our team.', entityType: 'campaign', entityId: campaigns[7].id, isRead: false, createdAt: new Date('2026-09-01') },
      { userId: users[2].id, type: 'campaign_under_review', title: 'Campaign Under Review', message: 'Your campaign "Support After-School Tutoring Program" is currently under review.', entityType: 'campaign', entityId: campaigns[8].id, isRead: false, createdAt: new Date('2026-08-31') },
      { userId: users[4].id, type: 'withdrawal_status_changed', title: 'Withdrawal Under Review', message: 'Your withdrawal request of ₹1,50,000 for "Emergency Medical Treatment" is under review.', entityType: 'withdrawal', entityId: campaigns[0].id, isRead: true, createdAt: new Date('2026-09-01') },
      { userId: users[5].id, type: 'withdrawal_status_changed', title: 'Documents Required for Withdrawal', message: 'Please upload contractor invoices and bank statements for your withdrawal request of ₹5,00,000.', entityType: 'withdrawal', entityId: campaigns[5].id, isRead: false, createdAt: new Date('2026-08-30') },
      { userId: admin.id, type: 'new_campaign_submitted', title: 'New Campaign Submitted', message: 'A new campaign "Help Build a Well in Rural Village" has been submitted for review.', entityType: 'campaign', entityId: campaigns[7].id, isRead: true, createdAt: new Date('2026-09-01') },
      { userId: admin.id, type: 'high_risk_detected', title: 'Risk Event Detected', message: 'Multiple reports received for campaign "Support a Family After a House Fire".', entityType: 'campaign', entityId: campaigns[2].id, isRead: false, createdAt: new Date('2026-08-29') },
      { userId: admin.id, type: 'withdrawal_requested', title: 'New Withdrawal Request', message: 'A withdrawal of ₹1,50,000 has been requested for "Emergency Medical Treatment".', entityType: 'withdrawal', entityId: campaigns[0].id, isRead: true, createdAt: new Date('2026-09-01') },
    ],
  });

  // ===== AUDIT LOGS (demo) =====
  await prisma.auditLog.createMany({
    data: [
      { adminId: admin.id, action: 'campaign_approved', entityType: 'campaign', entityId: campaigns[0].id, newValue: JSON.stringify({ status: 'published' }), createdAt: new Date('2026-07-02') },
      { adminId: admin.id, action: 'campaign_approved', entityType: 'campaign', entityId: campaigns[1].id, newValue: JSON.stringify({ status: 'published' }), createdAt: new Date('2026-06-16') },
      { adminId: admin.id, action: 'verification_approved', entityType: 'verification', entityId: users[0].id, newValue: JSON.stringify({ level: 'identity', status: 'verified' }), createdAt: new Date('2026-06-03') },
      { adminId: admin.id, action: 'withdrawal_approved', entityType: 'withdrawal', entityId: campaigns[0].id, newValue: JSON.stringify({ amount: 200000, status: 'approved' }), createdAt: new Date('2026-08-25') },
      { adminId: admin.id, action: 'report_dismissed', entityType: 'report', entityId: campaigns[4].id, previousValue: JSON.stringify({ status: 'new' }), newValue: JSON.stringify({ status: 'dismissed' }), metadata: JSON.stringify({ reason: 'Goal increase explained in campaign update' }), createdAt: new Date('2026-08-20') },
      { adminId: admin.id, action: 'campaign_approved', entityType: 'campaign', entityId: campaigns[2].id, newValue: JSON.stringify({ status: 'published' }), createdAt: new Date('2026-07-21') },
    ],
  });

  // ===== INFO REQUESTS (demo) =====
  await prisma.infoRequest.create({
    data: { campaignId: campaigns[5].id, requesterId: admin.id, message: 'Please upload contractor invoices and bank statements for the first phase of repairs. We also need a detailed breakdown of the ₹8,00,000 structural repair costs.', requiredDocuments: JSON.stringify(['expense_proof', 'bank_document']), dueDate: new Date('2026-09-10'), status: 'pending', createdAt: new Date('2026-08-30') },
  });

  // ===== PRIVATE DOCUMENTS (demo) =====
  await prisma.privateDocument.createMany({
    data: [
      { entityType: 'verification', entityId: users[0].id, documentType: 'identity_proof', fileName: 'sarah_johnson_aadhaar.jpg', fileSize: 245000, mimeType: 'image/jpeg', storagePath: '/private/docs/verification/sarah_johnson_aadhaar.jpg', uploadedById: users[0].id, accessLevel: 'admin_only', status: 'approved' },
      { entityType: 'verification', entityId: users[3].id, documentType: 'identity_proof', fileName: 'james_okafor_aadhaar.jpg', fileSize: 198000, mimeType: 'image/jpeg', storagePath: '/private/docs/verification/james_okafor_aadhaar.jpg', uploadedById: users[3].id, accessLevel: 'admin_only', status: 'approved' },
      { entityType: 'organization', entityId: users[5].id, documentType: 'organization_registration', fileName: 'hope_foundation_12a_80g.pdf', fileSize: 520000, mimeType: 'application/pdf', storagePath: '/private/docs/org/hope_foundation_12a_80g.pdf', uploadedById: users[5].id, accessLevel: 'admin_only', status: 'approved' },
      { entityType: 'withdrawal', entityId: campaigns[5].id, documentType: 'expense_proof', fileName: 'community_center_invoice_1.pdf', fileSize: 310000, mimeType: 'application/pdf', storagePath: '/private/docs/withdrawal/community_center_invoice_1.pdf', uploadedById: users[5].id, accessLevel: 'admin_only', status: 'pending' },
      { entityType: 'verification', entityId: users[2].id, documentType: 'identity_proof', fileName: 'maria_santos_id.jpg', fileSize: 180000, mimeType: 'image/jpeg', storagePath: '/private/docs/verification/maria_santos_id.jpg', uploadedById: users[2].id, accessLevel: 'admin_only', status: 'pending' },
    ],
  });

  // ===== PLATFORM SETTINGS =====
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
      { key: 'max_campaign_goal_inr', value: '50000000' },
      { key: 'auto_approve_basic_verified', value: 'false' },
      { key: 'campaign_edit_requires_review', value: 'true' },
      { key: 'withdrawal_requires_verification', value: 'true' },
      { key: 'report_rate_limit_minutes', value: '30' },
    ],
  });

  console.log('Seed completed successfully!');
  console.log(`Created ${campaigns.length} campaigns (7 published, 2 under review)`);
  console.log(`Created ${categories.length} categories, ${users.length + 1} users`);
  console.log(`Demo data: 3 reports, 4 verifications, 4 withdrawal requests, 3 risk events, 7 notifications, 6 audit logs, 1 info request, 5 private documents, 9 fund usage items`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
