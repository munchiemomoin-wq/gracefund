'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Lightbulb, PenLine, Share2, Users, BarChart3,
  BookOpen, Megaphone, Heart, Camera, MessageSquare, Calendar,
  Trophy, Star, ArrowRight, Sparkles,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' as const },
  }),
};

interface Tip {
  icon: React.ElementType;
  title: string;
  description: string;
  category: string;
}

const categories = [
  { id: 'getting-started', label: 'Getting Started', icon: Lightbulb, color: 'bg-primary/10 text-primary' },
  { id: 'storytelling', label: 'Storytelling', icon: PenLine, color: 'bg-rose-50 text-rose-600' },
  { id: 'sharing', label: 'Sharing & Social Media', icon: Share2, color: 'bg-blue-50 text-blue-600' },
  { id: 'engaging', label: 'Engaging Donors', icon: Users, color: 'bg-amber-50 text-amber-600' },
  { id: 'post-campaign', label: 'Post-Campaign', icon: BarChart3, color: 'bg-emerald-50 text-emerald-600' },
];

const tips: Tip[] = [
  // Getting Started
  { icon: BookOpen, title: 'Choose the Right Category', description: 'Select the category that best fits your cause. This helps donors find your campaign and improves search visibility.', category: 'getting-started' },
  { icon: Calendar, title: 'Set a Realistic Goal', description: 'Research actual costs before setting your goal. Transparent, well-researched goals build trust and are more likely to be funded.', category: 'getting-started' },
  { icon: Star, title: 'Complete Your Profile', description: 'Add a clear photo and bio to your organiser profile. Donors are 2x more likely to give when they can see who is behind the campaign.', category: 'getting-started' },
  // Storytelling
  { icon: PenLine, title: 'Start With the "Why"', description: 'Begin your story with why this cause matters to you personally. Authenticity creates an emotional connection that drives donations.', category: 'storytelling' },
  { icon: Camera, title: 'Use Real Photos & Videos', description: 'Include clear, recent photos or videos. Campaigns with photos raise 2x more than those without. Show the real situation.', category: 'storytelling' },
  { icon: Heart, title: 'Be Specific About the Need', description: 'Instead of "We need help," say "We need ₹5,00,000 for Priya\'s heart surgery at AIIMS on March 15th." Specifics make the need tangible.', category: 'storytelling' },
  { icon: MessageSquare, title: 'Show the Impact of Each Rupee', description: 'Help donors understand what their money achieves. "₹500 covers one day of hospital care" is more powerful than a vague appeal.', category: 'storytelling' },
  // Sharing
  { icon: Megaphone, title: 'Start With Your Inner Circle', description: 'Ask close friends and family to donate first. Campaigns that hit 30% in the first week are 3x more likely to reach their goal.', category: 'sharing' },
  { icon: Share2, title: 'Share on WhatsApp Personally', description: 'Personal WhatsApp messages get 3x more donations than public posts. Take time to write a personal note with each share.', category: 'sharing' },
  { icon: Sparkles, title: 'Post Regular Updates', description: 'Share campaign updates every 2-3 days. Each update can boost donations by 15-20%. Updates also keep your campaign visible in feeds.', category: 'sharing' },
  // Engaging Donors
  { icon: Heart, title: 'Thank Every Donor', description: 'Send a personal thank you to every donor within 24 hours. Gratitude builds relationships and encourages sharing and repeat donations.', category: 'engaging' },
  { icon: Users, title: 'Create a Community', description: 'Use the campaign updates feature to build a community around your cause. Share milestones, stories, and progress regularly.', category: 'engaging' },
  { icon: Trophy, title: 'Promote Matching Donations', description: 'If a donor offers to match contributions, promote it widely. Matching campaigns can double your intake and create urgency.', category: 'engaging' },
  // Post-Campaign
  { icon: BarChart3, title: 'Share Final Impact Report', description: 'After your campaign, share a detailed report on how funds were used. Transparency encourages donors to support your future campaigns.', category: 'post-campaign' },
  { icon: BookOpen, title: 'Maintain Donor Relationships', description: 'Keep donors updated even after the campaign. Monthly updates turn one-time donors into long-term supporters.', category: 'post-campaign' },
];

const featuredTip = {
  icon: Lightbulb,
  title: 'The First 48 Hours Are Everything',
  description: 'Research shows that campaigns which reach 30% of their goal within the first 48 hours are 3x more likely to succeed. Before you launch, line up your first 5-10 donors from close friends and family. Their early support creates momentum and social proof that encourages others to give. Share your campaign personally with each of them before going public.',
};

export function FundraisingTipsPage() {
  const { setCurrentView } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const filteredTips = tips.filter((t) => t.category === activeCategory);

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

        <motion.div initial="hidden" animate="visible" className="mb-12 text-center">
          <motion.div variants={fadeInUp} custom={0} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
            <Lightbulb className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1 variants={fadeInUp} custom={1} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Fundraising Tips Hub
          </motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Expert advice to make your fundraiser a success. Learn from what works.
          </motion.p>
        </motion.div>

        {/* Featured Tip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <Card className="border-amber-200/60 bg-amber-50/30 overflow-hidden">
            <CardContent className="p-5 sm:p-6">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Star className="mr-1 h-3 w-3" /> Featured Tip
              </Badge>
              <h3 className="text-xl font-bold text-slate-900">{featuredTip.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{featuredTip.description}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? `${cat.color} border border-transparent`
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tips Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 sm:grid-cols-2 mb-20"
        >
          {filteredTips.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full border-slate-200/60 transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <tip.icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{tip.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
