'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Eye,
  FileCheck,
  AlertTriangle,
  Lock,
  Users,
  CheckCircle,
  Search,
  Scale,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

interface TrustItem {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const verificationSteps: TrustItem[] = [
  {
    icon: FileCheck,
    title: 'Identity Verification',
    description:
      'Every campaign organizer must verify their identity with a valid government-issued ID. We cross-reference personal details to confirm authenticity before funds can be raised.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Eye,
    title: 'Campaign Review',
    description:
      'Our trust & safety team manually reviews every campaign before it goes live. We check for clarity, accuracy, and ensure the stated goal is realistic and well-documented.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Users,
    title: 'Community Reporting',
    description:
      'Donors and community members can flag campaigns that seem suspicious. Every report is triaged by our moderation team within 24 hours.',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: Shield,
    title: 'Fraud Detection AI',
    description:
      'Our machine-learning models continuously scan for patterns associated with fraudulent behavior, including fake accounts, duplicate campaigns, and suspicious fund flows.',
    color: 'text-emerald-600 bg-emerald-50',
  },
];

const safetyMeasures: TrustItem[] = [
  {
    icon: Lock,
    title: 'Secure Payments',
    description:
      'All transactions are processed through PCI-DSS compliant payment processors. Your card details are never stored on our servers — we use tokenized payments end to end.',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: Scale,
    title: 'Fundraiser Accountability',
    description:
      'Organizers must provide periodic updates and proof of fund usage. Withdrawals undergo additional verification to ensure funds reach their intended purpose.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    description:
      'Donors receive notifications about campaign milestones, updates from organizers, and any changes to withdrawal requests — full transparency at every step.',
    color: 'text-rose-600 bg-rose-50',
  },
  {
    icon: Search,
    title: 'Ongoing Monitoring',
    description:
      'Active and completed campaigns are continuously monitored. If we detect misuse, we have the authority to freeze funds and escalate to law enforcement.',
    color: 'text-cyan-600 bg-cyan-50',
  },
];

const guarantees = [
  '100% of donated funds go directly to the campaign (platform fee is optional and transparent).',
  'Donor protection guarantee: full refund if a campaign is found to be fraudulent.',
  'Encrypted data storage with SOC 2 Type II compliance.',
  'Dedicated 24/7 support team for any trust or safety concerns.',
  'Regular third-party audits of our security and financial practices.',
  'Public transparency reports published quarterly.',
];

export function TrustSafetyPage() {
  const { setCurrentView } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Back Button */}
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10">
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setCurrentView('home')}
          className="group mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </motion.button>

        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="mb-16 text-center"
        >
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200"
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            custom={1}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Trust & Safety
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="mx-auto mt-4 max-w-2xl text-lg text-slate-500"
          >
            Your safety is our top priority. JodoFund uses multi-layered verification,
            advanced fraud detection, and transparent processes to ensure every donation
            makes a real impact.
          </motion.p>
          <motion.div variants={fadeInUp} custom={3} className="mt-6 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified Organizers
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              <Lock className="mr-1 h-3 w-3" />
              Secure Payments
            </Badge>
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
              <Shield className="mr-1 h-3 w-3" />
              Fraud Protection
            </Badge>
          </motion.div>
        </motion.div>

        {/* Verification Process Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16"
        >
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              How We Verify Campaigns
            </h2>
            <p className="mt-2 text-slate-500">
              Every campaign goes through a rigorous multi-step verification process.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2">
            {verificationSteps.map((item, i) => (
              <motion.div key={item.title} variants={fadeInUp} custom={i + 1}>
                <Card className="h-full border-slate-200/60 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Safety Measures Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16"
        >
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Safety Measures
            </h2>
            <p className="mt-2 text-slate-500">
              Robust safeguards that protect both donors and organizers.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2">
            {safetyMeasures.map((item, i) => (
              <motion.div key={item.title} variants={fadeInUp} custom={i + 1}>
                <Card className="h-full border-slate-200/60 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Warning Banner */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16"
        >
          <motion.div variants={fadeInUp} custom={0}>
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="flex items-start gap-4 py-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">Stay Vigilant</h3>
                  <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
                    While we work hard to keep the platform safe, no system is perfect. Always
                    research the organizer, review campaign updates, and donate only what you can
                    afford. If something feels off, use the <strong>Report Campaign</strong> button —
                    every report helps protect the community.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Our Guarantees Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-20"
        >
          <motion.div variants={fadeInUp} custom={0} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Our Guarantees
            </h2>
            <p className="mt-2 text-slate-500">
              What we promise to every member of the JodoFund community.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} custom={1}>
            <Card className="border-slate-200/60">
              <CardContent className="py-6">
                <ul className="space-y-4">
                  {guarantees.map((guarantee) => (
                    <li key={guarantee} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-sm leading-relaxed text-slate-600">
                        {guarantee}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
