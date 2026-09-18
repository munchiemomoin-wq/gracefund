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
  | 'give'
  | 'transparency'
  | 'auth'
  | 'how-it-works'
  | 'success-stories'
  | 'smart-coach'
  | 'monthly-donations'
  | 'tax-benefits'
  | 'fundraising-tips'
  | 'donor-wall'
  | 'giving-guarantee'
  | 'team-fundraising'
  | 'callback';

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
  | 'audit-logs'
  | 'give-contributions'
  | 'give-allocations'
  | 'give-balances'
  | 'give-transparency'
  | 'give-reports';

export interface AuthState {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl?: string | null;
    role: string;
    status: string;
    verificationLevel: string;
  } | null;
  isLoading: boolean;
}

interface AppState {
  // Navigation
  currentView: AppView;
  adminSubView: AdminSubView;
  selectedCampaignSlug: string | null;
  searchQuery: string;
  selectedCategory: string | null;

  // Auth
  auth: AuthState;

  // Modals
  showAuthModal: boolean;
  authMode: 'login' | 'register';
  showDonationModal: boolean;
  donationCampaignId: string | null;
  showMobileMenu: boolean;
  showReportModal: boolean;
  reportCampaignId: string | null;

  // Actions
  setCurrentView: (view: AppView) => void;
  setAdminSubView: (view: AdminSubView) => void;
  setSelectedCampaign: (slug: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (id: string | null) => void;
  setShowAuthModal: (show: boolean, mode?: 'login' | 'register') => void;
  setShowDonationModal: (show: boolean, campaignId?: string) => void;
  setShowMobileMenu: (show: boolean) => void;
  setShowReportModal: (show: boolean, campaignId?: string) => void;
  setAuth: (user: AuthState['user']) => void;
  clearAuth: () => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  adminSubView: 'overview',
  selectedCampaignSlug: null,
  searchQuery: '',
  selectedCategory: null,
  auth: { user: null, isLoading: true },
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
  setAuth: (user) => set({ auth: { user, isLoading: false } }),
  clearAuth: () => set({ auth: { user: null, isLoading: false } }),
  setAuthLoading: (isLoading) => set((s) => ({ auth: { ...s.auth, isLoading } })),
}));
