'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import {
  ArrowLeft, FileText, ShieldCheck, Share2, Banknote,
  Users, HeartPulse, GraduationCap, AlertTriangle, HandHeart,
  CheckCircle, Sparkles,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const steps = [
  {
    icon: FileText,
    title: 'Start Your Campaign',
    description: 'Create your fundraiser in minutes. Tell your story, set your goal, and add photos or documents to build trust with donors.',
    color: 'from-primary to-teal-500',
    details: ['Choose from 10+ categories', 'Add compelling photos and videos', 'Set a realistic fundraising goal', 'Write an authentic story'],
  },
  {
    icon: ShieldCheck,
    title: 'Get Verified',
    description: 'Complete our verification process to earn the trusted badge. Verified campaigns receive up to 30% more donations.',
    color: 'from-emerald-500 to-green-500',
    details: ['Submit government-issued ID', 'Upload supporting documents', 'Link and verify bank account', 'Receive verification within 24-48 hours'],
  },
  {
    icon: Share2,
    title: 'Share & Engage',
    description: 'Spread the word through WhatsApp, social media, and email. Regular updates keep your community engaged and donating.',
    color: 'from-amber-500 to-orange-500',
    details: ['Share via WhatsApp and social media', 'Post updates every 2-3 days', 'Thank donors publicly', 'Use the 80G tax benefit to attract donors'],
  },
  {
    icon: Banknote,
    title: 'Withdraw Funds',
    description: 'Once verified, withdraw funds directly to your bank account. No hidden fees — 0% platform fee on all donations.',
    color: 'from-violet-500 to-purple-500',
    details: ['Withdraw directly to your bank', '0% platform fee on donations', 'Funds transferred within 1-3 working days', 'Full transparency on all transactions'],
  },
];

const stats = [
  { value: '10K+', label: 'Campaigns', icon: HandHeart },
  { value: '5L+', label: 'Donors', icon: Users },
  { value: '0%', label: 'Platform Fee', icon: Sparkles },
  { value: '24/7', label: 'Support', icon: HeartPulse },
];

const faqs = [
  { q: 'How long does it take to create a campaign?', a: 'It takes just 5-10 minutes to set up a campaign. You will need a title, story, goal amount, and at least one photo. You can always edit and improve your campaign later.' },
  { q: 'Is there any fee to use JodoFund?', a: 'JodoFund charges 0% platform fee. Payment gateway charges (typically 2-3%) apply, and donors optionally contribute a tip to support the platform.' },
  { q: 'How do I withdraw the funds raised?', a: 'Once your identity and bank account are verified, you can withdraw funds at any time. Transfers typically reach your bank within 1-3 working days.' },
  { q: 'What documents are needed for verification?', a: 'You need a government-issued ID (Aadhaar, PAN, Passport) and supporting documents related to your campaign (medical bills, admission letters, etc.).' },
  { q: 'Can I update my campaign after publishing?', a: 'Yes! You can update your story, add new photos, post progress updates, and even change your goal amount at any time from your dashboard.' },
  { q: 'How do donors discover my campaign?', a: 'Campaigns appear in our Explore section. You can also share directly via WhatsApp, social media, and email. Verified campaigns get priority placement.' },
  { q: 'What happens if I do not reach my goal?', a: 'You keep whatever you raise — there is no all-or-nothing requirement. Every donation is immediately available to you (after verification).' },
  { q: 'Are donations eligible for tax deduction?', a: 'Yes! Donations to campaigns by verified 80G-registered organizations are eligible for tax deduction under Section 80G of the Income Tax Act. Donors receive an auto-generated tax receipt.' },
];

export function HowItWorksPage() {
  const { setCurrentView } = useAppStore();

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

        <motion.div initial="hidden" animate="visible" className="mb-16 text-center">
          <motion.h1 variants={fadeInUp} custom={0} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            How JodoFund Works
          </motion.h1>
          <motion.p variants={fadeInUp} custom={1} className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Four simple steps from creating your campaign to receiving funds. No hidden fees, no complications.
          </motion.p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div key={stat.label} variants={fadeInUp} custom={i}>
              <Card className="border-slate-200/60 text-center transition-shadow hover:shadow-md">
                <CardContent className="py-5">
                  <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{stat.value}</p>
                  <p className="text-xs text-slate-500 sm:text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Steps */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 space-y-8">
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={fadeInUp} custom={i}>
              <Card className="border-slate-200/60 overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className={`flex w-full items-center justify-center bg-gradient-to-br ${step.color} p-8 md:w-48 md:min-h-[200px]`}>
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                          <step.icon className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-white/30">{i + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <Badge variant="secondary" className="mb-3 bg-slate-100 text-slate-600">Step {i + 1}</Badge>
                      <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
                      <ul className="mt-4 space-y-2">
                        {step.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* FAQ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Frequently Asked Questions</h2>
            <p className="mt-2 text-slate-500">Everything you need to know about using JodoFund</p>
          </motion.div>
          <motion.div variants={fadeInUp} custom={1}>
            <Card className="border-slate-200/60">
              <CardContent className="p-4 sm:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-sm font-medium text-slate-800 sm:text-base">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-slate-500">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
