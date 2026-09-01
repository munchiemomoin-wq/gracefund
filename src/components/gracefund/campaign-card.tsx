'use client';

import { useAppStore } from '@/store/app-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Users, Shield, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency, getProgressPercent, getDaysRemaining } from '@/lib/currency';
import { motion } from 'framer-motion';

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
  category?: { name: string; icon: string } | null;
  organizer?: { name: string | null } | null;
  _count?: { donations: number; prayers: number };
}

interface CampaignCardProps {
  campaign: Campaign;
  index?: number;
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const { setSelectedCampaign, setShowDonationModal } = useAppStore();
  const progress = getProgressPercent(campaign.raisedAmount, campaign.goalAmount);
  const daysLeft = getDaysRemaining(campaign.endDate ? new Date(campaign.endDate) : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        className="group cursor-pointer overflow-hidden border-border/60 bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[var(--gold)]/30"
        onClick={() => setSelectedCampaign(campaign.slug)}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {campaign.coverImage ? (
            <img
              src={campaign.coverImage}
              alt={campaign.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-[var(--gold)]/10">
              <span className="text-4xl text-muted-foreground/30">GF</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {campaign.isUrgent && (
              <Badge className="bg-red-500 text-white hover:bg-red-600 border-0 text-xs font-semibold gap-1 shadow-md">
                <AlertTriangle className="h-3 w-3" />
                Urgent Need
              </Badge>
            )}
            {campaign.verificationLevel !== 'none' && (
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 border-0 text-xs font-semibold gap-1 shadow-md">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Category badge */}
          {campaign.category && (
            <div className="absolute right-3 top-3">
              <Badge variant="secondary" className="bg-white/90 text-foreground text-xs backdrop-blur-sm border-0">
                {campaign.category.name}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Organizer */}
          <p className="text-xs font-medium text-muted-foreground truncate">
            by {campaign.organizer?.name || 'Community Member'}
          </p>

          {/* Title */}
          <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
            {campaign.title}
          </h3>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>India</span>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-foreground">
                {formatCurrency(campaign.raisedAmount, campaign.currency)}
              </span>
              <span className="text-xs text-muted-foreground">
                of {formatCurrency(campaign.goalAmount, campaign.currency)}
              </span>
            </div>
            <Progress value={progress} className="mt-1.5 h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-[var(--gold)]" />
            <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{campaign.donorCount} donors</span>
              </div>
              {daysLeft !== null && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{daysLeft} days left</span>
                </div>
              )}
            </div>
          </div>

          {/* Donate Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDonationModal(true, campaign.id);
            }}
            className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
          >
            Donate Now
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}