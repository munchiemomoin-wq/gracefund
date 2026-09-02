'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Search, Plus, User, Heart, Shield, X } from 'lucide-react';

export function Header() {
  const {
    setCurrentView, setShowAuthModal, setShowMobileMenu, searchQuery, setSearchQuery,
  } = useAppStore();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentView('explore');
  };

  const navItems = [
    { label: 'Explore', action: () => setCurrentView('explore') },
    { label: 'How It Works', action: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Start a Fundraiser', action: () => setShowAuthModal(true, 'register'), highlight: true },
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
                'highlight' in item && item.highlight
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
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
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('donor-dashboard')} title="Dashboard">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true, 'login')}>
            <User className="mr-1.5 h-4 w-4" />
            Sign In
          </Button>
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
                <Button variant="outline" className="w-full justify-start" onClick={() => { setCurrentView('donor-dashboard'); setShowMobileMenu(false); }}>
                  <Heart className="mr-2 h-4 w-4" /> My Dashboard
                </Button>
                <Button className="w-full" onClick={() => { setShowAuthModal(true, 'login'); setShowMobileMenu(false); }}>
                  <User className="mr-2 h-4 w-4" /> Sign In
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
