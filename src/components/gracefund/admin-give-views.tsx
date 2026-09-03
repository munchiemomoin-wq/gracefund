'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HandHeart, DollarSign, TrendingUp, RefreshCw, Loader2,
  Users, PieChart, BarChart3, Eye,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/currency';
import { PURPOSE_LABELS, ALLOCATION_STATUSES, CONTRIBUTION_PURPOSES } from '@/lib/give-constants';

interface ContributionRow {
  id: string;
  amount: number;
  paymentStatus: string;
  purpose: string;
  donorName: string;
  createdAt: string;
  anonymous: boolean;
}

interface AllocationRow {
  id: string;
  amount: number;
  allocationStatus: string;
  purpose: string;
  beneficiaryOrProgramReference: string;
  createdAt: string;
  approver: { name: string } | null;
  notes: string;
}

function StatCard({ icon: Icon, label, value, sub, color, bg }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; sub: string; color: string; bg: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{label}</p>
          <div className={"flex h-8 w-8 items-center justify-center rounded-lg " + bg}>
            <Icon className={"h-4 w-4 " + color} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

// ── Contributions View ─────────────────────────────────────────

export function GiveContributionsView() {
  const [contributions, setContributions] = useState<ContributionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(function () {
    let cancelled = false;
    fetch('/api/admin/give/contributions?page=' + page + '&limit=15')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!cancelled) {
          setContributions(data.contributions || []);
          setTotal(data.total || 0);
          setLoading(false);
        }
      })
      .catch(function () {
        if (!cancelled) setLoading(false);
      });
    return function () { cancelled = true; };
  }, [page, refreshKey]);

  const handleRefresh = function () { setLoading(true); setRefreshKey(function (k) { return k + 1; }); };

  const statusBadge = function (status: string) {
    const map: Record<string, string> = {
      succeeded: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
      refunded: 'bg-blue-100 text-blue-700',
    };
    const labelMap: Record<string, string> = {
      succeeded: 'Succeeded', pending: 'Pending', failed: 'Failed',
      cancelled: 'Cancelled', refunded: 'Refunded',
    };
    const cls = map[status] || 'bg-muted text-muted-foreground';
    const lbl = labelMap[status] || status;
    return <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + cls}>{lbl}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">GraceFund Contributions</h2>
          <p className="text-sm text-muted-foreground">Direct contributions to GraceFund from supporters</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={"mr-1.5 h-3.5 w-3.5 " + (loading ? 'animate-spin' : '')} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y">
              {Array.from({ length: 5 }).map(function (_, i) {
                return (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-7 w-20 rounded-md" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : contributions.length === 0 ? (
        <div className="rounded-xl border bg-muted/20 p-8 text-center">
          <HandHeart className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <p className="mt-3 text-sm font-medium">No contributions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Contributions made through Give to GraceFund will appear here.</p>
        </div>
      ) : (
        <>
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-2 pr-4">
              {contributions.map(function (c) {
                return (
                  <Card key={c.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold">{formatCurrency(c.amount)}</span>
                            {statusBadge(c.paymentStatus)}
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{PURPOSE_LABELS[c.purpose] || c.purpose}</span>
                            {c.anonymous && <span className="text-xs text-muted-foreground">Anonymous</span>}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span>by {c.donorName || 'Unknown'}</span>
                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                            <span>ID: {c.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{total} total contributions</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs" disabled={page <= 1} onClick={function () { setLoading(true); setPage(page - 1); }}>Previous</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" disabled={contributions.length < 15} onClick={function () { setLoading(true); setPage(page + 1); }}>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Allocations View ───────────────────────────────────────────

export function GiveAllocationsView() {
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [contributions, setContributions] = useState<ContributionRow[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [form, setForm] = useState({ contributionId: '', purpose: '', amount: '', beneficiaryOrProgramReference: '', notes: '' });

  useEffect(function () {
    let cancelled = false;
    fetch('/api/admin/give/allocations?page=' + page + '&limit=15')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!cancelled) {
          setAllocations(data.allocations || []);
          setTotal(data.total || 0);
          setLoading(false);
        }
      })
      .catch(function () {
        if (!cancelled) setLoading(false);
      });
    return function () { cancelled = true; };
  }, [page, refreshKey]);

  const handleRefresh = function () { setLoading(true); setRefreshKey(function (k) { return k + 1; }); };

  const handleCreate = async function () {
    setCreateLoading(true);
    try {
      const res = await fetch('/api/admin/give/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contributionId: form.contributionId, purpose: form.purpose,
          amount: form.amount, beneficiaryOrProgramReference: form.beneficiaryOrProgramReference,
          notes: form.notes,
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setForm({ contributionId: '', purpose: '', amount: '', beneficiaryOrProgramReference: '', notes: '' });
        handleRefresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create allocation');
      }
    } catch { alert('Network error'); }
    finally { setCreateLoading(false); }
  };

  const handleStatusUpdate = async function (id: string, status: string) {
    try {
      await fetch('/api/admin/give/allocations/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocationStatus: status }),
      });
      handleRefresh();
    } catch { /* noop */ }
  };

  const openCreate = async function () {
    const res = await fetch('/api/admin/give/contributions?limit=100&status=succeeded');
    const data = await res.json();
    setContributions(data.contributions || []);
    setShowCreate(true);
  };

  const allocStatusBadge = function (status: string) {
    const map: Record<string, string> = {
      planned: 'bg-gray-100 text-gray-700', approved: 'bg-blue-100 text-blue-700',
      allocated: 'bg-indigo-100 text-indigo-700', disbursed: 'bg-amber-100 text-amber-700',
      completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700',
    };
    const labels: Record<string, string> = {
      planned: 'Planned', approved: 'Approved', allocated: 'Allocated',
      disbursed: 'Disbursed', completed: 'Completed', cancelled: 'Cancelled',
    };
    const cls = map[status] || 'bg-muted text-muted-foreground';
    const lbl = labels[status] || status;
    return <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + cls}>{lbl}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Fund Allocations</h2>
          <p className="text-sm text-muted-foreground">Record and manage how GraceFund contributions are allocated</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={"mr-1.5 h-3.5 w-3.5 " + (loading ? 'animate-spin' : '')} />
            Refresh
          </Button>
          <Button size="sm" onClick={openCreate}>+ New Allocation</Button>
        </div>
      </div>

      {showCreate && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="text-base">Create Allocation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Contribution *</Label>
              <select className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.contributionId} onChange={function (e) { setForm({ ...form, contributionId: e.target.value }); }}>
                <option value="">Select a contribution...</option>
                {contributions.map(function (c) {
                  return <option key={c.id} value={c.id}>{c.donorName} - {formatCurrency(c.amount)} ({PURPOSE_LABELS[c.purpose] || c.purpose}) [{c.id.slice(0, 8)}...]</option>;
                })}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Purpose *</Label>
                <select className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.purpose} onChange={function (e) { setForm({ ...form, purpose: e.target.value }); }}>
                  <option value="">Select purpose...</option>
                  {CONTRIBUTION_PURPOSES.map(function (p) {
                    return <option key={p.id} value={p.id}>{p.label}</option>;
                  })}
                </select>
              </div>
              <div>
                <Label>Amount (INR) *</Label>
                <Input type="number" placeholder="0" value={form.amount} onChange={function (e) { setForm({ ...form, amount: e.target.value }); }} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Beneficiary / Program Reference</Label>
              <Input placeholder="e.g., Food distribution program - Chennai" value={form.beneficiaryOrProgramReference} onChange={function (e) { setForm({ ...form, beneficiaryOrProgramReference: e.target.value }); }} className="mt-1.5" />
            </div>
            <div>
              <Label>Notes</Label>
              <Input placeholder="Internal notes..." value={form.notes} onChange={function (e) { setForm({ ...form, notes: e.target.value }); }} className="mt-1.5" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreate} disabled={createLoading}>
                {createLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Create Allocation
              </Button>
              <Button size="sm" variant="outline" onClick={function () { setShowCreate(false); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card className="overflow-hidden"><CardContent className="p-0"><div className="divide-y">{Array.from({ length: 4 }).map(function (_, i) {
          return <div key={i} className="flex items-center gap-4 p-4"><Skeleton className="h-4 w-4 rounded" /><div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div><Skeleton className="h-7 w-20 rounded-md" /></div>;
        })}</div></CardContent></Card>
      ) : allocations.length === 0 ? (
        <div className="rounded-xl border bg-muted/20 p-8 text-center">
          <PieChart className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <p className="mt-3 text-sm font-medium">No allocations yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Create an allocation to distribute contributed funds.</p>
        </div>
      ) : (
        <>
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-2 pr-4">
              {allocations.map(function (a) {
                return (
                  <Card key={a.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold">{formatCurrency(a.amount)}</span>
                            {allocStatusBadge(a.allocationStatus)}
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{PURPOSE_LABELS[a.purpose] || a.purpose}</span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {a.beneficiaryOrProgramReference && <span>Ref: {a.beneficiaryOrProgramReference}</span>}
                            <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                            {a.approver && <span>by {a.approver.name}</span>}
                          </div>
                          {a.notes && <p className="mt-1 text-xs text-muted-foreground italic">{a.notes}</p>}
                        </div>
                        {a.allocationStatus !== 'completed' && a.allocationStatus !== 'cancelled' && (
                          <div className="flex flex-wrap gap-1.5 shrink-0">
                            {a.allocationStatus === 'planned' && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={function () { handleStatusUpdate(a.id, 'approved'); }}>Approve</Button>}
                            {a.allocationStatus === 'approved' && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={function () { handleStatusUpdate(a.id, 'allocated'); }}>Allocate</Button>}
                            {a.allocationStatus === 'allocated' && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={function () { handleStatusUpdate(a.id, 'disbursed'); }}>Disburse</Button>}
                            {a.allocationStatus === 'disbursed' && <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={function () { handleStatusUpdate(a.id, 'completed'); }}>Complete</Button>}
                            <Button size="sm" variant="outline" className="h-7 text-xs text-red-600" onClick={function () { handleStatusUpdate(a.id, 'cancelled'); }}>Cancel</Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{total} total allocations</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs" disabled={page <= 1} onClick={function () { setLoading(true); setPage(page - 1); }}>Previous</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" disabled={allocations.length < 15} onClick={function () { setLoading(true); setPage(page + 1); }}>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Fund Balances View ─────────────────────────────────────────

interface GiveStats {
  totalReceived: number;
  totalContributions: number;
  allocatedAmount: number;
  disbursedAmount: number;
  availableBalance: number;
  operationsTotal: number;
  communityTotal: number;
  purposeBreakdown: Array<{ purpose: string; amount: number; count: number }>;
}

export function GiveBalancesView() {
  const [stats, setStats] = useState<GiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    fetch('/api/admin/give/stats')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && !data.error) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch(function () { setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map(function (_, i) {
          return <Card key={i}><CardContent className="p-5"><Skeleton className="h-3 w-20" /><Skeleton className="mt-3 h-7 w-24" /><Skeleton className="mt-2 h-3 w-28" /></CardContent></Card>;
        })}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-sm text-muted-foreground">Failed to load fund balance data.</p>;
  }

  const cards = [
    { icon: DollarSign, label: 'Total GraceFund Contributions', value: formatCurrency(stats.totalReceived), sub: formatNumber(stats.totalContributions) + ' contributions', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: PieChart, label: 'Total Allocated', value: formatCurrency(stats.allocatedAmount), sub: 'Across all purposes', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: TrendingUp, label: 'Total Disbursed', value: formatCurrency(stats.disbursedAmount), sub: 'Funds released', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { icon: BarChart3, label: 'Available Balance', value: formatCurrency(stats.availableBalance), sub: 'Unallocated funds', color: 'text-amber-600', bg: 'bg-amber-100' },
    { icon: HandHeart, label: 'Community Support', value: formatCurrency(stats.communityTotal), sub: 'Direct community impact', color: 'text-violet-600', bg: 'bg-violet-100' },
    { icon: DollarSign, label: 'Operations', value: formatCurrency(stats.operationsTotal), sub: 'Platform operating expenses', color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Fund Balances</h2>
        <p className="text-sm text-muted-foreground">Overview of GraceFund giving finances</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(function (s) {
          return <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} sub={s.sub} color={s.color} bg={s.bg} />;
        })}
      </div>
      {stats.purposeBreakdown && stats.purposeBreakdown.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Contributions by Purpose</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.purposeBreakdown.map(function (p) {
                return (
                  <div key={p.purpose} className="flex items-center justify-between py-1.5 border-b last:border-0">
                    <span className="text-sm">{PURPOSE_LABELS[p.purpose] || p.purpose}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{p.count} contributions</span>
                      <span className="text-sm font-semibold">{formatCurrency(p.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Admin Transparency View ─────────────────────────────────────

export function GiveTransparencyView() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Transparency</h2>
        <p className="text-sm text-muted-foreground">Internal view of public transparency data</p>
      </div>
      <div className="rounded-xl border bg-muted/20 p-8 text-center">
        <Eye className="mx-auto h-10 w-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm font-medium">Transparency Dashboard</p>
        <p className="mt-1 text-xs text-muted-foreground">The public transparency page is available on the main site. All data shown there comes from actual database records.</p>
      </div>
    </div>
  );
}

// ── Reports View ────────────────────────────────────────────────

export function GiveReportsView() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">GraceFund Giving Reports</h2>
        <p className="text-sm text-muted-foreground">Financial reports and exportable data for GraceFund contributions and allocations</p>
      </div>
      <div className="rounded-xl border bg-muted/20 p-8 text-center">
        <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm font-medium">Reports Under Development</p>
        <p className="mt-1 text-xs text-muted-foreground">Detailed financial reports, CSV exports, and accounting summaries will be available here.</p>
      </div>
    </div>
  );
}
