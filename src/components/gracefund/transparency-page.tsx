'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, TrendingUp, Users, PieChart, RefreshCw } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/currency';
import { PURPOSE_LABELS } from '@/lib/give-constants';

const PERIODS = [
  { id: 'this_month', label: 'This Month' },
  { id: 'last_3_months', label: 'Last 3 Months' },
  { id: 'this_year', label: 'This Year' },
  { id: 'all', label: 'All Time' },
] as const;

interface TransparencyData {
  period: string;
  totalReceived: number;
  totalAllocated: number;
  totalRemaining: number;
  totalContributions: number;
  programsSupported: number;
  breakdown: Record<string, { amount: number; count: number; label: string }>;
}

export function TransparencyPage() {
  const { setCurrentView } = useAppStore();
  const [period, setPeriod] = useState<string>('all');
  const [data, setData] = useState<TransparencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(function () {
    let cancelled = false;
    fetch('/api/transparency?period=' + period)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(function () { if (!cancelled) setLoading(false); });
    return function () { cancelled = true; };
  }, [period, refreshKey]);

  const handleRefresh = function () { setLoading(true); setRefreshKey(function (k) { return k + 1; }); };

  const sortedBreakdown = data
    ? Object.entries(data.breakdown).sort((a, b) => b[1].amount - a[1].amount)
    : [];

  const totalReceived = data?.totalReceived || 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Back */}
      <button
        onClick={() => setCurrentView('home')}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Eye className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Where GraceFund Funds Go</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Transparent records of contributions and how they are allocated.
        </p>
      </div>

      {/* Period filter */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {PERIODS.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant={period === p.id ? 'default' : 'outline'}
            className="h-8 text-xs"
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-xs"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`mr-1 h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Top stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Contributions Received</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">{loading ? '...' : formatCurrency(totalReceived)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {loading ? '' : `${formatNumber(data?.totalContributions || 0)} contributions`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Allocated to Community Support</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <PieChart className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">{loading ? '...' : formatCurrency(data?.totalAllocated || 0)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {loading ? '' : `${totalReceived > 0 ? Math.round(((data?.totalAllocated || 0) / totalReceived) * 100) : 0}% of funds`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Amount Remaining</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">{loading ? '...' : formatCurrency(data?.totalRemaining || 0)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {loading ? '' : 'Available for allocation'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Programs Supported</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                <Users className="h-4 w-4 text-violet-600" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">{loading ? '...' : formatNumber(data?.programsSupported || 0)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {loading ? '' : 'Completed allocations'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Purpose breakdown */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contributions by Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            ) : sortedBreakdown.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground">
                No contributions recorded yet for this period.
              </p>
            ) : (
              <div className="space-y-3">
                {sortedBreakdown.map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: totalReceived > 0 ? `${Math.max(4, (val.amount / totalReceived) * 200)}px` : '4px',
                          backgroundColor: key === 'operations' ? 'var(--gold)' : 'hsl(var(--primary))',
                          opacity: 0.8,
                        }}
                      />
                      <span className="text-sm font-medium">{val.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{formatCurrency(val.amount)}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({totalReceived > 0 ? Math.round((val.amount / totalReceived) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legal note */}
      <p className="mt-6 text-center text-[11px] text-muted-foreground/60 leading-relaxed">
        This transparency page shows aggregated information only. Beneficiary identities, private documents,
        bank details and internal investigation information are never exposed publicly.
        Financial figures are derived from actual database records.
      </p>
    </div>
  );
}
