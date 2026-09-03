export const CONTRIBUTION_PURPOSES = [
  {
    id: 'food_support',
    label: 'Feed Someone in Need',
    emoji: '\uD83C\uDF72',
    description: 'Support eligible food assistance programs, meal distribution and essential food support.',
  },
  {
    id: 'shelter_housing',
    label: 'Shelter & Housing',
    emoji: '\uD83C\uDFE0',
    description: 'Support eligible temporary accommodation, housing assistance and essential household needs.',
  },
  {
    id: 'elderly_support',
    label: 'Support the Elderly',
    emoji: '\uD83D\uDC75',
    description: 'Support eligible elderly individuals and programs with food, essential living needs and basic assistance.',
  },
  {
    id: 'funeral_support',
    label: 'Funeral & Memorial Support',
    emoji: '\uD83D\uDD4C',
    description: 'Help eligible families facing funeral and memorial-related financial hardship.',
  },
  {
    id: 'medical_support',
    label: 'Emergency Medical Support',
    emoji: '\uD83C\uDFE5',
    description: 'Support eligible urgent medical needs following verification and GraceFund eligibility policies.',
  },
  {
    id: 'education_support',
    label: 'Education Support',
    emoji: '\uD83C\uDF93',
    description: 'Support eligible students with educational expenses, school supplies and essential learning needs.',
  },
  {
    id: 'children_family_support',
    label: 'Children & Families',
    emoji: '\uD83D\uDC76',
    description: 'Support eligible children and families experiencing financial hardship.',
  },
  {
    id: 'disaster_relief',
    label: 'Emergency & Disaster Relief',
    emoji: '\uD83D\uDEA8',
    description: 'Support eligible emergency response, food, supplies and recovery following disasters.',
  },
  {
    id: 'animal_welfare',
    label: 'Animal Welfare',
    emoji: '\uD83D\uDC3E',
    description: 'Support eligible animal rescue, food, shelter and veterinary care initiatives.',
  },
  {
    id: 'community_projects',
    label: 'Community Projects',
    emoji: '\uD83C\uDF0D',
    description: 'Support eligible projects that provide measurable community benefit.',
  },
  {
    id: 'where_most_needed',
    label: 'Where Most Needed',
    emoji: '\uD83D\uDC99',
    description: 'Allow GraceFund to allocate the contribution among eligible causes according to urgency, verified need, available funds and current community priorities.',
    isFlexible: true,
  },
  {
    id: 'operations',
    label: 'Support GraceFund Operations',
    emoji: '\u2699\uFE0F',
    description: 'Your contribution helps GraceFund operate the platform, including technology, verification, fraud prevention, payment processing, administration and other essential operating expenses.',
    isOperations: true,
  },
] as const;

export const PURPOSE_LABELS: Record<string, string> = Object.fromEntries(
  CONTRIBUTION_PURPOSES.map((p) => [p.id, p.label])
);

export const ALLOCATION_STATUSES = [
  { id: 'planned', label: 'Planned' },
  { id: 'approved', label: 'Approved' },
  { id: 'allocated', label: 'Allocated' },
  { id: 'disbursed', label: 'Disbursed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
] as const;

export const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500];
