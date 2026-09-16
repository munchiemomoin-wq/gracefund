'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ArrowLeft, ArrowRight, Check, Gift, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';

const presetAmounts = [500, 1000, 2500, 5000, 10000];
const tipOptions = [0, 25, 50, 100];

export function DonationModal() {
  const { showDonationModal, setShowDonationModal, donationCampaignId } = useAppStore();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showNamePublicly, setShowNamePublicly] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTip, setSelectedTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [isCustomTip, setIsCustomTip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAmount = customAmount || amount;
  const numAmount = parseFloat(selectedAmount) || 0;
  const tipAmount = isCustomTip ? (parseFloat(customTip) || 0) : selectedTip;
  const totalAmount = numAmount + tipAmount;
  const isTestMode = true; // Always test mode for now

  const handleClose = () => {
    setShowDonationModal(false);
    setStep(1);
    setAmount('');
    setCustomAmount('');
    setIsAnonymous(false);
    setName('');
    setEmail('');
    setMessage('');
    setSelectedTip(0);
    setCustomTip('');
    setIsCustomTip(false);
  };

  const handleSubmit = async () => {
    if (!selectedAmount || numAmount <= 0) {
      toast.error('Please select or enter a donation amount');
      return;
    }
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: donationCampaignId,
          donorName: name,
          donorEmail: email,
          amount: numAmount,
          currency: 'INR',
          donorMessage: message,
          isAnonymous,
          showNamePublicly,
          platformTipAmount: tipAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }

      toast.success('Thank you for your generous donation!');
      handleClose();
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showDonationModal} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        <div className="gradient-navy px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {step === 1 && 'Choose Amount'}
              {step === 2 && 'Your Details'}
              {step === 3 && 'Add a Message'}
              {step === 4 && 'Review & Confirm'}
            </DialogTitle>
            <button onClick={handleClose} className="rounded-full p-1 hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-[var(--gold)]' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Select or enter your donation amount</p>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAmount(a.toString()); setCustomAmount(''); }}
                    className={`rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                      amount === a.toString() && !customAmount
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    {formatCurrency(a)}
                  </button>
                ))}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Custom amount</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount(''); }}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="anon"
                  checked={isAnonymous}
                  onCheckedChange={(c) => setIsAnonymous(!!c)}
                />
                <label htmlFor="anon" className="text-sm text-muted-foreground cursor-pointer">
                  Make this donation anonymous
                </label>
              </div>
              <Button className="w-full" disabled={!selectedAmount || numAmount <= 0} onClick={() => setStep(2)}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Full Name *</Label>
                <Input placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="public" checked={showNamePublicly} onCheckedChange={(c) => setShowNamePublicly(!!c)} />
                <label htmlFor="public" className="text-sm text-muted-foreground cursor-pointer">
                  Display my name publicly on the campaign
                </label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" disabled={!name.trim()}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Leave a Message (Optional)</Label>
                <Textarea
                  placeholder="Share a word of encouragement, support, or a note of solidarity..."
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5 min-h-[100px] resize-none"
                />
                <p className="mt-1.5 text-xs text-muted-foreground italic">
                  &quot;Thinking of you during this time.&quot;
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              {/* JodoFund Tip Section */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Gift className="h-4 w-4 text-primary" />
                  Optional contribution to support JodoFund
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Help us keep the platform running. This is entirely optional.
                </p>
                <div className="mt-3 flex gap-2">
                  {tipOptions.map((tipVal) => (
                    <button
                      key={tipVal}
                      onClick={() => { setSelectedTip(tipVal); setIsCustomTip(false); setCustomTip(''); }}
                      className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all ${
                        !isCustomTip && selectedTip === tipVal
                          ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-foreground'
                          : 'border-border text-muted-foreground hover:border-border'
                      }`}
                    >
                      {tipVal === 0 ? 'No Tip' : formatCurrency(tipVal)}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsCustomTip(true)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all ${
                      isCustomTip
                        ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-foreground'
                        : 'border-border text-muted-foreground hover:border-border'
                    }`}
                  >
                    Custom
                  </button>
                </div>
                {isCustomTip && (
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      placeholder="Custom amount"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                      className="pl-7 h-8 text-sm"
                      min="0"
                    />
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Campaign Donation</span>
                  <span className="font-medium">{formatCurrency(numAmount)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">JodoFund Contribution</span>
                    <span className="font-medium">+ {formatCurrency(tipAmount)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p><strong>Name:</strong> {isAnonymous ? 'Anonymous' : name}</p>
                {message && <p><strong>Message:</strong> &quot;{message}&quot;</p>}
                <p className="text-amber-600 font-medium">Test mode — no real payment will be processed</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90">
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <><Check className="mr-2 h-4 w-4" /> Donate {formatCurrency(totalAmount)}</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
