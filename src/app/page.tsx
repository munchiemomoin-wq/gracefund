'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Header } from '@/components/gracefund/header';
import { Footer } from '@/components/gracefund/footer';
import { HeroSection } from '@/components/gracefund/hero-section';
import {
  PopularCampaigns, BrowseByCause, UrgentCampaigns,
  VerifiedCampaigns, HowItWorks, ImpactStats, FaithAndGiving,
} from '@/components/gracefund/homepage-sections';
import { CampaignDetail } from '@/components/gracefund/campaign-detail';
import { ExploreView } from '@/components/gracefund/explore-view';
import { CreateCampaignWizard } from '@/components/gracefund/create-campaign-wizard';
import { DonationModal } from '@/components/gracefund/donation-modal';
import { AuthModal } from '@/components/gracefund/auth-modal';
import { DonorDashboard, FundraiserDashboard, AdminDashboard } from '@/components/gracefund/dashboards';

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
  _count?: { donations: number; prayers: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  _count?: { campaigns: number };
}

export default function HomePage() {
  const { currentView } = useAppStore();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/campaigns?limit=20&sort=newest').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([cData, catData]) => {
        setCampaigns(Array.isArray(cData) ? cData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            {!loading && <PopularCampaigns campaigns={campaigns} />}
            {!loading && <BrowseByCause categories={categories} />}
            {!loading && <UrgentCampaigns campaigns={campaigns} />}
            {!loading && <VerifiedCampaigns campaigns={campaigns} />}
            <HowItWorks />
            <ImpactStats />
            <FaithAndGiving />
          </>
        )}

        {currentView === 'explore' && <ExploreView />}
        {currentView === 'campaign' && <CampaignDetail />}
        {currentView === 'create-campaign' && <CreateCampaignWizard />}
        {currentView === 'donor-dashboard' && <DonorDashboard />}
        {currentView === 'fundraiser-dashboard' && <FundraiserDashboard />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Modals */}
      <DonationModal />
      <AuthModal />
    </div>
  );
}
