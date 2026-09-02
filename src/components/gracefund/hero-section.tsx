'use client';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  const { setCurrentView, setShowAuthModal } = useAppStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[var(--gold)]/10 blur-3xl" />
        <div className="absolute -left-20 top-1/2 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-[600px] -translate-x-1/2 rounded-full bg-[var(--gold)]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-1.5 text-xs font-medium text-foreground/80">
              <Sparkles className="h-3 w-3 text-[var(--gold)]" />
              People Helping People
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Together, We Can{' '}
            <span className="text-gradient-gold">Make a Difference</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
          >
            Help people, families, communities, and meaningful causes raise the support they need.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-12 rounded-full bg-primary px-8 text-base font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90"
              onClick={() => setShowAuthModal(true, 'register')}
            >
              Start a Fundraiser
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-border/80 px-8 text-base font-semibold hover:bg-muted"
              onClick={() => setCurrentView('explore')}
            >
              Explore Campaigns
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Secure Donations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Verified Fundraisers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Global Community</span>
            </div>
          </motion.div>
        </div>

        {/* Hero visual - abstract shapes representing community */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex justify-center lg:mt-16"
        >
          <div className="relative w-full max-w-4xl">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop', label: 'Families' },
                { img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop', label: 'Medical' },
                { img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop', label: 'Volunteers' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`relative overflow-hidden rounded-2xl shadow-md ${
                    i === 1 ? 'sm:mt-6' : ''
                  }`}
                >
                  <img
                    src={item.img}
                    alt={item.label}
                    className="h-32 w-full object-cover sm:h-48"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}