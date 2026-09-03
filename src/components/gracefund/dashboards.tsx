'use client';

import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Heart, DollarSign, FileText, Users, TrendingUp, Eye, Clock, AlertCircle, CheckCircle, BarChart3, Settings, Shield, Star, Flag, CreditCard, Globe, Bell, Lock, Scale, Search, Ban, ChevronRight, CircleDot, AlertTriangle, Activity, ClipboardList, UserCheck, LayoutDashboard, FolderOpen, Tag, Sparkles, TrendingDown, Wallet, XCircle, Info, Loader2, RefreshCw, HandHeart, PieChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatCompactCurrency, formatNumber } from '@/lib/currency';
import { useEffect, useState, useCallback } from 'react';
import type { AdminSubView } from '@/store/app-store';
import { GiveContributionsView, GiveAllocationsView, GiveBalancesView, GiveTransparencyView, GiveReportsView } from './admin-give-views';

// ─────────────────────────────────────────────────────────────
// DonorDashboard (unchanged)
// ─────────────────────────────────────────────────────────────

export function DonorDashboard() {
  const { setCurrentView } = useAppStore();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <button onClick={() => setCurrentView('home')} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Track your donations and saved campaigns</p>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Heart className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold">12</p><p className="text-xs text-muted-foreground">Total Donations</p></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10"><DollarSign className="h-5 w-5 text-[var(--gold)]" /></div><div><p className="text-2xl font-bold">₹24,500</p><p className="text-xs text-muted-foreground">Total Given</p></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100"><Star className="h-5 w-5 text-emerald-600" /></div><div><p className="text-2xl font-bold">5</p><p className="text-xs text-muted-foreground">Saved Campaigns</p></div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="donations" className="mt-8">
        <TabsList><TabsTrigger value="donations">Donation History</TabsTrigger><TabsTrigger value="saved">Saved Campaigns</TabsTrigger></TabsList>
        <TabsContent value="donations" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  { title: 'Help a Student Continue Her Education', amount: '₹2,500', date: 'Aug 28, 2026', status: 'Completed' },
                  { title: 'Emergency Medical Treatment for a Father', amount: '₹5,000', date: 'Aug 25, 2026', status: 'Completed' },
                  { title: 'Support a Family After a House Fire', amount: '₹1,000', date: 'Aug 20, 2026', status: 'Completed' },
                  { title: 'Provide School Supplies for Children', amount: '₹10,000', date: 'Aug 15, 2026', status: 'Completed' },
                  { title: 'Community Food Distribution Project', amount: '₹5,000', date: 'Aug 10, 2026', status: 'Completed' },
                  { title: 'Animal Rescue and Veterinary Care', amount: '₹1,000', date: 'Aug 5, 2026', status: 'Completed' },
                ].map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{d.date}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold">{d.amount}</p>
                      <span className="text-xs text-emerald-600 flex items-center gap-1 justify-end"><CheckCircle className="h-3 w-3" />{d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="saved" className="mt-4">
          <div className="rounded-xl border bg-muted/20 p-8 text-center">
            <Star className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">Save campaigns to follow their progress</p>
            <Button variant="outline" className="mt-3" onClick={() => setCurrentView('explore')}>Browse Campaigns</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FundraiserDashboard (unchanged)
// ─────────────────────────────────────────────────────────────

export function FundraiserDashboard() {
  const { setCurrentView } = useAppStore();

  const myCampaigns = [
    { title: 'Help a Student Continue Her Education', raised: 32500, goal: 50000, donors: 87, status: 'Published', views: 2340 },
    { title: 'Community Food Distribution Project', raised: 234000, goal: 600000, donors: 178, status: 'Published', views: 3120 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <button onClick={() => setCurrentView('home')} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fundraiser Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage your campaigns and track progress</p>
        </div>
        <Button onClick={() => useAppStore.setState({ currentView: 'create-campaign' })}>+ New Campaign</Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: DollarSign, label: 'Total Raised', value: '₹2.67L', color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Users, label: 'Total Donors', value: '265', color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
          { icon: FileText, label: 'Active Campaigns', value: '2', color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { icon: Clock, label: 'Pending Withdrawals', value: '1', color: 'text-amber-600', bg: 'bg-amber-100' },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-5"><div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}><s.icon className={`h-5 w-5 ${s.color}`} /></div><div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></div></CardContent></Card>
        ))}
      </div>

      {/* Campaigns */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">My Campaigns</h2>
        <div className="mt-4 space-y-3">
          {myCampaigns.map((c) => (
            <Card key={c.title} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{c.title}</h3>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{c.status}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{c.donors} donors</span>
                      <span>{c.views} views</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">{formatCurrency(c.raised)}</span>
                        <span className="text-xs text-muted-foreground">of {formatCurrency(c.goal)}</span>
                      </div>
                      <Progress value={Math.round((c.raised / c.goal) * 100)} className="mt-1 h-1.5 [&>div]:bg-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AdminDashboard (fully rewritten)
// ─────────────────────────────────────────────────────────────

const REVIEWER_ID = 'admin';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  view: AdminSubView;
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Overview', view: 'overview' },
  { icon: FileText, label: 'Campaigns', view: 'campaigns' },
  { icon: ClipboardList, label: 'Review Queue', view: 'review-queue' },
  { icon: CreditCard, label: 'Donations', view: 'donations' },
  { icon: Wallet, label: 'Withdrawals', view: 'withdrawals' },
  { icon: Users, label: 'Users', view: 'users' },
  { icon: Globe, label: 'Organizations', view: 'organizations' },
  { icon: Tag, label: 'Categories', view: 'categories' },
  { icon: UserCheck, label: 'Verification', view: 'verification' },
  { icon: Flag, label: 'Reports', view: 'reports' },
  { icon: Scale, label: 'Compliance', view: 'compliance' },
  { icon: Sparkles, label: 'Featured', view: 'featured' },
  { icon: TrendingUp, label: 'Analytics', view: 'analytics' },
  { icon: Lock, label: 'Payment Settings', view: 'payment-settings' },
  { icon: Settings, label: 'Platform Settings', view: 'platform-settings' },
  { icon: Bell, label: 'Audit Logs', view: 'audit-logs' },
  { icon: HandHeart, label: 'GraceFund Giving', view: 'give-contributions' },
];

const giveSidebarItems: SidebarItem[] = [
  { icon: Users, label: 'Contributions', view: 'give-contributions' },
  { icon: PieChart, label: 'Allocations', view: 'give-allocations' },
  { icon: BarChart3, label: 'Fund Balances', view: 'give-balances' },
  { icon: Eye, label: 'Transparency', view: 'give-transparency' },
  { icon: TrendingUp, label: 'Reports', view: 'give-reports' },
];

interface Stats {
  totalRaised: number;
  peopleHelped: number;
  activeCampaigns: number;
  countriesReached: number;
  pendingVerifications: number;
  underReviewCampaigns: number;
  highRiskCampaigns: number;
  openReports: number;
  pendingWithdrawals: number;
  suspendedUsers: number;
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <Skeleton className="mt-3 h-7 w-16" />
        <Skeleton className="mt-2 h-3 w-28" />
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-muted/20 p-8 text-center">
      <Icon className="mx-auto h-10 w-10 text-muted-foreground/30" />
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-4 w-4 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-7 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PlaceholderView({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <EmptyState icon={Icon} title={title} description="This section is under development. Check back soon." />
  );
}

// ── Overview ──────────────────────────────────────────────────

function OverviewView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    fetch('/api/stats', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setStats(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  const cards = [
    { icon: DollarSign, label: 'Total Raised', value: stats ? formatCompactCurrency(stats.totalRaised) : '—', sub: 'Across all campaigns', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: FileText, label: 'Active Campaigns', value: stats ? formatNumber(stats.activeCampaigns) : '—', sub: `${stats ? stats.underReviewCampaigns : '—'} under review`, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { icon: Users, label: 'People Helped', value: stats ? formatNumber(stats.peopleHelped) : '—', sub: 'Total unique donors', color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
    { icon: Globe, label: 'Countries Reached', value: stats ? formatNumber(stats.countriesReached) : '—', sub: 'Active regions', color: 'text-sky-600', bg: 'bg-sky-100' },
    { icon: AlertCircle, label: 'Open Reports', value: stats ? formatNumber(stats.openReports) : '—', sub: 'Needs attention', color: 'text-amber-600', bg: 'bg-amber-100' },
    { icon: Wallet, label: 'Pending Withdrawals', value: stats ? formatNumber(stats.pendingWithdrawals) : '—', sub: 'Awaiting processing', color: 'text-violet-600', bg: 'bg-violet-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Platform Overview</h2>
        <p className="text-sm text-muted-foreground">Key metrics and pending items at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : cards.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-bold">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Quick-action highlights */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats && (
          <>
            {stats.highRiskCampaigns > 0 && (
              <Card className="border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">{stats.highRiskCampaigns} High Risk Campaigns</p>
                    <p className="text-xs text-red-500/70">Review immediately</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-red-400 shrink-0" />
                </CardContent>
              </Card>
            )}
            {stats.pendingVerifications > 0 && (
              <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{stats.pendingVerifications} Pending Verifications</p>
                    <p className="text-xs text-amber-500/70">Identity checks awaiting review</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-amber-400 shrink-0" />
                </CardContent>
              </Card>
            )}
            {stats.suspendedUsers > 0 && (
              <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900/40 dark:bg-orange-950/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <Ban className="h-5 w-5 text-orange-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-400">{stats.suspendedUsers} Suspended Users</p>
                    <p className="text-xs text-orange-500/70">Accounts currently restricted</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-orange-400 shrink-0" />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Review Queue ─────────────────────────────────────────────

interface ReviewCampaign {
  id: string;
  title: string;
  slug: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  submittedAt: string;
  organizer: { id: string; name: string | null; avatarUrl: string | null; verificationLevel: string } | null;
  category: { id: string; name: string; slug: string } | null;
  _count: { donations: number; reports: number };
}

function ReviewQueueView() {
  const [campaigns, setCampaigns] = useState<ReviewCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCampaigns = useCallback(() => {
    const ac = new AbortController();
    setLoading(true);
    fetch('/api/reviews', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const handleAction = async (id: string, action: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      fetchCampaigns();
    } catch {
      /* noop */
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      submitted: { variant: 'outline', label: 'Submitted' },
      under_review: { variant: 'secondary', label: 'Under Review' },
    };
    const m = map[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={m.variant}>{m.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Campaign Review Queue</h2>
          <p className="text-sm text-muted-foreground">Campaigns awaiting admin review</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchCampaigns()} disabled={loading}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <ListSkeleton rows={3} />
      ) : campaigns.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No campaigns to review" description="All campaigns have been reviewed. Check back later." />
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{c.title}</h3>
                      {statusBadge(c.status)}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {c.organizer && <span>by {c.organizer.name || 'Unknown'}</span>}
                      {c.category && <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{c.category.name}</span>}
                      <span>{formatCurrency(c.goalAmount)} goal</span>
                      {c.submittedAt && <span>{new Date(c.submittedAt).toLocaleDateString()}</span>}
                    </div>
                    {c._count.reports > 0 && (
                      <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                        <Flag className="h-3 w-3" /> {c._count.reports} report{c._count.reports > 1 ? 's' : ''} filed
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      disabled={actionLoading === c.id}
                      onClick={() => handleAction(c.id, 'request_info')}
                    >
                      {actionLoading === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Info className="mr-1 h-3 w-3" />}
                      Request Info
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      disabled={actionLoading === c.id}
                      onClick={() => handleAction(c.id, 'reject')}
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                      disabled={actionLoading === c.id}
                      onClick={() => handleAction(c.id, 'approve')}
                    >
                      {actionLoading === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="mr-1 h-3 w-3" />}
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reports ───────────────────────────────────────────────────

interface ReportItem {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  riskLevel: string;
  adminNotes: string | null;
  createdAt: string;
  campaign: { id: string; title: string } | null;
  reporter: { id: string; name: string; email: string } | null;
  reviewer: { id: string; name: string } | null;
}

const reportStatusOptions = ['all', 'new', 'under_review', 'escalated', 'resolved', 'dismissed'];

function ReportsView() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReports = useCallback((status?: string) => {
    const ac = new AbortController();
    setLoading(true);
    const url = status && status !== 'all' ? `/api/reports?status=${status}` : '/api/reports';
    fetch(url, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  useEffect(() => { fetchReports(filter); }, [fetchReports, filter]);

  const handleStatus = async (id: string, status: string, adminNotes = '') => {
    setUpdatingId(id);
    try {
      await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
      fetchReports(filter);
    } catch {
      /* noop */
    } finally {
      setUpdatingId(null);
    }
  };

  const riskBadge = (level: string) => {
    const m: Record<string, { className: string; label: string }> = {
      low: { className: 'bg-emerald-100 text-emerald-700', label: 'Low' },
      medium: { className: 'bg-amber-100 text-amber-700', label: 'Medium' },
      high: { className: 'bg-red-100 text-red-700', label: 'High' },
    };
    const v = m[level] || m.medium;
    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v.className}`}>{v.label}</span>;
  };

  const statusBadge = (status: string) => {
    const m: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      new: { variant: 'destructive', label: 'New' },
      under_review: { variant: 'secondary', label: 'Under Review' },
      escalated: { variant: 'destructive', label: 'Escalated' },
      resolved: { variant: 'default', label: 'Resolved' },
      dismissed: { variant: 'outline', label: 'Dismissed' },
    };
    const v = m[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={v.variant}>{v.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Reports</h2>
        <p className="text-sm text-muted-foreground">User-submitted campaign reports</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {reportStatusOptions.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? 'default' : 'outline'}
            className="h-8 text-xs capitalize"
            onClick={() => setFilter(s)}
          >
            {s.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {loading ? (
        <ListSkeleton rows={3} />
      ) : reports.length === 0 ? (
        <EmptyState icon={Flag} title="No reports found" description={filter === 'all' ? 'No reports have been filed yet.' : `No reports with status "${filter.replace('_', ' ')}".`} />
      ) : (
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-3 pr-4">
            {reports.map((r) => (
              <Card key={r.id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{r.campaign?.title || 'Unknown Campaign'}</h3>
                        {statusBadge(r.status)}
                        {riskBadge(r.riskLevel)}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{r.reason.replace(/_/g, ' ')}</p>
                      {r.description && <p className="text-xs text-muted-foreground mt-1">{r.description}</p>}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>by {r.reporter?.name || 'Unknown'}</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      {r.adminNotes && (
                        <div className="rounded-md bg-muted/50 p-2 mt-1">
                          <p className="text-xs text-muted-foreground">Admin notes: {r.adminNotes}</p>
                        </div>
                      )}
                    </div>
                    {r.status === 'new' || r.status === 'under_review' || r.status === 'escalated' ? (
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          disabled={updatingId === r.id}
                          onClick={() => handleStatus(r.id, 'dismissed', 'Reviewed — no action needed')}
                        >
                          {updatingId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Dismiss'}
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                          disabled={updatingId === r.id}
                          onClick={() => handleStatus(r.id, 'resolved', 'Resolved by admin')}
                        >
                          {updatingId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Resolve'}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

// ── Compliance ────────────────────────────────────────────────

interface RiskEvent {
  id: string;
  eventType: string;
  severity: string;
  description: string;
  createdAt: string;
  resolvedAt: string | null;
  user: { id: string; name: string; email: string } | null;
  campaign: { id: string; title: string; slug: string } | null;
  resolver: { id: string; name: string } | null;
}

function ComplianceView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRisks, setLoadingRisks] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    fetch('/api/stats', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setStats(data); })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
    return () => ac.abort();
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetch('/api/risk-events?resolved=false', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRiskEvents(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingRisks(false));
    return () => ac.abort();
  }, []);

  const severityBadge = (s: string) => {
    const m: Record<string, { className: string; label: string }> = {
      low: { className: 'bg-emerald-100 text-emerald-700', label: 'Low' },
      medium: { className: 'bg-amber-100 text-amber-700', label: 'Medium' },
      high: { className: 'bg-red-100 text-red-700', label: 'High' },
    };
    const v = m[s] || m.medium;
    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v.className}`}>{v.label}</span>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Compliance & Risk</h2>
        <p className="text-sm text-muted-foreground">Monitor platform integrity and risk indicators</p>
      </div>

      {/* Compliance stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : (
              <>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">High Risk Campaigns</p>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-red-600">{stats?.highRiskCampaigns ?? '—'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Open Reports</p>
                      <Flag className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-amber-600">{stats?.openReports ?? '—'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Suspended Users</p>
                      <Ban className="h-4 w-4 text-orange-500" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-orange-600">{stats?.suspendedUsers ?? '—'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Pending Verifications</p>
                      <UserCheck className="h-4 w-4 text-sky-500" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">{stats?.pendingVerifications ?? '—'}</p>
                  </CardContent>
                </Card>
              </>
            )}
      </div>

      {/* Unresolved risk events */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Unresolved Risk Events</h3>
        {loadingRisks ? (
          <ListSkeleton rows={3} />
        ) : riskEvents.length === 0 ? (
          <EmptyState icon={Shield} title="No unresolved risk events" description="All clear! No active risk events detected." />
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-2 pr-4">
              {riskEvents.map((re) => (
                <Card key={re.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${re.severity === 'high' ? 'text-red-500' : re.severity === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium capitalize">{re.eventType.replace(/_/g, ' ')}</span>
                        {severityBadge(re.severity)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{re.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                        {re.user && <span>User: {re.user.name}</span>}
                        {re.campaign && <span>Campaign: {re.campaign.title}</span>}
                        <span>{new Date(re.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

// ── Verification ──────────────────────────────────────────────

interface VerificationItem {
  id: string;
  userId: string;
  level: string;
  status: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
  reviewer: { id: string; name: string } | null;
}

function VerificationView() {
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchVerifications = useCallback(() => {
    const ac = new AbortController();
    setLoading(true);
    fetch('/api/verifications', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setVerifications(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  useEffect(() => { fetchVerifications(); }, [fetchVerifications]);

  const handleAction = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/verifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchVerifications();
    } catch {
      /* noop */
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    const m: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      documents_submitted: { variant: 'outline', label: 'Docs Submitted' },
      under_review: { variant: 'secondary', label: 'Under Review' },
      verified: { variant: 'default', label: 'Verified' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      expired: { variant: 'outline', label: 'Expired' },
      suspended: { variant: 'destructive', label: 'Suspended' },
      not_started: { variant: 'outline', label: 'Not Started' },
    };
    const v = m[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={v.variant}>{v.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Verification Requests</h2>
          <p className="text-sm text-muted-foreground">Review identity and organization verification requests</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchVerifications()} disabled={loading}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <ListSkeleton rows={4} />
      ) : verifications.length === 0 ? (
        <EmptyState icon={UserCheck} title="No verification requests" description="No pending or in-progress verifications." />
      ) : (
        <ScrollArea className="max-h-96">
          <div className="space-y-3 pr-4">
            {verifications.map((v) => (
              <Card key={v.id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{v.user?.name || 'Unknown User'}</h3>
                        {statusBadge(v.status)}
                        <Badge variant="outline" className="capitalize">{v.level}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{v.user?.email}</p>
                      {v.submittedAt && (
                        <p className="text-xs text-muted-foreground">Submitted {new Date(v.submittedAt).toLocaleDateString()}</p>
                      )}
                      {v.rejectionReason && (
                        <p className="text-xs text-red-500">Rejected: {v.rejectionReason}</p>
                      )}
                    </div>
                    {(v.status === 'pending' || v.status === 'documents_submitted' || v.status === 'under_review') && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          disabled={actionLoading === v.id}
                          onClick={() => handleAction(v.id, 'rejected')}
                        >
                          {actionLoading === v.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Reject'}
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                          disabled={actionLoading === v.id}
                          onClick={() => handleAction(v.id, 'verified')}
                        >
                          {actionLoading === v.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Approve'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

// ── Withdrawals ───────────────────────────────────────────────

interface WithdrawalItem {
  id: string;
  amount: number;
  status: string;
  rejectionReason: string | null;
  reviewNotes: string | null;
  paymentReference: string | null;
  requestedAt: string;
  reviewedAt: string | null;
  paidAt: string | null;
  campaign: {
    id: string;
    title: string;
    slug: string;
    goalAmount: number;
    raisedAmount: number;
  } | null;
  requester: { id: string; name: string; email: string; avatarUrl: string | null } | null;
  reviewer: { id: string; name: string } | null;
}

const withdrawalStatusOptions = ['all', 'requested', 'under_review', 'approved', 'processing', 'paid', 'rejected', 'suspended'];

function WithdrawalsView() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchWithdrawals = useCallback((status?: string) => {
    const ac = new AbortController();
    setLoading(true);
    const url = status && status !== 'all' ? `/api/withdrawals?status=${status}` : '/api/withdrawals';
    fetch(url, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setWithdrawals(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  useEffect(() => { fetchWithdrawals(filter); }, [fetchWithdrawals, filter]);

  const handleAction = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/withdrawals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchWithdrawals(filter);
    } catch {
      /* noop */
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBadge = (status: string) => {
    const m: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      requested: { variant: 'secondary', label: 'Requested' },
      under_review: { variant: 'outline', label: 'Under Review' },
      documents_required: { variant: 'outline', label: 'Docs Required' },
      approved: { variant: 'default', label: 'Approved' },
      processing: { variant: 'secondary', label: 'Processing' },
      paid: { variant: 'default', label: 'Paid' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      suspended: { variant: 'destructive', label: 'Suspended' },
    };
    const v = m[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={v.variant}>{v.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Withdrawal Requests</h2>
        <p className="text-sm text-muted-foreground">Manage fund withdrawal requests from campaigns</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {withdrawalStatusOptions.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? 'default' : 'outline'}
            className="h-8 text-xs capitalize"
            onClick={() => setFilter(s)}
          >
            {s.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {loading ? (
        <ListSkeleton rows={3} />
      ) : withdrawals.length === 0 ? (
        <EmptyState icon={Wallet} title="No withdrawal requests" description={filter === 'all' ? 'No withdrawal requests have been made yet.' : `No withdrawals with status "${filter.replace('_', ' ')}".`} />
      ) : (
        <ScrollArea className="max-h-96">
          <div className="space-y-3 pr-4">
            {withdrawals.map((w) => (
              <Card key={w.id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{w.campaign?.title || 'Unknown Campaign'}</h3>
                        {statusBadge(w.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{formatCurrency(w.amount)}</span>
                        {w.requester && <span>by {w.requester.name}</span>}
                        <span>Requested {new Date(w.requestedAt).toLocaleDateString()}</span>
                      </div>
                      {w.campaign && (
                        <p className="text-xs text-muted-foreground">
                          Campaign: {formatCurrency(w.campaign.raisedAmount)} raised of {formatCurrency(w.campaign.goalAmount)} goal
                        </p>
                      )}
                      {w.rejectionReason && (
                        <p className="text-xs text-red-500">Rejected: {w.rejectionReason}</p>
                      )}
                      {w.reviewNotes && (
                        <p className="text-xs text-muted-foreground">Notes: {w.reviewNotes}</p>
                      )}
                    </div>
                    {(w.status === 'requested' || w.status === 'under_review') && (
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          disabled={updatingId === w.id}
                          onClick={() => handleAction(w.id, 'rejected')}
                        >
                          {updatingId === w.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Reject'}
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                          disabled={updatingId === w.id}
                          onClick={() => handleAction(w.id, 'approved')}
                        >
                          {updatingId === w.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Approve'}
                        </Button>
                      </div>
                    )}
                    {w.status === 'approved' && (
                      <Button
                        size="sm"
                        className="h-8 text-xs bg-sky-600 hover:bg-sky-700"
                        disabled={updatingId === w.id}
                        onClick={() => handleAction(w.id, 'paid')}
                      >
                        {updatingId === w.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Mark Paid'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

// ── Audit Logs ────────────────────────────────────────────────

interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  previousValue: string | null;
  newValue: string | null;
  metadata: string | null;
  createdAt: string;
  admin: { id: string; name: string; email: string } | null;
}

function AuditLogsView() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    fetch('/api/audit-logs?limit=100', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  const actionIcon = (action: string) => {
    if (action.includes('approve') || action.includes('verify') || action.includes('publish')) return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    if (action.includes('reject') || action.includes('ban') || action.includes('suspend')) return <XCircle className="h-4 w-4 text-red-500" />;
    if (action.includes('update') || action.includes('edit')) return <Settings className="h-4 w-4 text-sky-500" />;
    if (action.includes('create')) return <CircleDot className="h-4 w-4 text-violet-500" />;
    if (action.includes('withdrawal')) return <Wallet className="h-4 w-4 text-amber-500" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Audit Logs</h2>
        <p className="text-sm text-muted-foreground">Track all administrative actions on the platform</p>
      </div>

      {loading ? (
        <ListSkeleton rows={6} />
      ) : logs.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No audit logs" description="No administrative actions have been recorded yet." />
      ) : (
        <Card className="overflow-hidden">
          <ScrollArea className="max-h-[600px]">
            <div className="divide-y">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors">
                  <div className="mt-0.5 shrink-0">{actionIcon(log.action)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium capitalize">{log.action.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span className="capitalize">{log.entityType.replace(/_/g, ' ')}</span>
                      {log.admin && <span> &middot; by {log.admin.name}</span>}
                      {log.entityId && <span> &middot; ID: {log.entityId.slice(0, 8)}...</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}

// ── Sub-view router ───────────────────────────────────────────

function AdminContent({ view }: { view: AdminSubView }) {
  switch (view) {
    case 'overview':
      return <OverviewView />;
    case 'review-queue':
      return <ReviewQueueView />;
    case 'reports':
      return <ReportsView />;
    case 'compliance':
      return <ComplianceView />;
    case 'verification':
      return <VerificationView />;
    case 'withdrawals':
      return <WithdrawalsView />;
    case 'audit-logs':
      return <AuditLogsView />;
    case 'give-contributions':
      return <GiveContributionsView />;
    case 'give-allocations':
      return <GiveAllocationsView />;
    case 'give-balances':
      return <GiveBalancesView />;
    case 'give-transparency':
      return <GiveTransparencyView />;
    case 'give-reports':
      return <GiveReportsView />;
    case 'campaigns':
      return <PlaceholderView title="Campaigns Management" icon={FileText} />;
    case 'donations':
      return <PlaceholderView title="Donations Management" icon={CreditCard} />;
    case 'users':
      return <PlaceholderView title="Users Management" icon={Users} />;
    case 'organizations':
      return <PlaceholderView title="Organizations Management" icon={Globe} />;
    case 'categories':
      return <PlaceholderView title="Categories Management" icon={Tag} />;
    case 'featured':
      return <PlaceholderView title="Featured Campaigns" icon={Sparkles} />;
    case 'analytics':
      return <PlaceholderView title="Analytics" icon={TrendingUp} />;
    case 'payment-settings':
      return <PlaceholderView title="Payment Settings" icon={Lock} />;
    case 'platform-settings':
      return <PlaceholderView title="Platform Settings" icon={Settings} />;
    default:
      return null;
  }
}

// ── Mobile bottom nav (visible < lg) ──────────────────────────

function MobileNav({ current, onChange }: { current: AdminSubView; onChange: (v: AdminSubView) => void }) {
  const mobileItems = sidebarItems.slice(0, 5); // Overview, Campaigns, Review Queue, Donations, Withdrawals

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
      <nav className="flex items-center justify-around py-1">
        {mobileItems.map((item) => {
          const isActive = current === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChange(item.view)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              <span className="truncate max-w-[56px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ── Main Admin Dashboard ──────────────────────────────────────

export function AdminDashboard() {
  const { adminSubView, setAdminSubView, setCurrentView, showMobileMenu, setShowMobileMenu } = useAppStore();

  const handleNav = (view: AdminSubView) => {
    setAdminSubView(view);
    setShowMobileMenu(false);
  };

  const viewLabels: Record<AdminSubView, string> = {
    overview: 'Overview',
    campaigns: 'Campaigns',
    'review-queue': 'Review Queue',
    donations: 'Donations',
    withdrawals: 'Withdrawals',
    users: 'Users',
    organizations: 'Organizations',
    categories: 'Categories',
    verification: 'Verification',
    reports: 'Reports',
    compliance: 'Compliance',
    featured: 'Featured',
    analytics: 'Analytics',
    'payment-settings': 'Payment Settings',
    'platform-settings': 'Platform Settings',
    'audit-logs': 'Audit Logs',
    'give-contributions': 'Contributions',
    'give-allocations': 'Allocations',
    'give-balances': 'Fund Balances',
    'give-transparency': 'Transparency',
    'give-reports': 'Reports',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 pb-20 lg:pb-6">
      <button
        onClick={() => setCurrentView('home')}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>

      {/* Mobile header with hamburger */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">{viewLabels[adminSubView]}</p>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="mb-6 lg:hidden">
        <div className="flex flex-wrap gap-1.5">
          {sidebarItems.map(function (item) {
            const isActive = adminSubView === item.view;
            return (
              <Button
                key={item.view}
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                className="h-8 text-xs"
                onClick={function() { handleNav(item.view); }}
              >
                <item.icon className="mr-1.5 h-3.5 w-3.5" />
                {item.label}
              </Button>
            );
          })}
          {adminSubView.startsWith('give-') && giveSidebarItems.map(function (item) {
            const isActive = adminSubView === item.view;
            return (
              <Button
                key={item.view}
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                className="h-8 text-xs"
                onClick={function() { handleNav(item.view); }}
              >
                <item.icon className="mr-1.5 h-3.5 w-3.5" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar — hidden on mobile, visible on lg+ */}
        <div className="hidden lg:block lg:w-56 shrink-0">
          <div className="sticky top-6 rounded-xl border bg-card p-2">
            <h1 className="text-lg font-bold p-3 pb-2">Admin Panel</h1>
            <ScrollArea className="max-h-[calc(100vh-200px)]">
              <nav className="space-y-0.5 pr-2">
                {sidebarItems.map((item) => {
                  const isActive = adminSubView === item.view;
                  const isGiveSection = item.view === 'give-contributions';
                  const isInGive = adminSubView.startsWith('give-');
                  return (
                    <div key={item.view}>
                      <button
                        onClick={() => handleNav(item.view)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive || (isGiveSection && isInGive)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                      {isGiveSection && isInGive && (
                        <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-primary/20 pl-3">
                          {giveSidebarItems.map((sub) => {
                            const subActive = adminSubView === sub.view;
                            return (
                              <button
                                key={sub.view}
                                onClick={() => handleNav(sub.view)}
                                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                                  subActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                              >
                                <sub.icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{sub.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <h1 className="hidden lg:block text-2xl font-bold">{viewLabels[adminSubView]}</h1>
          <div className="mt-4 lg:mt-6">
            <AdminContent view={adminSubView} />
          </div>
        </div>
      </div>

      <MobileNav current={adminSubView} onChange={handleNav} />
    </div>
  );
}
