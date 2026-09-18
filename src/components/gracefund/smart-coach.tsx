'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, Send, Bot, User, Sparkles, BookOpen,
  Share2, Target, ShieldCheck, MessageCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

const suggestions = [
  { icon: BookOpen, label: 'Help me write my story', prompt: 'How do I write a compelling fundraiser story that connects with donors?' },
  { icon: Share2, label: 'How to share my fundraiser', prompt: 'What are the best ways to share my fundraiser and reach more donors?' },
  { icon: Target, label: 'Tips for reaching my goal', prompt: 'How can I reach my fundraising goal faster?' },
  { icon: ShieldCheck, label: 'How to get verified', prompt: 'What do I need to do to get my fundraiser verified on JodoFund?' },
];

const coachResponses: Record<string, string> = {
  'story': `Great question! A compelling fundraiser story has three key elements:

1. **Start with the "Why"** — Explain why this cause matters to you personally. Authenticity builds trust and emotional connection.

2. **Be specific about the need** — Instead of "We need help," say "We need ₹5,00,000 for Priya's heart surgery at AIIMS on March 15th." Specifics make the need tangible.

3. **Show the impact** — Help donors understand exactly how their contribution helps. "₹1,000 covers one day of hospital care" is more powerful than a vague appeal.

4. **Use photos and updates** — Visual proof and regular updates keep donors engaged and encourage sharing.

5. **End with a clear call-to-action** — Tell people exactly what you need them to do: donate, share, or both.`,

  'share': `Here are the most effective ways to share your fundraiser:

1. **WhatsApp & Telegram** — Share directly with close contacts. Personal messages get 3x more donations than public posts.

2. **Social Media** — Post on Facebook, Instagram, and Twitter. Use relevant hashtags and tag supportive communities.

3. **Email Campaign** — Send a personal email to your network explaining why this matters to you.

4. **Workplace & Community** — Share with colleagues, local groups, and religious communities.

5. **JodoFund Tips** — Update your campaign regularly (donors share active campaigns 40% more). Respond to every donor with gratitude.

6. **Local Media** — Reach out to local newspapers and radio — many cover community fundraisers for free.

Pro tip: The first 48 hours are crucial. Share with your closest supporters first to build momentum!`,

  'goal': `Here are proven strategies to reach your fundraising goal:

1. **Set a realistic goal** — Break big goals into milestones. ₹10L feels overwhelming; ₹2L at a time feels achievable.

2. **Early momentum matters** — Get 30% funded in the first week. Ask close friends and family to donate first — others follow when they see progress.

3. **Share consistently** — Post updates every 2-3 days. Each update can boost donations by 15-20%.

4. **Express gratitude publicly** — Thank donors by name (with permission). This encourages others and creates community.

5. **Leverage matching** — If a donor offers to match contributions, promote it heavily — matching can double your intake.

6. **Extend if needed** — It is okay to extend your deadline. Better to reach the goal slowly than not at all.

7. **Use the 80G benefit** — Remind donors about tax savings under Section 80G — it reduces the effective cost of their donation!`,

  'verify': `Getting verified on JodoFund builds trust and increases donations by up to 30%. Here is how:

1. **Identity Verification** — Upload a valid government-issued ID (Aadhaar, PAN, Passport, or Voter ID).

2. **Campaign Documentation** — Provide supporting documents: medical bills, hospital letters, admission letters, or other relevant proof.

3. **Bank Account Verification** — Link your bank account. We verify it matches your identity documents.

4. **Organizer Details** — Complete your profile with accurate contact information and a clear photo.

5. **Review Process** — Our trust & safety team reviews everything within 24-48 hours.

**Verification Levels:**
- **Basic** — Identity verified, eligible to receive funds
- **Advanced** — Identity + documents verified, "Verified" badge displayed
- **Organization** — For registered NGOs and trusts with 80G certification

Start the verification process from your fundraiser dashboard!`,
};

function getCoachResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('story') || lower.includes('write') || lower.includes('compelling')) return coachResponses['story'];
  if (lower.includes('share') || lower.includes('social') || lower.includes('spread')) return coachResponses['share'];
  if (lower.includes('goal') || lower.includes('reach') || lower.includes('faster') || lower.includes('tips')) return coachResponses['goal'];
  if (lower.includes('verify') || lower.includes('verification') || lower.includes('verified')) return coachResponses['verify'];
  return `That is a great question! Here are some general fundraising tips that might help:

1. **Tell your story authentically** — People connect with real, honest narratives.
2. **Set a clear, specific goal** — Numbers make the need tangible.
3. **Share widely and often** — Every share can bring new donors.
4. **Update regularly** — Donors love knowing the impact of their contribution.
5. **Express gratitude** — A heartfelt thank you builds lasting relationships.
6. **Use 80G tax benefits** — Remind donors about tax savings.

Would you like me to dive deeper into any specific area? Try asking about writing your story, sharing strategies, or verification!`;
}

export function SmartCoachPage() {
  const { setCurrentView } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getCoachResponse(text);
      const coachMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'coach', text: response, timestamp: new Date() };
      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 sm:pt-10">
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setCurrentView('home')}
          className="group mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-600 shadow-lg shadow-primary/20">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">AI Smart Fundraising Coach</h1>
          <p className="mt-2 text-slate-500">Get personalised advice to make your fundraiser a success</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-slate-200/60 shadow-sm">
            <CardContent className="p-0">
              {/* Chat Area */}
              <div ref={scrollRef} className="h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <MessageCircle className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">How can I help you today?</h3>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">Ask me anything about fundraising — from writing your story to reaching your goal.</p>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {suggestions.map((s) => (
                        <motion.button
                          key={s.label}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => sendMessage(s.prompt)}
                          className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-center transition-shadow hover:shadow-md"
                        >
                          <s.icon className="h-5 w-5 text-primary" />
                          <span className="text-xs font-medium text-slate-700">{s.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'coach' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {msg.text.split('\n').map((line, i) => (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>
                      {msg.role === 'user' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                            className="h-2 w-2 rounded-full bg-slate-400"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-200/60 p-4">
                {messages.length > 0 && messages.length < 3 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {suggestions.filter((s) => !messages.some((m) => m.text.includes(s.prompt))).slice(0, 2).map((s) => (
                      <button
                        key={s.label}
                        onClick={() => sendMessage(s.prompt)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        <s.icon className="h-3 w-3" />
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about fundraising..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="rounded-xl h-10 w-10">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
