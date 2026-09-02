'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft, MapPin, Users, Shield, ShieldCheck, ShieldAlert, Clock, AlertTriangle, Heart,
  Share2, Copy, Check, Calendar, Link2, Flag, FileText, Info, Eye,
} from 'lucide-react';
import { formatCurrency, getProgressPercent, getDaysRemaining } from '@/lib/currency';
import { motion } from 'framer-motion';

interface FundUsageItem {
  id: string;
  category: string;
  amount: number;
  description: string | null;
  sortOrder: number;
}

interface CampaignDetail {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  story: string | null;
  coverImage: string | null;
  videoUrl: string | null;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  donorCount: number;
  viewCount: number;
  isUrgent: boolean;
  verificationLevel: string;
  endDate: string | null;
  createdAt: string;
  status: string;
  campaignType?: string | null;
  campaignFeatures?: string | null;
  beneficiaryName: string | null;
  beneficiaryRelationship: string | null;
  category?: { name: string; icon: string } | null;
  organizer?: { id: string; name: string | null; avatarUrl: string | null; role: string } | null;
  updates?: Array<{ id: string; title: string; content: string | null; imageUrl: string | null; createdAt: string }>;
  donations?: Array<{ id: string; donorName: string; amount: number; currency: string; donorMessage: string | null; isAnonymous: boolean; showNamePublicly: boolean; createdAt: string }>;
  fundUsageItems?: FundUsageItem[];
  openReportsCount?: number;
  _count?: { donations: number; favorites: number };
}

const verificationLabels: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  none: { label: 'Unverified', color: 'bg-gray-100 text-gray-600', icon: Shield },
  basic: { label: 'Basic Verified', color: 'bg-blue-100 text-blue-700', icon: ShieldCheck },
  identity: { label: 'Identity Verified', color: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck },
  beneficiary: { label: 'Beneficiary Verified', color: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck },
  organization: { label: 'Organization Verified', color: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck },
};

export function CampaignDetail() {
  const { selectedCampaignSlug, setCurrentView, setShowDonationModal, setShowReportModal } = useAppStore();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [supported, setSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedCampaignSlug) return;
    let cancelled = false;
    const controller = new AbortController();
    fetch(`/api/campaigns/${selectedCampaignSlug}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setCampaign(data);
          setSupportCount(data.donorCount || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && !cancelled) {
          console.error(err);
          setLoading(false);
        }
      });
    return () => { cancelled = true; controller.abort(); };
  }, [selectedCampaignSlug]);

  if (!selectedCampaignSlug) return null;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video rounded-2xl bg-muted animate-pulse" />
            <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-96 rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => setCurrentView('home')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
        </Button>
      </div>
    );
  }

  const progress = getProgressPercent(campaign.raisedAmount, campaign.goalAmount);
  const daysLeft = getDaysRemaining(campaign.endDate ? new Date(campaign.endDate) : null);
  const vInfo = verificationLabels[campaign.verificationLevel] || verificationLabels.none;
  const VerificationIcon = vInfo.icon;
  const isUnderInvestigation = campaign.status === 'under_investigation';

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({ title: campaign.title, text: campaign.shortDescription || '', url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
    >
      <button
        onClick={() => setCurrentView('home')}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to campaigns
      </button>

      {/* Investigation Banner */}
      {isUnderInvestigation && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">This campaign is currently under review.</p>
            <p className="text-xs text-amber-700 mt-1">Our team is reviewing this campaign to ensure it meets our guidelines. Donations and withdrawals may be temporarily paused during this process.</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
            {campaign.coverImage ? (
              <img src={campaign.coverImage} alt={campaign.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-muted-foreground/20">GF</div>
            )}
            <div className="absolute left-3 top-3 flex gap-1.5">
              {campaign.isUrgent && (
                <Badge className="bg-red-500 text-white border-0 gap-1"><AlertTriangle className="h-3 w-3" /> Urgent Need</Badge>
              )}
              {campaign.verificationLevel !== 'none' && (
                <Badge className="bg-emerald-600 text-white border-0 gap-1"><VerificationIcon className="h-3 w-3" /> {vInfo.label}</Badge>
              )}
            </div>
            <div className="absolute right-3 top-3">
              {campaign.category && (
                <Badge variant="secondary" className="bg-white/90 text-foreground text-xs backdrop-blur-sm border-0">{campaign.category.name}</Badge>
              )}
            </div>
          </div>

          <div>
            {campaign.category && <Badge variant="secondary" className="mb-2">{campaign.category.name}</Badge>}
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{campaign.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Avatar className="h-6 w-6"><AvatarFallback className="text-xs bg-primary/10 text-primary">{campaign.organizer?.name?.charAt(0) || 'U'}</AvatarFallback></Avatar>
                <span>by <strong className="text-foreground">{campaign.organizer?.name || 'Community Member'}</strong></span>
              </div>
              <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> India</div>
              <div className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(campaign.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              {campaign.viewCount > 0 && (
                <div className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {campaign.viewCount.toLocaleString('en-IN')} views</div>
              )}
            </div>
          </div>

          {/* Trust & Transparency bar */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/30 p-3">
            <Badge className={`${vInfo.color} border-0 gap-1 text-xs`}><VerificationIcon className="h-3 w-3" />{vInfo.label}</Badge>
            <span className="text-xs text-muted-foreground"><Users className="inline h-3 w-3 mr-1" />{campaign.donorCount} donors</span>
            {campaign.updates && campaign.updates.length > 0 && (
              <span className="text-xs text-muted-foreground"><FileText className="inline h-3 w-3 mr-1" />{campaign.updates.length} update{campaign.updates.length > 1 ? 's' : ''}</span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">Last updated {new Date(campaign.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold">Story</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{campaign.story}</div>
          </div>

          {/* Fund Usage Section */}
          {campaign.fundUsageItems && campaign.fundUsageItems.length > 0 && (
            <div className="rounded-xl border bg-muted/20 p-5">
              <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> How Funds Will Be Used</h2>
              <p className="mt-1 text-xs text-muted-foreground">Estimated use of funds provided by the campaign organizer.</p>
              <div className="mt-4 space-y-3">
                {campaign.fundUsageItems
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-background p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.category}</p>
                        {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                      </div>
                      <span className="text-sm font-bold text-primary ml-4 whitespace-nowrap">{formatCurrency(item.amount, campaign.currency)}</span>
                    </div>
                  ))}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Estimated Total</span>
                  <span className="text-sm font-bold">{formatCurrency(campaign.fundUsageItems.reduce((s, i) => s + i.amount, 0), campaign.currency)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Updates */}
          {campaign.updates && campaign.updates.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold">Campaign Updates ({campaign.updates.length})</h2>
              <div className="mt-3 space-y-4">
                {campaign.updates?.map((update) => (
                  <div key={update.id} className="rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{update.title}</h3>
                      <span className="text-xs text-muted-foreground">{new Date(update.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {update.content && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{update.content}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Supporters */}
          {campaign.donations && campaign.donations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold">Recent Supporters</h2>
              <div className="mt-3 space-y-3">
                {campaign.donations?.slice(0, 5).map((d) => (
                  <div key={d.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/30 transition-colors">
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarFallback className="text-xs bg-[var(--gold)]/10 text-[var(--gold)]">{(d.isAnonymous || !d.showNamePublicly) ? 'A' : d.donorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{d.isAnonymous ? 'Anonymous' : (!d.showNamePublicly ? 'A supporter' : d.donorName)}</span>
                        <span className="text-sm font-semibold text-primary">{formatCurrency(d.amount, d.currency)}</span>
                      </div>
                      {d.donorMessage && <p className="mt-0.5 text-xs text-muted-foreground italic">&quot;{d.donorMessage}&quot;</p>}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(d.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Report Campaign Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowReportModal(true, campaign.id)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-600 transition-colors"
            >
              <Flag className="h-3.5 w-3.5" /> Report this campaign
            </button>
          </div>
        </div>

        {/* RIGHT - Donation Card (sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div>
                <span className="text-2xl font-bold text-foreground">{formatCurrency(campaign.raisedAmount, campaign.currency)}</span>
                <span className="text-sm text-muted-foreground"> raised of {formatCurrency(campaign.goalAmount, campaign.currency)} goal</span>
              </div>
              <Progress value={progress} className="mt-2 h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-[var(--gold)]" />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {campaign.donorCount} donors</div>
                {daysLeft !== null && <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {daysLeft} days left</div>}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[500, 1000, 2500].map((a) => (
                  <button
                    key={a}
                    onClick={() => setShowDonationModal(true, campaign.id)}
                    className="rounded-lg border py-2 text-sm font-semibold transition-all hover:border-primary hover:bg-primary/5"
                  >{formatCurrency(a)}</button>
                ))}
              </div>

              <Button className="mt-3 w-full h-12 text-base font-bold" size="lg" onClick={() => setShowDonationModal(true, campaign.id)}>
                <Heart className="mr-2 h-5 w-5" /> Donate Now
              </Button>

              <Separator className="my-4" />

              {/* Show Your Support button */}
              <button
                onClick={() => { setSupported(!supported); setSupportCount(supported ? supportCount - 1 : supportCount + 1); }}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                  supported ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Heart className={`h-4 w-4 ${supported ? 'fill-current' : ''}`} />
                {supported ? 'Showing Support' : 'Show Your Support'}
              </button>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                {supportCount} {supportCount === 1 ? 'person is' : 'people are'} supporting this cause.
              </p>

              <Separator className="my-4" />

              {/* Verification Level Detail */}
              <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
                <VerificationIcon className={`h-4 w-4 ${campaign.verificationLevel !== 'none' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                <span className="text-xs font-medium">{vInfo.label}</span>
              </div>

              <Separator className="my-4" />

              {/* Share */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Share this campaign</p>
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={handleShare} className="flex h-9 items-center justify-center rounded-lg border text-emerald-600 hover:bg-emerald-50 transition-colors" title="WhatsApp">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.298-.347.446-.52.149-.174.198-.298.347-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.298-.347.446-.520.149-.174.198-.298.497-.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.298-.347.446-.520.149-.174.198-.298.497-.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </button>
                  <button className="flex h-9 items-center justify-center rounded-lg border text-blue-600 hover:bg-blue-50 transition-colors" title="Facebook">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>
                  <button className="flex h-9 items-center justify-center rounded-lg border text-sky-500 hover:bg-sky-50 transition-colors" title="X (Twitter)">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75ZM8.413 18.297h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </button>
                  <button onClick={handleShare} className="flex h-9 items-center justify-center rounded-lg border text-muted-foreground hover:bg-muted transition-colors" title="Copy Link">
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Beneficiary info */}
            {campaign.beneficiaryName && (
              <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Organized by</h3>
                <div className="mt-2 flex items-center gap-3">
                  <Avatar><AvatarFallback className="bg-primary/10 text-primary">{campaign.organizer?.name?.charAt(0) || 'G'}</AvatarFallback></Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{campaign.organizer?.name || 'Community Member'}</p>
                    {campaign.beneficiaryName && <p className="text-xs text-muted-foreground">Beneficiary: {campaign.beneficiaryName}</p>}
                  </div>
                  <Badge className={`ml-auto ${vInfo.color} border-0 text-xs gap-1 shrink-0`}><VerificationIcon className="h-3 w-3" />{vInfo.label}</Badge>
                </div>
              </div>
            )}

            {/* Transparency Notice */}
            <div className="rounded-xl border border-dashed bg-muted/20 p-4">
              <div className="flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Donation Transparency</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">GraceFund uses verification and review processes designed to help improve trust and transparency. Donor information, beneficiary documents, and internal review notes are kept confidential.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
