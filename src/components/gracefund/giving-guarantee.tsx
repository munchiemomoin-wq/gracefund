'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, ShieldCheck, Lock, CreditCard, RefreshCw, Headphones,
  FileCheck, CheckCircle, ArrowRight, Sparkles,
  VerifiedIcon,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const protections = [
  {
    icon: FileCheck,
    title: 'Verified Fundraisers',
    description: 'Every campaign organiser undergoes identity verification. We cross-reference government IDs and supporting documents before allowing withdrawals. Verified campaigns display a trust badge.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'All transactions use PCI-DSS compliant payment processors with 256-bit encryption. Your card details are never stored on our servers. We use tokenized payments end-to-end.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: RefreshCw,
    title: 'Refund Policy',
    description: 'If a campaign is found to be fraudulent or the organiser cannot verify fund usage, donors receive a full refund. We have a dedicated resolution team for all claims.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our donor support team is available around the clock. Whether you have a question about a campaign, need a receipt, or want to report a concern, we are here for you.',
    color: 'bg-violet-50 text-violet-600',
  },
];

const claimSteps = [
  { step: 1, title: 'Report the Issue', description: 'Use the "Report Campaign" button or contact support@jodofund.org with details about your concern.' },
  { step: 2, title: 'Investigation', description: 'Our trust & safety team reviews the claim within 24 hours and may temporarily freeze the campaign funds.' },
  { step: 3, title: 'Resolution', description: 'If the claim is valid, we process a full refund to the donor. The organiser is notified and appropriate action is taken.' },
  { step: 4, title: 'Prevention', description: 'We update our fraud detection systems and verification processes to prevent similar issues in the future.' },
];

const trustBadges = [
  { label: 'PCI-DSS Compliant', icon: Lock },
  { label: 'SOC 2 Type II', icon: ShieldCheck },
  { label: '256-bit Encryption', icon: CreditCard },
  { label: 'ISO 27001', icon: VerifiedIcon },
];

export function GivingGuaranteePage() {
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
          <motion.div variants={fadeInUp} custom={0} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
            <ShieldCheck className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h1 variants={fadeInUp} custom={1} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            JodoFund Giving Guarantee
          </motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            If something isn&apos;t right, we&apos;ll make it right.
          </motion.p>
          <motion.div variants={fadeInUp} custom={3} className="mt-6 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <CheckCircle className="mr-1 h-3 w-3" /> Donor Protection
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              <Lock className="mr-1 h-3 w-3" /> Secure Payments
            </Badge>
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
              <RefreshCw className="mr-1 h-3 w-3" /> Refund Guarantee
            </Badge>
          </motion.div>
        </motion.div>

        {/* Promise */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <motion.div variants={fadeInUp} custom={0}>
            <Card className="border-emerald-200/60 bg-emerald-50/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-[var(--gold)]" />
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Our Promise to You</h2>
                <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
                  When you donate on JodoFund, your contribution is protected. We verify every organiser, secure every transaction, and stand behind every donation. If a campaign is found to be fraudulent, you get your money back — no questions asked.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Protection Details */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How We Protect Your Donations</h2>
            <p className="mt-2 text-slate-500">Multi-layered security and trust mechanisms</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2">
            {protections.map((item, i) => (
              <motion.div key={item.title} variants={fadeInUp} custom={i + 1}>
                <Card className="h-full border-slate-200/60 transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-500">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Claim Process */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How to File a Claim</h2>
            <p className="mt-2 text-slate-500">A simple, transparent resolution process</p>
          </motion.div>
          <div className="space-y-4">
            {claimSteps.map((item, i) => (
              <motion.div key={item.step} variants={fadeInUp} custom={i + 1}>
                <Card className="border-slate-200/60">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trust Badges */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Trust Certifications</h2>
          </motion.div>
          <motion.div variants={fadeInUp} custom={1} className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((badge) => (
              <Card key={badge.label} className="border-slate-200/60">
                <CardContent className="flex items-center gap-3 px-5 py-3">
                  <badge.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-slate-700">{badge.label}</span>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20 text-center">
          <motion.div variants={fadeInUp} custom={0}>
            <Button size="lg" className="rounded-full px-8" onClick={() => setShowAuthModal(true, 'register')}>
              Start Donating With Confidence
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
