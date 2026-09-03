'use client';

import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HandHeart, ArrowRight, Eye, Heart, Home, GraduationCap, UtensilsCrossed, Shield, PawPrint, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export function GiveToGraceFundSection() {
  const { setCurrentView } = useAppStore();

  const highlights = [
    { icon: UtensilsCrossed, label: 'Food Support', color: 'text-orange-600 bg-orange-50' },
    { icon: Home, label: 'Shelter', color: 'text-blue-600 bg-blue-50' },
    { icon: Heart, label: 'Elderly Care', color: 'text-rose-600 bg-rose-50' },
    { icon: GraduationCap, label: 'Education', color: 'text-violet-600 bg-violet-50' },
    { icon: Shield, label: 'Medical', color: 'text-emerald-600 bg-emerald-50' },
    { icon: PawPrint, label: 'Animal Welfare', color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <section className="gradient-warm py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gold)]/10">
              <HandHeart className="h-7 w-7 text-[var(--gold)]" />
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">Help Us Help More People</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Your contribution helps GraceFund support eligible people, families and community
              causes that need a helping hand. Choose where you would like your contribution
              to make an impact.
            </p>
          </motion.div>

          {/* Cause highlights */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center gap-2"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${h.color}`}>
                  <h.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{h.label}</span>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="rounded-full px-8"
              onClick={() => setCurrentView('give')}
            >
              <HandHeart className="mr-2 h-4 w-4" />
              Give to GraceFund
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              onClick={() => setCurrentView('transparency')}
            >
              <Eye className="mr-2 h-4 w-4" />
              See Where Funds Go
            </Button>
          </div>

          {/* Clear distinction callout */}
          <Card className="mt-10 border-dashed bg-background/50">
            <CardContent className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-semibold">Donate to a Campaign</p>
                  <p className="mt-1 text-xs text-muted-foreground">Your money goes toward a specific fundraiser.</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gold)]/10">
                    <HandHeart className="h-4 w-4 text-[var(--gold)]" />
                  </div>
                  <p className="font-semibold">Give to GraceFund</p>
                  <p className="mt-1 text-xs text-muted-foreground">Your contribution supports eligible community programs or the purpose you select.</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Settings className="h-4 w-4" />
                  </div>
                  <p className="font-semibold">Support GraceFund</p>
                  <p className="mt-1 text-xs text-muted-foreground">Your contribution helps GraceFund operate the platform.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
