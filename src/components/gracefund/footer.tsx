'use client';

import { useAppStore } from '@/store/app-store';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  'Platform': [
    { label: 'Explore Campaigns', action: 'explore' as const },
    { label: 'Start a Fundraiser', action: 'auth' as const },
    { label: 'How It Works', action: 'home' as const },
    { label: 'Pricing', action: 'home' as const },
  ],
  'Categories': [
    { label: 'Medical & Health', action: 'explore' as const },
    { label: 'Education', action: 'explore' as const },
    { label: 'Emergency', action: 'explore' as const },
    { label: 'Community', action: 'explore' as const },
    { label: 'Charity & Nonprofit', action: 'explore' as const },
  ],
  'Support': [
    { label: 'Help Center', action: 'home' as const },
    { label: 'Trust & Safety', action: 'trust-safety' as const },
    { label: 'Contact Us', action: 'home' as const },
    { label: 'Privacy Policy', action: 'home' as const },
  ],
};

export function Footer() {
  const { setCurrentView, setShowAuthModal } = useAppStore();

  const handleLinkClick = (action: string) => {
    if (action === 'auth') {
      setShowAuthModal(true, 'register');
    } else if (action === 'explore') {
      setCurrentView('explore');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'trust-safety') {
      setCurrentView('trust-safety');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <span className="text-lg font-bold text-primary-foreground">G</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Grace<span className="text-[var(--gold)]">Fund</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A trusted community crowdfunding platform connecting people, families, communities, and organizations to raise and give support when it matters most.
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span>hello@gracefund.org</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.action)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GraceFund. All rights reserved. Made with <Heart className="inline h-3 w-3 text-red-500" /> for communities everywhere.
          </p>
          <div className="flex items-center gap-4">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</button>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</button>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
