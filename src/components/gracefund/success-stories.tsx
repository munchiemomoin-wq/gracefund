'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, HeartPulse, GraduationCap, AlertTriangle, Users,
  Home, Quote, ChevronDown, ChevronUp, Sparkles, Flower2,
} from 'lucide-react';
import { formatCompactCurrency } from '@/lib/currency';

interface SuccessStory {
  id: number;
  category: string;
  categoryIcon: React.ElementType;
  categoryColor: string;
  title: string;
  beforeContext: string;
  afterContext: string;
  amountRaised: number;
  donorCount: number;
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  fullStory: string;
}

const stories: SuccessStory[] = [
  {
    id: 1,
    category: 'Medical',
    categoryIcon: HeartPulse,
    categoryColor: 'bg-rose-50 text-rose-600 border-rose-200',
    title: 'Little Aarav\'s Heart Surgery',
    beforeContext: 'Aarav, a 3-year-old from Pune, needed an urgent heart surgery his family could not afford.',
    afterContext: 'With the help of 1,247 donors, Aarav successfully underwent surgery and is now thriving.',
    amountRaised: 850000,
    donorCount: 1247,
    quote: 'We had lost all hope until JodoFund. The generosity of strangers saved our son\'s life.',
    quoteAuthor: 'Priya Sharma',
    quoteRole: 'Aarav\'s Mother',
    fullStory: 'Aarav was diagnosed with a congenital heart defect at birth. His parents, both school teachers, could not afford the ₹8.5L surgery. Within 3 weeks of launching their campaign, over 1,200 donors from across India contributed. Aarav had his surgery at AIIMS Delhi and made a full recovery. His family now volunteers to help other families navigate medical fundraising.',
  },
  {
    id: 2,
    category: 'Education',
    categoryIcon: GraduationCap,
    categoryColor: 'bg-blue-50 text-blue-600 border-blue-200',
    title: 'First-Generation College Fund',
    beforeContext: '50 students from rural Tamil Nadu were at risk of dropping out due to inability to pay college fees.',
    afterContext: 'All 50 students completed their degrees. 38 have secured employment, and 5 are pursuing higher studies.',
    amountRaised: 1200000,
    donorCount: 892,
    quote: 'Education changed our lives. Thanks to the donors, we are the first in our families to graduate.',
    quoteAuthor: 'Kavitha M.',
    quoteRole: 'Scholarship Recipient',
    fullStory: 'The Vidiyal Trust identified 50 deserving students from underserved communities in rural Tamil Nadu who had secured college admissions but could not afford fees. Through JodoFund, they raised ₹12L in 6 weeks. Every student completed their degree, with 38 finding employment within 3 months. The ripple effect continues — 12 of them now mentor younger students in their villages.',
  },
  {
    id: 3,
    category: 'Emergency',
    categoryIcon: AlertTriangle,
    categoryColor: 'bg-red-50 text-red-600 border-red-200',
    title: 'Kerala Flood Relief 2024',
    beforeContext: 'Heavy flooding in Wayanad displaced over 500 families, destroying homes and livelihoods.',
    afterContext: 'Relief materials, temporary shelter, and rebuilding support were provided to all affected families.',
    amountRaised: 2500000,
    donorCount: 3421,
    quote: 'When disaster struck, the whole country came together. We are grateful beyond words.',
    quoteAuthor: 'Rahul Krishnan',
    quoteRole: 'Relief Coordinator',
    fullStory: 'The 2024 Kerala floods devastated Wayanad district, leaving over 500 families homeless. A coalition of local NGOs launched a JodoFund campaign that raised ₹25L in just 10 days. Funds provided immediate relief (food, medicine, temporary shelter) and long-term rebuilding support (home repair kits, livelihood restoration). Every family received assistance within 30 days.',
  },
  {
    id: 4,
    category: 'Community',
    categoryIcon: Users,
    categoryColor: 'bg-amber-50 text-amber-600 border-amber-200',
    title: 'Village Clean Water Project',
    beforeContext: 'Residents of Rampur village, Odisha, had been walking 3 km daily for clean drinking water for decades.',
    afterContext: 'A community water filtration unit now serves 2,000+ residents with safe drinking water 24/7.',
    amountRaised: 450000,
    donorCount: 678,
    quote: 'For the first time in our village\'s history, clean water flows right at our doorstep.',
    quoteAuthor: 'Sarpanch D. Mohapatra',
    quoteRole: 'Village Head',
    fullStory: 'Rampur village in Odisha had no clean water source for over 40 years. Residents — mostly women and children — walked 3 km daily. The village sarpanch launched a JodoFund campaign for a community water filtration unit. Within 5 weeks, they raised ₹4.5L. The unit now serves 2,000+ people and is maintained by a village water committee trained by NGO partners.',
  },
  {
    id: 5,
    category: 'Children',
    categoryIcon: Flower2,
    categoryColor: 'bg-pink-50 text-pink-600 border-pink-200',
    title: 'Orphanage Renovation',
    beforeContext: 'Ashraya Children\'s Home in Bengaluru was operating out of a dilapidated building with 35 children.',
    afterContext: 'The home was fully renovated with proper sanitation, a study room, kitchen, and safe play area.',
    amountRaised: 675000,
    donorCount: 534,
    quote: 'Our children now have a safe, warm place to call home. Thank you for believing in them.',
    quoteAuthor: 'Sister Mary Thomas',
    quoteRole: 'Director, Ashraya Home',
    fullStory: 'Ashraya Children\'s Home housed 35 children in a building with leaking roofs, broken plumbing, and no proper study area. The renovation campaign raised ₹6.75L from 534 donors. The funds covered roof repair, new plumbing, a dedicated study room with computers, a modern kitchen, and a safe outdoor play area. Monthly donors now support ongoing maintenance.',
  },
  {
    id: 6,
    category: 'Elderly Care',
    categoryIcon: Home,
    categoryColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    title: 'Senior Citizens Medical Camp',
    beforeContext: 'Elderly residents in 5 slum communities of Hyderabad had no access to regular health check-ups or medicines.',
    afterContext: '1,200+ seniors received free health screenings, medicines, and ongoing care through monthly camps.',
    amountRaised: 380000,
    donorCount: 412,
    quote: 'No one should suffer because they cannot afford basic healthcare in their old age.',
    quoteAuthor: 'Dr. Lakshmi Narayan',
    quoteRole: 'Camp Organiser',
    fullStory: 'The Senior Care Foundation identified 5 slum communities in Hyderabad where elderly residents had zero access to healthcare. Their JodoFund campaign raised ₹3.8L, funding 6 monthly medical camps. Over 1,200 seniors received free screenings (diabetes, hypertension, vision), free medicines, and referrals for advanced care. The programme now continues with monthly donor support.',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

function StoryCard({ story, isExpanded, onToggle }: { story: SuccessStory; isExpanded: boolean; onToggle: () => void }) {
  return (
    <Card className="h-full border-slate-200/60 transition-shadow hover:shadow-md">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className={story.categoryColor}>
            {story.category}
          </Badge>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{story.title}</h3>
        <p className="mt-2 text-sm text-slate-500">{story.beforeContext}</p>

        <div className="mt-3 flex items-center gap-4 text-sm">
          <span className="font-semibold text-emerald-600">{formatCompactCurrency(story.amountRaised)} raised</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">{story.donorCount.toLocaleString('en-IN')} donors</span>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <Quote className="mb-1 h-4 w-4 text-slate-300" />
          <p className="text-sm italic text-slate-600">&ldquo;{story.quote}&rdquo;</p>
          <p className="mt-2 text-xs font-medium text-slate-500">— {story.quoteAuthor}, {story.quoteRole}</p>
        </div>

        <button
          onClick={onToggle}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-xs font-semibold text-emerald-700 mb-1">After</p>
              <p className="text-sm text-slate-600">{story.afterContext}</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{story.fullStory}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export function SuccessStoriesSection() {
  const { setCurrentView } = useAppStore();

  return (
    <section className="py-14 sm:py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gold)]/10">
            <Sparkles className="h-6 w-6 text-[var(--gold)]" />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">Success Stories</h2>
          <p className="mt-2 text-muted-foreground">Real campaigns, real impact — see how JodoFund is changing lives</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stories.slice(0, 3).map((story, i) => (
            <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <StoryCard story={story} isExpanded={false} onToggle={() => {}} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setCurrentView('success-stories')}>
            View All Stories
          </Button>
        </div>
      </div>
    </section>
  );
}

export function SuccessStoriesPage() {
  const { setCurrentView } = useAppStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setCurrentView('home')}
          className="group mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </motion.button>

        <motion.div initial="hidden" animate="visible" className="mb-12 text-center">
          <motion.div variants={fadeInUp} custom={0} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gold)] to-amber-600 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1 variants={fadeInUp} custom={1} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Success Stories
          </motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Every campaign tells a story of hope, community, and impact. Here are some that changed lives forever.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-20">
          {stories.map((story, i) => (
            <motion.div key={story.id} variants={fadeInUp} custom={i}>
              <StoryCard
                story={story}
                isExpanded={expandedId === story.id}
                onToggle={() => setExpandedId(expandedId === story.id ? null : story.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
