'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Upload, Sparkles, User, Users, Church, Globe, Building, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const raiseForOptions = [
  { value: 'myself', label: 'Myself', icon: User, desc: 'You are raising funds for your own needs' },
  { value: 'someone', label: 'Someone Else', icon: Users, desc: 'A friend, family member, or acquaintance' },
  { value: 'family', label: 'My Family', icon: Heart, desc: 'Your family needs support' },
  { value: 'church', label: 'A Church', icon: Church, desc: 'A church building project or program' },
  { value: 'ministry', label: 'A Ministry', icon: Globe, desc: 'A ministry or mission organization' },
  { value: 'charity', label: 'A Charity', icon: Building, desc: 'A registered charity or NGO' },
  { value: 'community', label: 'Community Project', icon: Users, desc: 'A community initiative or project' },
];

export function CreateCampaignWizard() {
  const { setCurrentView } = useAppStore();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [form, setForm] = useState({
    raiseFor: '',
    categoryId: '',
    title: '',
    shortDescription: '',
    story: '',
    country: 'India',
    state: '',
    city: '',
    goalAmount: '',
    currency: 'INR',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    beneficiaryContact: '',
  });

  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    toast.success('Campaign submitted for review! (Demo mode)');
    setCurrentView('home');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      {/* Back */}
      <button
        onClick={() => setCurrentView('home')}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create a Campaign</h1>
        <p className="mt-1 text-muted-foreground">Step {step} of {totalSteps}</p>
        <div className="mt-3 flex gap-1.5">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Who are you raising for? */}
      {step === 1 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Who are you raising funds for?</h2>
          <p className="text-sm text-muted-foreground">Select the option that best describes your campaign</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {raiseForOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update('raiseFor', opt.value)}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  form.raiseFor === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <opt.icon className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-semibold">{opt.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)} disabled={!form.raiseFor}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Category */}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Select a Category</h2>
          <p className="text-sm text-muted-foreground">Choose the category that best fits your campaign</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {['Medical', 'Education', 'Church & Ministry', 'Missions', 'Emergency', 'Community', 'Funeral & Memorial', 'Children'].map((cat) => (
              <button
                key={cat}
                onClick={() => update('categoryId', cat)}
                className={`rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                  form.categoryId === cat ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
            <Button className="ml-auto" onClick={() => setStep(3)} disabled={!form.categoryId}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Campaign Details */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Campaign Details</h2>
          <div>
            <Label>Campaign Title *</Label>
            <Input placeholder="e.g., Help John with Medical Expenses" value={form.title} onChange={(e) => update('title', e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Short Description *</Label>
            <Textarea placeholder="Briefly describe the campaign in 1-2 sentences..." value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} className="mt-1.5 min-h-[80px] resize-none" />
          </div>
          <div>
            <Label>Full Story *</Label>
            <Textarea placeholder="Tell the complete story. Explain who needs help, why they need it, and how the funds will be used..." value={form.story} onChange={(e) => update('story', e.target.value)} className="mt-1.5 min-h-[150px] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fundraising Goal (₹) *</Label>
              <Input type="number" placeholder="50000" value={form.goalAmount} onChange={(e) => update('goalAmount', e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={(v) => update('currency', v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="AED">AED (د.إ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>State</Label>
              <Input placeholder="State" value={form.state} onChange={(e) => update('state', e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>City</Label>
              <Input placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
            <Button className="ml-auto" onClick={() => setStep(4)} disabled={!form.title || !form.shortDescription}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Media */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Add Media</h2>
          <p className="text-sm text-muted-foreground">Add a cover image and optional video link to your campaign</p>
          <div className="rounded-2xl border-2 border-dashed p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Click to upload cover image</p>
            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, or WebP. Max 5MB.</p>
          </div>
          <div>
            <Label>Video Link (Optional)</Label>
            <Input placeholder="https://youtube.com/watch?v=..." className="mt-1.5" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
            <Button className="ml-auto" onClick={() => setStep(5)}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Beneficiary Details */}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Beneficiary Details</h2>
          <p className="text-sm text-muted-foreground">Information about the person or organization receiving the funds</p>
          <div>
            <Label>Beneficiary Name</Label>
            <Input placeholder="Full name of the beneficiary" value={form.beneficiaryName} onChange={(e) => update('beneficiaryName', e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Relationship to Fundraiser</Label>
            <Input placeholder="e.g., Father, Friend, Self" value={form.beneficiaryRelationship} onChange={(e) => update('beneficiaryRelationship', e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Contact Information (Optional)</Label>
            <Input placeholder="Phone number or email" value={form.beneficiaryContact} onChange={(e) => update('beneficiaryContact', e.target.value)} className="mt-1.5" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setStep(4)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
            <Button className="ml-auto" onClick={() => setStep(6)}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 6: Review & Submit */}
      {step === 6 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Review Your Campaign</h2>
          <Card className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center text-4xl text-muted-foreground/20">
              Cover Preview
            </div>
            <CardContent className="p-5 space-y-3">
              <Badge variant="secondary">{form.categoryId}</Badge>
              <h3 className="text-xl font-bold">{form.title || 'Untitled Campaign'}</h3>
              <p className="text-sm text-muted-foreground">{form.shortDescription || 'No description'}</p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                <div><span className="text-muted-foreground">Goal:</span> <strong>₹{form.goalAmount || '0'}</strong></div>
                <div><span className="text-muted-foreground">Currency:</span> <strong>{form.currency}</strong></div>
                <div><span className="text-muted-foreground">Location:</span> <strong>{form.city || form.state || 'India'}</strong></div>
                <div><span className="text-muted-foreground">Beneficiary:</span> <strong>{form.beneficiaryName || 'Not specified'}</strong></div>
              </div>
            </CardContent>
          </Card>
          <p className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            By submitting, your campaign will enter <strong>pending review</strong> status. Our team will review it before it goes live.
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setStep(5)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
            <Button className="ml-auto" onClick={handleSubmit}>
              <Check className="mr-2 h-4 w-4" /> Submit Campaign for Review
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
