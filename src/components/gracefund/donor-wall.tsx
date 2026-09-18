'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Award, Crown, Medal, Star, Users, Heart,
  ToggleLeft, ToggleRight, Sparkles, Trophy,
} from 'lucide-react';
import { formatCompactCurrency, formatCurrency } from '@/lib/currency';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' as const },
  }),
};

interface Donor {
  name: string;
  amount: number;
  campaign: string;
  date: string;
  badge: 'platinum' | 'gold' | 'silver' | 'bronze';
  isAnonymous: boolean;
}

const badgeConfig = {
  platinum: { label: 'Platinum', icon: Crown, color: 'bg-violet-50 text-violet-700 border-violet-200', threshold: 100000 },
  gold: { label: 'Gold', icon: Award, color: 'bg-amber-50 text-amber-700 border-amber-200', threshold: 25000 },
  silver: { label: 'Silver', icon: Medal, color: 'bg-slate-100 text-slate-600 border-slate-300', threshold: 5000 },
  bronze: { label: 'Bronze', icon: Star, color: 'bg-orange-50 text-orange-700 border-orange-200', threshold: 500 },
};

const donors: Donor[] = [
  { name: 'Rajesh Kumar', amount: 150000, campaign: 'Little Aarav\'s Heart Surgery', date: '2024-12-15', badge: 'platinum', isAnonymous: false },
  { name: 'Priya Sharma', amount: 75000, campaign: 'Kerala Flood Relief 2024', date: '2024-12-10', badge: 'platinum', isAnonymous: false },
  { name: 'Anonymous', amount: 50000, campaign: 'First-Generation College Fund', date: '2024-11-28', badge: 'platinum', isAnonymous: true },
  { name: 'Anil Mehta', amount: 30000, campaign: 'Village Clean Water Project', date: '2024-11-20', badge: 'gold', isAnonymous: false },
  { name: 'Sunita Reddy', amount: 25000, campaign: 'Orphanage Renovation', date: '2024-11-15', badge: 'gold', isAnonymous: false },
  { name: 'Vikram Patel', amount: 25000, campaign: 'Senior Citizens Medical Camp', date: '2024-11-10', badge: 'gold', isAnonymous: false },
  { name: 'Meera Joshi', amount: 10000, campaign: 'Little Aarav\'s Heart Surgery', date: '2024-11-05', badge: 'silver', isAnonymous: false },
  { name: 'Anonymous', amount: 8000, campaign: 'First-Generation College Fund', date: '2024-10-30', badge: 'silver', isAnonymous: true },
  { name: 'Ramesh Gupta', amount: 7000, campaign: 'Kerala Flood Relief 2024', date: '2024-10-25', badge: 'silver', isAnonymous: false },
  { name: 'Nisha Agarwal', amount: 5000, campaign: 'Village Clean Water Project', date: '2024-10-20', badge: 'silver', isAnonymous: false },
  { name: 'Kavitha M.', amount: 3000, campaign: 'Orphanage Renovation', date: '2024-10-15', badge: 'bronze', isAnonymous: false },
  { name: 'Arjun Das', amount: 2000, campaign: 'Senior Citizens Medical Camp', date: '2024-10-10', badge: 'bronze', isAnonymous: false },
  { name: 'Lakshmi Nair', amount: 1000, campaign: 'Little Aarav\'s Heart Surgery', date: '2024-10-05', badge: 'bronze', isAnonymous: false },
  { name: 'Anonymous', amount: 5000, campaign: 'Kerala Flood Relief 2024', date: '2024-09-28', badge: 'silver', isAnonymous: true },
  { name: 'Deepak Singh', amount: 1500, campaign: 'First-Generation College Fund', date: '2024-09-20', badge: 'bronze', isAnonymous: false },
  { name: 'Pooja Verma', amount: 750, campaign: 'Village Clean Water Project', date: '2024-09-15', badge: 'bronze', isAnonymous: false },
];

const topDonors = donors
  .filter((d) => !d.isAnonymous)
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 5);

function BadgeLabel({ badge }: { badge: Donor['badge'] }) {
  const config = badgeConfig[badge];
  const Icon = config.icon;
  return (
    <Badge variant="secondary" className={`${config.color} text-xs`}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export function DonorWallPage() {
  const { setCurrentView } = useAppStore();
  const [showOnWall, setShowOnWall] = useState(true);

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
            <Crown className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1 variants={fadeInUp} custom={1} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Donor Wall
          </motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Celebrating the generosity of our community. Every contribution matters.
          </motion.p>
        </motion.div>

        {/* Badge Legend */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8 flex flex-wrap justify-center gap-3">
          {Object.entries(badgeConfig).map(([key, config], i) => {
            const Icon = config.icon;
            return (
              <motion.div key={key} variants={fadeInUp} custom={i} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${config.color}`}>
                <Icon className="h-4 w-4" />
                {config.label} ({formatCompactCurrency(config.threshold)}+)
              </motion.div>
            );
          })}
        </motion.div>

        {/* Toggle */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="text-sm text-slate-600">Show on Donor Wall</span>
          <button
            onClick={() => setShowOnWall(!showOnWall)}
            className="text-primary"
          >
            {showOnWall ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Top Donors Leaderboard */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200/60 sticky top-20">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-[var(--gold)]" />
                  <h3 className="text-lg font-bold text-slate-900">Top Donors</h3>
                </div>
                <div className="space-y-3">
                  {topDonors.map((donor, i) => (
                    <div key={donor.name + donor.amount} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{donor.name}</p>
                        <p className="text-xs text-slate-400">{donor.campaign}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{formatCompactCurrency(donor.amount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donor Wall Masonry */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {donors.map((donor, i) => (
                <motion.div
                  key={donor.name + donor.amount + donor.date}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.06 }}
                >
                  <Card className="border-slate-200/60 transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {donor.isAnonymous ? '?' : donor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {donor.isAnonymous ? 'Anonymous Donor' : donor.name}
                            </p>
                            <p className="text-xs text-slate-400">{donor.campaign}</p>
                          </div>
                        </div>
                        <BadgeLabel badge={donor.badge} />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{formatCurrency(donor.amount)}</span>
                        <span className="text-xs text-slate-400">{new Date(donor.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
