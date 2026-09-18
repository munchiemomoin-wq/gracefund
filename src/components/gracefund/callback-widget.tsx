'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Phone, User, ChevronDown, CheckCircle, X,
} from 'lucide-react';

const campaignTypes = [
  'Medical & Health',
  'Education',
  'Emergency',
  'Community',
  'Children',
  'Elderly Care',
  'Animal Welfare',
  'Other',
];

const amountRanges = [
  'Under ₹50,000',
  '₹50,000 - ₹2,00,000',
  '₹2,00,000 - ₹5,00,000',
  '₹5,00,000 - ₹10,00,000',
  'Above ₹10,00,000',
];

const timeSlots = [
  'Morning (9 AM - 12 PM)',
  'Afternoon (12 PM - 4 PM)',
  'Evening (4 PM - 8 PM)',
];

export function CallbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [campaignType, setCampaignType] = useState('');
  const [amountRange, setAmountRange] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showAmountDropdown, setShowAmountDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
      setName('');
      setPhone('');
      setSelectedTime('');
      setCampaignType('');
      setAmountRange('');
    }, 3000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl"
      >
        <Phone className="h-4 w-4" />
        <span className="hidden sm:inline">Request Callback</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Callback Requested!</h3>
                  <p className="mt-2 text-sm text-slate-500">We will call you within 30 minutes during business hours.</p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-bold text-slate-900">Request a Callback</h2>
                    </div>
                    <p className="text-sm text-slate-500">Our team will reach out within 30 minutes</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Name *</Label>
                      <div className="mt-1 relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-700">Phone Number *</Label>
                      <div className="mt-1 relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-700">Preferred Time</Label>
                      <div className="mt-1 relative">
                        <button
                          onClick={() => { setShowTimeDropdown(!showTimeDropdown); setShowTypeDropdown(false); setShowAmountDropdown(false); }}
                          className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:border-slate-300"
                        >
                          <span>{selectedTime || 'Select time slot'}</span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>
                        {showTimeDropdown && (
                          <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-lg border bg-white py-1 shadow-lg">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => { setSelectedTime(slot); setShowTimeDropdown(false); }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-700">Campaign Type</Label>
                      <div className="mt-1 relative">
                        <button
                          onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowTimeDropdown(false); setShowAmountDropdown(false); }}
                          className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:border-slate-300"
                        >
                          <span>{campaignType || 'Select type'}</span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>
                        {showTypeDropdown && (
                          <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-lg border bg-white py-1 shadow-lg">
                            {campaignTypes.map((type) => (
                              <button
                                key={type}
                                onClick={() => { setCampaignType(type); setShowTypeDropdown(false); }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-700">Amount Range</Label>
                      <div className="mt-1 relative">
                        <button
                          onClick={() => { setShowAmountDropdown(!showAmountDropdown); setShowTimeDropdown(false); setShowTypeDropdown(false); }}
                          className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:border-slate-300"
                        >
                          <span>{amountRange || 'Select range'}</span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>
                        {showAmountDropdown && (
                          <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-lg border bg-white py-1 shadow-lg">
                            {amountRanges.map((range) => (
                              <button
                                key={range}
                                onClick={() => { setAmountRange(range); setShowAmountDropdown(false); }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                              >
                                {range}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      className="w-full"
                      disabled={!name.trim() || !phone.trim()}
                    >
                      Request Callback
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
