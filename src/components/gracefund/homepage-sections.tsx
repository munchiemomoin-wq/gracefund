'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { CampaignCard } from './campaign-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCompactCurrency, formatNumber, formatCurrency, getProgressPercent } from '@/lib/currency';
import { motion } from 'framer-motion';
import {
  HeartPulse, GraduationCap, Church, Globe, AlertTriangle, Users, Flower2, Baby,
  ArrowRight, Search, SlidersHorizontal, FileText, Share2, Heart, Lightbulb,
  TrendingUp, MapPin, Sparkles, HandHeart, Shield,
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'church': Church,
  'globe': Globe,
  'alert-triangle': AlertTriangle,
  'users': Users,
  'flower-2': Flower2,
  'baby': Baby,
};

const categoryColors: Record<string, string> = {
  'medical': 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100',
  'education': 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
  'church-ministry': 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
  'missions': 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
  'emergency': 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
  'community': 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100',
  'funeral-memorial': 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
  'children': 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
};

interface Campaign {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  coverImage: string | null;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  donorCount: number;
  isUrgent: boolean;
  verificationLevel: string;
  endDate: string | null;
  category?: { name: string; icon: string; slug: string } | null;
  organizer?: { name: string | null } | null;
  _count?: { donations: number; prayers: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  _count?: { campaigns: number };
}

// Popular Campaigns Section
export function PopularCampaigns({ campaigns }: { campaigns: Campaign[] }) {
  const { setCurrentView } = useAppStore();
  if (!campaigns.length) return null;

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Popular Campaigns</h2>
            <p className="mt-1.5 text-muted-foreground">Support these causes making a real difference</p>
          </div>
          <button
            onClick={() => setCurrentView('explore')}
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.slice(0, 6).map((c, i) => (
            <CampaignCard key={c.id} campaign={c} index={i} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" onClick={() => setCurrentView('explore')}>
            View All Campaigns <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Browse by Cause
export function BrowseByCause({ categories }: { categories: Category[] }) {
  const { setCurrentView, setSelectedCategory } = useAppStore();
  if (!categories.length) return null;

  const handleClick = (slug: string, id: string) => {
    setSelectedCategory(id);
    setCurrentView('explore');
  };

  return (
    <section className="bg-muted/30 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Browse by Cause</h2>
          <p className="mt-1.5 text-muted-foreground">Find campaigns that match your passion to help</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || HeartPulse;
            const colorClass = categoryColors[cat.slug] || 'bg-muted text-muted-foreground border-border hover:bg-muted/80';
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClick(cat.slug, cat.id)}
                className={`flex flex-col items-center gap-3 rounded-2xl border p-5 transition-colors ${colorClass}`}
              >
                <Icon className="h-7 w-7" />
                <div className="text-center">
                  <p className="text-sm font-semibold">{cat.name}</p>
                  {cat._count && <p className="mt-0.5 text-xs opacity-70">{cat._count.campaigns} campaigns</p>}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Urgent Campaigns
export function UrgentCampaigns({ campaigns }: { campaigns: Campaign[] }) {
  const urgentCampaigns = campaigns.filter((c) => c.isUrgent);
  if (!urgentCampaigns.length) return null;

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Urgent Campaigns</h2>
            <p className="text-sm text-muted-foreground">These campaigns need immediate support</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {urgentCampaigns.map((c, i) => (
            <CampaignCard key={c.id} campaign={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Verified Campaigns
export function VerifiedCampaigns({ campaigns }: { campaigns: Campaign[] }) {
  const verifiedCampaigns = campaigns.filter((c) => c.verificationLevel !== 'none');
  if (!verifiedCampaigns.length) return null;

  return (
    <section className="bg-emerald-50/50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Shield className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Verified Campaigns</h2>
            <p className="text-sm text-muted-foreground">Trustworthy fundraisers with confirmed identity</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {verifiedCampaigns.slice(0, 3).map((c, i) => (
            <CampaignCard key={c.id} campaign={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works
export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: 'Start a Campaign',
      description: 'Tell your story and explain how the funds will help. It only takes a few minutes to get started.',
    },
    {
      icon: Share2,
      title: 'Share With Your Community',
      description: 'Share your campaign with friends, family, churches, and supporters through social media and messaging.',
    },
    {
      icon: Heart,
      title: 'Receive Support',
      description: 'Receive donations from people who care. Every contribution, big or small, makes a meaningful difference.',
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">How It Works</h2>
          <p className="mt-1.5 text-muted-foreground">Three simple steps to start making a difference</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Step number */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="h-7 w-7" />
              </div>
              <span className="text-xs font-bold text-[var(--gold)]">STEP {i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              {/* Connector line (not on last) */}
              {i < steps.length - 1 && (
                <div className="absolute top-7 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] bg-border md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Animated Counter
function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    const el = document.getElementById(`stat-${prefix}${suffix}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target, prefix, suffix, hasAnimated]);

  return (
    <span id={`stat-${prefix}${suffix}`} className="text-3xl font-bold sm:text-4xl">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

// Impact Statistics
export function ImpactStats() {
  const [stats, setStats] = useState({ totalRaised: 0, peopleHelped: 0, activeCampaigns: 0, countriesReached: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {
        // Fallback demo data
        setStats({ totalRaised: 2685200, peopleHelped: 1368, activeCampaigns: 7, countriesReached: 8 });
      });
  }, []);

  const statItems = [
    { value: stats.totalRaised, prefix: '₹', label: 'Total Raised', icon: TrendingUp },
    { value: stats.peopleHelped, label: 'People Helped', icon: Users },
    { value: stats.activeCampaigns, label: 'Active Campaigns', icon: Lightbulb },
    { value: stats.countriesReached, label: 'Countries Reached', icon: MapPin },
  ];

  return (
    <section className="gradient-navy py-14 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Our Collective Impact</h2>
          <p className="mt-1.5 text-white/70">Together, we are changing lives around the world</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {statItems.map((item) => (
            <div key={item.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <item.icon className="h-6 w-6 text-[var(--gold)]" />
              </div>
              <AnimatedCounter target={item.value} prefix={item.prefix} />
              <p className="mt-1 text-sm text-white/70">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Faith & Giving
export function FaithAndGiving() {
  const { setShowAuthModal } = useAppStore();

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gold)]/10">
            <HandHeart className="h-6 w-6 text-[var(--gold)]" />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">Where Faith Meets Generosity</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            GraceFund is more than a platform. It is a community of believers coming together to support one another in times of need. Whether it is a medical emergency, a child&apos;s education, or rebuilding a church, every act of generosity reflects the love and compassion we are called to share.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We believe that when people unite with purpose and faith, extraordinary things happen. Your support does not just provide financial assistance. It brings hope, encouragement, and the knowledge that someone cares.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="rounded-full px-8"
              onClick={() => setShowAuthModal(true, 'register')}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Start Making a Difference
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
