'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Search, User, Heart, LogOut, Bell, Shield, ChevronDown } from 'lucide-react';

export function Header() {
  const {
    currentView, setCurrentView, setShowAuthModal, setShowMobileMenu,
    searchQuery, setSearchQuery, auth, setAuth, clearAuth,
  } = useAppStore();
  const [localSearch, setLocalSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = auth.user;

  // Check session on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => { if (data.user) setAuth(data.user); })
      .catch(() => {})
      .finally(() => useAppStore.getState().setAuthLoading(false));
  }, [setAuth]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentView('explore');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearAuth();
    setShowUserMenu(false);
  };

  const getDashboardView = () => {
    if (!user) return 'donor-dashboard';
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'fundraiser' || user.role === 'organization') return 'fundraiser-dashboard';
    return 'donor-dashboard';
  };

  const navItems = [
    { label: 'Explore', action: () => setCurrentView('explore') },
    { label: 'Give to GraceFund', action: () => setCurrentView('give') },
    { label: 'How It Works', action: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Trust & Safety', action: () => setCurrentView('trust-safety') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <span className="text-lg font-bold text-primary-foreground">G</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Grace<span className="text-[var(--gold)]">Fund</span>
            <span className="ml-2 hidden sm:inline text-xs font-normal text-muted-foreground">Giving Hope. Changing Lives.</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentView === 'trust-safety' && item.label === 'Trust & Safety'
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 md:flex">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="h-9 w-56 rounded-full border-border/80 bg-muted/50 pl-9 pr-4 text-sm focus:w-72 transition-all"
            />
          </form>

          {user ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => setCurrentView(getDashboardView())} title="Dashboard">
                <Heart className="h-4 w-4" />
              </Button>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {(user.name || user.email)?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline max-w-[120px] truncate text-sm">
                    {user.name || user.email}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border bg-background p-1 shadow-lg">
                      <div className="px-3 py-2 border-b mb-1">
                        <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">
                          {user.role}
                        </span>
                      </div>
                      <button
                        onClick={() => { setCurrentView(getDashboardView()); setShowUserMenu(false); }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Heart className="h-4 w-4" /> Dashboard
                      </button>
                      {user.role === 'fundraiser' || user.role === 'organization' ? (
                        <button
                          onClick={() => { setCurrentView('create-campaign'); setShowUserMenu(false); }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <Shield className="h-4 w-4" /> Start a Fundraiser
                        </button>
                      ) : null}
                      <div className="border-t my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true, 'register')}>
                Create Account
              </Button>
              <Button size="sm" onClick={() => setShowAuthModal(true, 'login')}>
                <User className="mr-1.5 h-4 w-4" />
                Sign In
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">G</span>
              </div>
              Grace<span className="text-[var(--gold)]">Fund</span>
            </SheetTitle>
            <div className="mt-6 space-y-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-9"
                />
              </form>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { item.action(); setShowMobileMenu(false); }}
                  className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border pt-3 mt-3 space-y-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Button variant="outline" className="w-full justify-start" onClick={() => { setCurrentView(getDashboardView()); setShowMobileMenu(false); }}>
                      <Heart className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600" onClick={() => { handleLogout(); setShowMobileMenu(false); }}>
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full justify-start" onClick={() => { setShowAuthModal(true, 'register'); setShowMobileMenu(false); }}>
                      Create Account
                    </Button>
                    <Button className="w-full" onClick={() => { setShowAuthModal(true, 'login'); setShowMobileMenu(false); }}>
                      <User className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
