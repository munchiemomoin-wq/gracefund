import { create } from 'zustand';

export type AppView =
  | 'home'
  | 'explore'
  | 'campaign'
  | 'create-campaign'
  | 'donor-dashboard'
  | 'fundraiser-dashboard'
  | 'admin-dashboard'
  | 'trust-safety'
  | 'auth';

export type AdminSubView =
  | 'overview'
  | 'campaigns'
  | 'review-queue'
  | 'donations'
  | 'withdrawals'
  | 'users'
  | 'organizations'
  | 'categories'
  | 'verification'
  | 'reports'
  | 'compliance'
  | 'featured'
  | 'analytics'
  | 'payment-settings'
  | 'platform-settings'
  | 'audit-logs';

interface AppState {
  currentView: AppView;
  adminSubView: AdminSubView;
  selectedCampaignSlug: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  showAuthModal: boolean;
  authMode: 'login' | 'register';
  showDonationModal: boolean;
  donationCampaignId: string | null;
  showMobileMenu: boolean;
  showReportModal: boolean;
  reportCampaignId: string | null;
  setCurrentView: (view: AppView) => void;
  setAdminSubView: (view: AdminSubView) => void;
  setSelectedCampaign: (slug: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (id: string | null) => void;
  setShowAuthModal: (show: boolean, mode?: 'login' | 'register') => void;
  setShowDonationModal: (show: boolean, campaignId?: string) => void;
  setShowMobileMenu: (show: boolean) => void;
  setShowReportModal: (show: boolean, campaignId?: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  adminSubView: 'overview',
  selectedCampaignSlug: null,
  searchQuery: '',
  selectedCategory: null,
  showAuthModal: false,
  authMode: 'login',
  showDonationModal: false,
  donationCampaignId: null,
  showMobileMenu: false,
  showReportModal: false,
  reportCampaignId: null,
  setCurrentView: (view) => set({ currentView: view }),
  setAdminSubView: (view) => set({ adminSubView: view }),
  setSelectedCampaign: (slug) => set({ selectedCampaignSlug: slug, currentView: 'campaign' }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCategory: (id) => set({ selectedCategory: id }),
  setShowAuthModal: (show, mode) => set({ showAuthModal: show, authMode: mode || 'login' }),
  setShowDonationModal: (show, campaignId) => set({ showDonationModal: show, donationCampaignId: campaignId || null }),
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
  setShowReportModal: (show, campaignId) => set({ showReportModal: show, reportCampaignId: campaignId || null }),
}));
