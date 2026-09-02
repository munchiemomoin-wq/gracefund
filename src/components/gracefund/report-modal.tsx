'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';

const reportReasons = [
  { value: 'suspected_fraud', label: 'Suspected fraud' },
  { value: 'misleading_information', label: 'Misleading information' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'duplicate_campaign', label: 'Duplicate campaign' },
  { value: 'incorrect_beneficiary', label: 'Incorrect beneficiary information' },
  { value: 'suspicious_funds', label: 'Suspicious use of funds' },
  { value: 'inappropriate_content', label: 'Inappropriate content' },
  { value: 'other', label: 'Other' },
] as const;

export function ReportModal() {
  const { showReportModal, reportCampaignId, setShowReportModal } = useAppStore();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setShowReportModal(false);
    setReason('');
    setDescription('');
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: reportCampaignId,
          reporterId: 'demo-user',
          reason,
          description,
        }),
      });

      if (res.ok) {
        toast.success('Report submitted. Our team will review this campaign.');
        handleClose();
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showReportModal} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report Campaign</DialogTitle>
          <DialogDescription>
            Help us keep GraceFund safe. Your report will be reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="report-reason">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="report-reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-description">Description</Label>
            <Textarea
              id="report-description"
              placeholder="Describe the issue (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Reports are confidential. The campaign organizer will not see who reported them.
        </p>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !reason}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
