'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import {
  ArrowLeft, Calculator, FileText, ShieldCheck, TrendingDown,
  CheckCircle, Info, Receipt, Percent,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

function TaxCalculator() {
  const [amount, setAmount] = useState(10000);
  const taxSlab = 0.3; // 30% tax slab (highest)
  const deduction80G = amount; // 100% deduction for eligible donations (50% in some cases)
  const taxSaved = Math.round(deduction80G * taxSlab);
  const effectiveCost = amount - taxSaved;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-slate-900">80G Tax Savings Calculator</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Donation Amount (₹)</label>
            <input
              type="range"
              min={500}
              max={500000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-400">₹500</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(amount)}</span>
              <span className="text-xs text-slate-400">₹5,00,000</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white p-4 border border-slate-200/60">
              <p className="text-xs text-slate-500">Tax Saved (approx.)</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{formatCurrency(taxSaved)}</p>
              <p className="text-xs text-slate-400">at 30% tax slab</p>
            </div>
            <div className="rounded-xl bg-white p-4 border border-slate-200/60">
              <p className="text-xs text-slate-500">Effective Cost to You</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(effectiveCost)}</p>
              <p className="text-xs text-slate-400">after tax benefit</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            Tax savings vary based on your income tax slab. This calculator assumes the 30% slab. Actual savings depend on your tax bracket and the specific 80G category of the organisation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const comparisonData = [
  { donation: 5000, without80G: 5000, with80G: 3500 },
  { donation: 10000, without80G: 10000, with80G: 7000 },
  { donation: 25000, without80G: 25000, with80G: 17500 },
  { donation: 50000, without80G: 50000, with80G: 35000 },
  { donation: 100000, without80G: 100000, with80G: 70000 },
];

const taxFaqs = [
  { q: 'What is Section 80G of the Income Tax Act?', a: 'Section 80G allows donors to claim a deduction on their taxable income for donations made to approved charitable organisations. Depending on the organisation, you can deduct 50% or 100% of the donated amount, subject to qualifying limits.' },
  { q: 'Which JodoFund campaigns are 80G eligible?', a: 'Campaigns by organisations with valid 80G registration are eligible. Look for the "80G Eligible" badge on the campaign. Individual fundraisers are generally not 80G eligible unless backed by a registered NGO.' },
  { q: 'How do I claim the 80G deduction?', a: 'When you donate to an 80G-eligible campaign, JodoFund auto-generates a tax receipt with the organisation\'s 80G registration number. Use this receipt when filing your income tax return under Section 80G.' },
  { q: 'Is there a limit on 80G deductions?', a: 'For most 80G donations, the deduction is limited to 10% of your gross total income. However, donations to certain institutions (like PM Relief Fund) have no upper limit. Consult your CA for specific advice.' },
  { q: 'When will I receive my tax receipt?', a: 'Tax receipts are generated instantly after a successful donation to an 80G-eligible campaign. You can also download all receipts from your Donor Dashboard at any time.' },
  { q: 'Can NRIs claim 80G benefits?', a: 'Yes! Non-Resident Indians can claim 80G deductions for donations made to eligible Indian organisations, provided they file income tax returns in India.' },
];

function TaxBenefitsContent({ isFullPage }: { isFullPage: boolean }) {
  const { setCurrentView } = useAppStore();

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
              <motion.div variants={fadeInUp} custom={0} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <Receipt className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h1 variants={fadeInUp} custom={1} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                80G Tax Benefits
              </motion.h1>
              <motion.p variants={fadeInUp} custom={2} className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
                Your generosity deserves recognition. Claim tax deductions under Section 80G and reduce your effective donation cost.
              </motion.p>
            </motion.div>
          </>
        )}

        {/* Key Highlights */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-4 sm:grid-cols-3 mb-8">
          {[
            { icon: Percent, title: 'Up to 50% Deduction', desc: 'On donations to eligible organisations', color: 'bg-emerald-50 text-emerald-600' },
            { icon: FileText, title: 'Auto-Generated Receipts', desc: 'Tax receipts available instantly after donation', color: 'bg-blue-50 text-blue-600' },
            { icon: TrendingDown, title: 'Lower Effective Cost', desc: 'A ₹10,000 donation costs you only ₹7,000 (30% slab)', color: 'bg-amber-50 text-amber-600' },
          ].map((item, i) => (
            <motion.div key={item.title} variants={fadeInUp} custom={i}>
              <Card className="border-slate-200/60 h-full transition-shadow hover:shadow-md">
                <CardContent className="flex items-start gap-3 p-5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* Tax Calculator */}
          <TaxCalculator />

          {/* Auto Receipt */}
          <Card className="border-slate-200/60">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-slate-900">Auto-Generated Tax Receipt</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">When you donate to an 80G-eligible campaign, you receive a receipt containing:</p>
              <ul className="space-y-2">
                {[
                  'Donor name and PAN (if provided)',
                  'Organisation name and 80G registration number',
                  'Donation amount and date',
                  'Receipt number for tax filing',
                  'Deduction category (50% or 100%)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card className="border-slate-200/60 mb-8">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-slate-900">With 80G vs Without 80G</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-left font-semibold text-slate-600">Donation</th>
                    <th className="pb-3 text-right font-semibold text-slate-600">Without 80G</th>
                    <th className="pb-3 text-right font-semibold text-slate-600">With 80G (30% slab)</th>
                    <th className="pb-3 text-right font-semibold text-emerald-600">You Save</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr key={row.donation} className="border-b border-slate-100">
                      <td className="py-3 font-medium text-slate-800">{formatCurrency(row.donation)}</td>
                      <td className="py-3 text-right text-slate-600">{formatCurrency(row.without80G)}</td>
                      <td className="py-3 text-right text-slate-600">{formatCurrency(row.with80G)}</td>
                      <td className="py-3 text-right font-semibold text-emerald-600">{formatCurrency(row.without80G - row.with80G)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="border-slate-200/60 mb-8">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Tax Benefit FAQ</h3>
            <Accordion type="single" collapsible className="w-full">
              {taxFaqs.map((faq, i) => (
                <AccordionItem key={i} value={`tax-faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium text-slate-800">
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
      </div>
    </div>
  );
}

export function TaxBenefitsSection() {
  return (
    <section className="py-14 sm:py-20 bg-emerald-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
            <Receipt className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">Save Tax Under Section 80G</h2>
          <p className="mt-2 text-muted-foreground">Your donation costs less than you think</p>
        </motion.div>
        <TaxBenefitsContent isFullPage={false} />
      </div>
    </section>
  );
}

export function TaxBenefitsPage() {
  return <TaxBenefitsContent isFullPage={true} />;
}
