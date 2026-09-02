'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/store/app-store';
import { CampaignCard } from './campaign-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface Campaign {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  coverImage: string | null;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  donorCount: number;
  isUrgent: boolean;
  verificationLevel: string;
  endDate: string | null;
 category?: { name: string; icon: string; slug: string } | null;
  organizer?: { name: string | null } | null;
  _count?: { donations: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

const typeFilters = [
  { key: 'all', label: 'All Types' },
  { key: 'individual', label: 'Individual' },
  { key: 'family', label: 'Family' },
  { key: 'community', label: 'Community' },
  { key: 'organization', label: 'Organization' },
  { key: 'charity', label: 'Charity' },
];

export function ExploreView() {
  const { setCurrentView, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useAppStore();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (localSearch) params.set('search', localSearch);
    if (selectedCategory) params.set('category', selectedCategory);
    if (activeFilter === 'urgent') params.set('urgent', 'true');
    if (activeFilter === 'verified') params.set('verified', 'true');
    if (activeFilter === 'featured') params.set('featured', 'true');
    params.set('sort', sortBy);
    params.set('limit', '20');

    try {
      const res = await fetch(`/api/campaigns?${params}`);
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [localSearch, selectedCategory, activeFilter, sortBy]);

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'verified', label: 'Verified' },
    { key: 'featured', label: 'Featured' },
  ];

  const sortOptions = [
    { key: 'newest', label: 'Newest' },
    { key: 'most_funded', label: 'Most Funded' },
    { key: 'ending_soon', label: 'Ending Soon' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        onClick={() => setCurrentView('home')}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Explore Campaigns</h1>
          <p className="mt-1 text-muted-foreground">Find causes that matter to you</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, name, or keyword..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline" className="shrink-0">Search</Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div className="w-full border-t pt-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                !selectedCategory ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === cat.id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign type filters */}
        <div className="w-full border-t pt-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Type:</span>
            {typeFilters.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveFilter(t.key === 'all' ? 'all' : `type_${t.key}`)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  activeFilter === `type_${t.key}` ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          {sortOptions.map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sortBy === s.key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border bg-card">
              <div className="aspect-[16/10] rounded-t-2xl bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
                <div className="h-2 w-full rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="mt-16 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-semibold">No campaigns found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
          <Button variant="outline" className="mt-4" onClick={() => { setLocalSearch(''); setSelectedCategory(null); setActiveFilter('all'); }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {campaigns.map((c, i) => (
              <CampaignCard key={c.id} campaign={c} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
