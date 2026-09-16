'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Info } from 'lucide-react';
import { CONTRIBUTION_PURPOSES, PRESET_AMOUNTS } from '@/lib/give-constants';
import { formatCurrency } from '@/lib/currency';

const STEPS = ['Choose Amount', 'Choose Purpose', 'Your Details', 'Review'];

export function GiveToJodoFundPage() {
  const { setCurrentView } = useAppStore();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [purpose, setPurpose] = useState<string | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const selectedAmount = amount ?? (customAmount ? parseFloat(customAmount) : null);
  const selectedPurpose = CONTRIBUTION_PURPOSES.find((p) => p.id === purpose);
  const isOperations = purpose === 'operations';

  const canProceed = () => {
    if (step === 0) return selectedAmount !== null && selectedAmount > 0;
    if (step === 1) return purpose !== null;
    if (step === 2) return anonymous || (donorName.trim().length > 0 && donorEmail.trim().length > 0);
    return true;
  };

  const handleSubmit = async () => {
    if (!selectedAmount || !purpose) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/give', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount,
          purpose,
          donorName: anonymous ? null : donorName,
          donorEmail: anonymous ? null : donorEmail,
          donorPhone: donorPhone || null,
          anonymous,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: data.message || 'Contribution successful!' });
      } else {
        setResult({ success: false, message: data.error || 'Something went wrong.' });
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${result.success ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {result.success ? (
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            ) : (
              <Info className="h-8 w-8 text-red-600" />
            )}
          </div>
          <h2 className="text-xl font-bold">
            {result.success ? 'Thank You for Your Contribution!' : 'Something Went Wrong'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
          {result.success && selectedAmount && (
            <div className="mt-6 inline-block rounded-xl border bg-muted/30 px-6 py-4 text-left">
              <p className="text-xs text-muted-foreground">Contribution to JodoFund</p>
              <p className="text-2xl font-bold">{formatCurrency(selectedAmount)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{selectedPurpose?.label}</p>
            </div>
          )}
          <div className="mt-6 flex justify-center gap-3">
            {result.success && (
              <Button onClick={() => setCurrentView('transparency')}>See Where Funds Go</Button>
            )}
            <Button variant="outline" onClick={() => setCurrentView('home')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('home')}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Give to JodoFund</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your contribution to JodoFund is separate from donations made directly to fundraising campaigns.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mt-8 flex items-center justify-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
              i < step ? 'bg-emerald-100 text-emerald-700' :
              i === step ? 'bg-primary text-primary-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-1 h-px w-6 sm:w-10 ${i < step ? 'bg-emerald-300' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm font-medium">{STEPS[step]}</span>
      </div>

      {/* Step content */}
      <div className="mt-8">
        {/* Step 0: Choose Amount */}
        {step === 0 && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Choose Contribution Amount</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {PRESET_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAmount(a); setCustomAmount(''); }}
                    className={`rounded-xl border-2 p-4 text-center font-semibold transition-all ${
                      amount === a && !customAmount
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    {formatCurrency(a)}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter custom amount"
                    className="pl-7"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
                    min={1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Choose Purpose */}
        {step === 1 && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Choose Where Your Contribution Goes</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {CONTRIBUTION_PURPOSES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPurpose(p.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      purpose === p.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-xl mt-0.5">{p.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{p.label}</p>
                        {('isOperations' in p && p.isOperations) && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">PLATFORM</span>
                        )}
                        {('isFlexible' in p && p.isFlexible) && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">FLEXIBLE</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                    </div>
                    <div className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      purpose === p.id ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                    }`}>
                      {purpose === p.id && <CheckCircle className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                  </button>
                ))}
              </div>

              {purpose === 'where_most_needed' && (
                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    JodoFund may allocate contributions to eligible causes based on current need and available resources.
                  </p>
                </div>
              )}

              {purpose === 'operations' && (
                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    Your contribution helps JodoFund operate the platform, including technology, verification, fraud prevention, payment processing, administration and other essential operating expenses. This is separate from community-support allocations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Donor Details */}
        {step === 2 && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Your Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anon"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="anon" className="text-sm font-medium cursor-pointer">Contribute anonymously</Label>
              </div>

              {!anonymous && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" placeholder="Your full name" value={donorName} onChange={(e) => setDonorName(e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="you@example.com" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} className="mt-1.5" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review */}
        {step === 3 && selectedAmount && selectedPurpose && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Review Your Contribution</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contribution to JodoFund</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedPurpose.label}</p>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(selectedAmount)}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purpose</span>
                    <span className="font-medium">{selectedPurpose.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Donor</span>
                    <span className="font-medium">{anonymous ? 'Anonymous' : (donorName || 'Not provided')}</span>
                  </div>
                  {donorEmail && !anonymous && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{donorEmail}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{isOperations ? 'Platform Operations' : 'Community Support'}</span>
                  </div>
                </div>

                {process.env.NEXT_PUBLIC_PAYMENT_MODE === 'test' && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400">
                    <strong>Test Mode:</strong> No real payment will be processed. This is a demonstration.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => step === 0 ? setCurrentView('home') : setStep(step - 1)}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            Continue
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Contribution
          </Button>
        )}
      </div>

      {/* Legal note */}
      <p className="mt-6 text-center text-[11px] text-muted-foreground/60 leading-relaxed">
        Your contribution supports JodoFund&apos;s community programs. Contributions are described as
        &quot;contributions&quot; or &quot;support&quot; — not as tax-deductible donations, charity donations, or NGO
        donations — unless the applicable legal and tax treatment has been professionally confirmed.
      </p>
    </div>
  );
}
