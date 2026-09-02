import { create } from 'zustand';

export type AppView =
  | 'home'
  | 'explore'
  | 'campaign'
  | 'create-campaign'
  | 'donor-dashboard'
  | 'fundraiser-dashboard'
  | 'admin-dashboard'
  | 'auth';

interface AppState {
  currentView: AppView;
  selectedCampaignSlug: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  showAuthModal: boolean;
  authMode: 'login' | 'register';
  showDonationModal: boolean;
  donationCampaignId: string | null;
  showMobileMenu: boolean;
  setCurrentView: (view: AppView) => void;
  setSelectedCampaign: (slug: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (id: string | null) => void;
  setShowAuthModal: (show: boolean, mode?: 'login' | 'register') => void;
  setShowDonationModal: (show: boolean, campaignId?: string) => void;
  setShowMobileMenu: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  selectedCampaignSlug: null,
  searchQuery: '',
  selectedCategory: null,
  showAuthModal: false,
  authMode: 'login',
  showDonationModal: false,
  donationCampaignId: null,
  showMobileMenu: false,
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedCampaign: (slug) => set({ selectedCampaignSlug: slug, currentView: 'campaign' }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCategory: (id) => set({ selectedCategory: id }),
  setShowAuthModal: (show, mode) => set({ showAuthModal: show, authMode: mode || 'login' }),
  setShowDonationModal: (show, campaignId) => set({ showDonationModal: show, donationCampaignId: campaignId || null }),
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
}));
