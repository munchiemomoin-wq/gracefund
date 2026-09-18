'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Users, UserPlus, Link, BarChart3, Share2,
  Target, Heart, Trophy, MessageSquare, ArrowRight,
  Sparkles, Building2, GraduationCap, Globe,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const howItWorks = [
  {
    icon: Users,
    title: 'Create Your Team',
    description: 'Start a team fundraiser and invite friends, colleagues, or community members to join your cause.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: UserPlus,
    title: 'Invite Members',
    description: 'Share an invite link. Members join with one click — no approval process needed.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Link,
    title: 'Each Member Gets Their Own Link',
    description: 'Every team member receives a unique sharing link. Track individual contributions and reach.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Combined Dashboard',
    description: 'See the full picture: team total, individual contributions, donor analytics, and milestone tracking.',
    color: 'bg-amber-50 text-amber-600',
  },
];

const benefits = [
  {
    icon: Share2,
    title: 'Reach More Donors',
    description: 'Each team member brings their own network. 5 members = 5x the reach.',
  },
  {
    icon: Users,
    title: 'Shared Responsibility',
    description: 'Fundraising is a team effort. Share the workload of updates, outreach, and donor engagement.',
  },
  {
    icon: Trophy,
    title: 'Friendly Competition',
    description: 'Leaderboards show each member\'s contribution. A little healthy competition boosts results by 20%.',
  },
  {
    icon: MessageSquare,
    title: 'Team Updates',
    description: 'Coordinate efforts with a shared team chat. Plan outreach, share what works, and celebrate milestones together.',
  },
];

const scenarios = [
  {
    icon: Building2,
    title: 'Office Fundraiser',
    description: 'Colleagues rally together for a coworker in need. Each department competes to raise the most. Perfect for medical emergencies, family support, or community causes.',
    members: '5-20 members',
    color: 'bg-slate-100 text-slate-600',
  },
  {
    icon: GraduationCap,
    title: 'School Event',
    description: 'Students, teachers, and parents form teams to fundraise for school infrastructure, scholarships, or educational trips. Classes compete for the top spot.',
    members: '10-50 members',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Globe,
    title: 'Community Project',
    description: 'Local residents team up to fund neighbourhood improvements — parks, clean water, solar lighting, or community centres. Each street or block forms a sub-team.',
    members: '20-100 members',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

export function TeamFundraisingPage() {
  const { setCurrentView, setShowAuthModal } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10">
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setCurrentView('home')}
          className="group mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </motion.button>

        {/* Hero */}
        <motion.div initial="hidden" animate="visible" className="mb-16 text-center">
          <motion.div variants={fadeInUp} custom={0} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-600 shadow-lg shadow-primary/20">
            <Users className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h1 variants={fadeInUp} custom={1} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Team Fundraising
          </motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Multiply your impact by fundraising together. Create a team, invite members, and watch your collective effort achieve more.
          </motion.p>
        </motion.div>

        {/* How It Works */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How Team Fundraising Works</h2>
            <p className="mt-2 text-slate-500">Four simple steps to amplify your impact</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2">
            {howItWorks.map((step, i) => (
              <motion.div key={step.title} variants={fadeInUp} custom={i + 1}>
                <Card className="h-full border-slate-200/60 transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${step.color}`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">Step {i + 1}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Why Fundraise as a Team?</h2>
            <p className="mt-2 text-slate-500">Together, you achieve more than alone</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit, i) => (
              <motion.div key={benefit.title} variants={fadeInUp} custom={i + 1}>
                <Card className="h-full border-slate-200/60 transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{benefit.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scenarios */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Perfect For</h2>
            <p className="mt-2 text-slate-500">Common team fundraising scenarios</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-3">
            {scenarios.map((scenario, i) => (
              <motion.div key={scenario.title} variants={fadeInUp} custom={i + 1}>
                <Card className="h-full border-slate-200/60 transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${scenario.color}`}>
                      <scenario.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{scenario.title}</h3>
                    <Badge variant="secondary" className="mt-2 bg-slate-100 text-slate-600">{scenario.members}</Badge>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">{scenario.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20 text-center">
          <motion.div variants={fadeInUp} custom={0}>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-10">
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Ready to Start a Team Fundraiser?</h2>
                <p className="mx-auto mt-3 max-w-lg text-base text-slate-500">
                  Gather your team, set a shared goal, and make a bigger impact together.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button size="lg" className="rounded-full px-8" onClick={() => setShowAuthModal(true, 'register')}>
                    Start Team Fundraiser
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-8" onClick={() => setCurrentView('explore')}>
                    Explore Campaigns
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
