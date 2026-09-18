'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Heart, HeartPulse, GraduationCap, Flower2, Baby,
  Users, Calendar, TrendingUp, Sparkles, CheckCircle, Gift,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const monthlyAmounts = [500, 1000, 2500, 5000];
const purposes = [
  { id: 'general', label: 'Where Most Needed', icon: Heart, color: 'text-primary' },
  { id: 'medical', label: 'Medical', icon: HeartPulse, color: 'text-rose-600' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'text-blue-600' },
  { id: 'children', label: 'Children', icon: Baby, color: 'text-pink-600' },
  { id: 'elderly', label: 'Elderly', icon: Users, color: 'text-emerald-600' },
];

const impactMap: Record<string, Record<number, string>> = {
  general: {
    500: 'Your ₹500/month can support 2 families with essential supplies each year',
    1000: 'Your ₹1,000/month can help 4 families with essential supplies each year',
    2500: 'Your ₹2,500/month can provide emergency relief to 6 families each year',
    5000: 'Your ₹5,000/month can transform the lives of 10 families each year',
  },
  medical: {
    500: 'Your ₹500/month can fund 2 medical consultations for underserved patients/year',
    1000: 'Your ₹1,000/month can provide monthly medicines for 3 chronic patients/year',
    2500: 'Your ₹2,500/month can fund 1 minor surgery for a child in need each year',
    5000: 'Your ₹5,000/month can contribute to a life-saving surgery fund each year',
  },
  education: {
    500: 'Your ₹500/month can provide school supplies for 4 students each year',
    1000: 'Your ₹1,000/month can fund 2 students\' annual tuition fees each year',
    2500: 'Your ₹2,500/month can provide a full scholarship for 1 student each year',
    5000: 'Your ₹5,000/month can fund college education for 2 first-gen students each year',
  },
  children: {
    500: 'Your ₹500/month can provide nutritious meals for 3 children each month',
    1000: 'Your ₹1,000/month can support 2 children with education and meals each month',
    2500: 'Your ₹2,500/month can sponsor 1 child\'s complete care for a year',
    5000: 'Your ₹5,000/month can give 4 children safe shelter and education each year',
  },
  elderly: {
    500: 'Your ₹500/month can provide monthly health check-ups for 3 seniors',
    1000: 'Your ₹1,000/month can fund medicines for 5 elderly residents each month',
    2500: 'Your ₹2,500/month can support 2 seniors with complete healthcare each year',
    5000: 'Your ₹5,000/month can maintain shelter and care for 3 elderly persons each year',
  },
};

function getImpact(amount: number, purpose: string): string {
  const purposeMap = impactMap[purpose] || impactMap.general;
  const key = (amount >= 5000 ? 5000 : amount >= 2500 ? 2500 : amount >= 1000 ? 1000 : 500) as keyof typeof purposeMap;
  return purposeMap[key] || `Your ${formatCurrency(amount)}/month makes a meaningful difference in lives each year`;
}

const benefits = [
  'Consistent support for causes you care about',
  'Exclusive donor updates and impact reports',
  '80G tax benefit on every monthly contribution',
  'Cancel or change your amount anytime',
  'Priority access to campaign updates',
  'Special GEM donor badge on your profile',
];

function MonthlyDonationsContent({ isFullPage }: { isFullPage: boolean }) {
  const { setCurrentView, setShowAuthModal } = useAppStore();
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('general');
  const [isCustom, setIsCustom] = useState(false);

  const activeAmount = isCustom ? parseInt(customAmount) || 0 : selectedAmount;
  const impact = getImpact(activeAmount, selectedPurpose);

  const monthlyTotal = activeAmount * 12;

  return (
    <div className={isFullPage ? 'min-h-screen bg-gradient-to-b from-slate-50 to-white' : ''}>
      <div className={isFullPage ? 'mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10' : ''}>
        {isFullPage && (
          <>
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
              <motion.div variants={fadeInUp} custom={0} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-600 shadow-lg shadow-primary/20">
                <Gift className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h1 variants={fadeInUp} custom={1} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Give Every Month <span className="text-[var(--gold)]">(GEM)</span>
              </motion.h1>
              <motion.p variants={fadeInUp} custom={2} className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
                Make a lasting impact with monthly giving. Small amounts, consistently given, create extraordinary change.
              </motion.p>
            </motion.div>
          </>
        )}

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Amount + Purpose */}
          <div className="lg:col-span-3 space-y-6">
            {/* Amount Selection */}
            <Card className="border-slate-200/60">
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Choose Your Monthly Amount</h3>
                <p className="text-sm text-slate-500 mb-4">Select a preset or enter a custom amount</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {monthlyAmounts.map((amt) => (
                    <motion.button
                      key={amt}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedAmount(amt); setIsCustom(false); }}
                      className={`rounded-xl border-2 p-4 text-center transition-all ${
                        !isCustom && selectedAmount === amt
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-primary/30'
                      }`}
                    >
                      <span className="text-xl font-bold">₹{amt.toLocaleString('en-IN')}</span>
                      <span className="block text-xs text-slate-400">/month</span>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="text-sm font-medium text-slate-600">Custom Amount</label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-slate-400">₹</span>
                    <input
                      type="number"
                      min={100}
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setIsCustom(true); }}
                      placeholder="Enter amount"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm text-slate-400">/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purpose Selection */}
            <Card className="border-slate-200/60">
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Where Should Your Giving Go?</h3>
                <p className="text-sm text-slate-500 mb-4">Choose the cause closest to your heart</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {purposes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPurpose(p.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                        selectedPurpose === p.id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 bg-white hover:border-primary/30'
                      }`}
                    >
                      <p.icon className={`h-6 w-6 ${selectedPurpose === p.id ? 'text-primary' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${selectedPurpose === p.id ? 'text-primary' : 'text-slate-600'}`}>{p.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Impact + Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impact Calculator */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-slate-900">Your Impact</h3>
                </div>
                {activeAmount > 0 ? (
                  <>
                    <p className="text-sm leading-relaxed text-slate-700">{impact}</p>
                    <div className="mt-4 rounded-xl bg-white p-4 border border-slate-200/60">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Monthly</span>
                        <span className="font-bold text-slate-900">{formatCurrency(activeAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-slate-500">Annual Total</span>
                        <span className="font-bold text-primary">{formatCurrency(monthlyTotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-slate-500">80G Tax Saved (approx.)</span>
                        <span className="font-bold text-emerald-600">{formatCurrency(Math.round(monthlyTotal * 0.3))}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Select an amount to see your potential impact</p>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-slate-200/60">
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Why Give Monthly?</h3>
                <ul className="space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full rounded-xl text-base font-semibold"
              onClick={() => setShowAuthModal(true, 'register')}
              disabled={activeAmount <= 0}
            >
              <Heart className="mr-2 h-4 w-4" />
              Start Monthly Giving
            </Button>
          </div>
        </div>

        {/* Impact Timeline Visual */}
        <Card className="mt-8 border-slate-200/60 overflow-hidden">
          <CardContent className="p-5 sm:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">How Monthly Giving Adds Up</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              {[
                { period: '3 Months', factor: 3 },
                { period: '6 Months', factor: 6 },
                { period: '1 Year', factor: 12 },
                { period: '2 Years', factor: 24 },
              ].map((item) => (
                <div key={item.period} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">{item.period}</p>
                  <p className="mt-1 text-xl font-bold text-primary">
                    {formatCurrency(activeAmount * item.factor)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function MonthlyDonationsSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Give Every Month <span className="text-[var(--gold)]">(GEM)</span>
          </h2>
          <p className="mt-2 text-muted-foreground">Consistent generosity creates extraordinary change</p>
        </motion.div>
        <MonthlyDonationsContent isFullPage={false} />
      </div>
    </section>
  );
}

export function MonthlyDonationsPage() {
  return <MonthlyDonationsContent isFullPage={true} />;
}
