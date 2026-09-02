'use client';

import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, DollarSign, FileText, Users, TrendingUp, Eye, Clock, AlertCircle, CheckCircle, BarChart3, Settings, Shield, Star, Flag, CreditCard, Globe, Bell, Lock, Scale } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/currency';

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

export function AdminDashboard() {
  const { setCurrentView } = useAppStore();

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: FileText, label: 'Campaigns' },
    { icon: CreditCard, label: 'Donations' },
    { icon: Users, label: 'Users' },
    { icon: Globe, label: 'Organizations' },
    { icon: DollarSign, label: 'Withdrawals' },
    { icon: Settings, label: 'Categories' },
    { icon: Shield, label: 'Verification' },
    { icon: Flag, label: 'Reports' },
    { icon: Star, label: 'Featured' },
    { icon: Scale, label: 'Compliance' },
    { icon: Lock, label: 'Payment Settings' },
    { icon: Settings, label: 'Platform Settings' },
    { icon: Bell, label: 'Audit Logs' },
  ];

  const pendingCampaigns = [
    { title: 'Help Build a Well in Rural Village', category: 'Community', date: 'Sep 1, 2026' },
    { title: 'Support After-School Tutoring Program', category: 'Education', date: 'Aug 31, 2026' },
    { title: 'Medical Support for Elderly Widow', category: 'Medical & Health', date: 'Aug 30, 2026' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <button onClick={() => setCurrentView('home')} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <h1 className="text-2xl font-bold lg:hidden mb-4">Admin</h1>
          <div className="rounded-xl border bg-card p-2 lg:block">
            <h1 className="hidden lg:block text-lg font-bold p-3 pb-2">Admin Panel</h1>
            <nav className="space-y-0.5">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    item.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <h1 className="hidden lg:block text-2xl font-bold">Dashboard</h1>

          {/* Stats */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: FileText, label: 'Total Campaigns', value: '9', change: '+2 this week' },
              { icon: DollarSign, label: 'Total Raised', value: '₹28.11L', change: '+₹45K today' },
              { icon: Users, label: 'Total Users', value: '9', change: '+3 this week' },
              { icon: AlertCircle, label: 'Pending Reviews', value: '3', change: 'Needs attention' },
            ].map((s) => (
              <Card key={s.label}><CardContent className="p-5"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">{s.label}</p><s.icon className="h-4 w-4 text-muted-foreground" /></div><p className="mt-2 text-2xl font-bold">{s.value}</p><p className="mt-1 text-xs text-emerald-600">{s.change}</p></CardContent></Card>
            ))}
          </div>

          {/* Pending Reviews */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Pending Campaign Reviews</h2>
            <Card className="mt-4 overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y">
                  {pendingCampaigns.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.category} &middot; {c.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-xs">Review</Button>
                        <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
