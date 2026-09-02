'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, authMode, setAuth } = useAppStore();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const handleClose = () => {
    setShowAuthModal(false);
    setIsResetMode(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Login failed');
        return;
      }
      setAuth(data.user);
      toast.success(`Welcome back${data.user.name ? ', ' + data.user.name : ''}!`);
      handleClose();
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (registerPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: registerName, email: registerEmail, password: registerPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }
      setAuth(data.user);
      toast.success('Account created successfully!');
      handleClose();
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      toast.error('Enter your email address');
      return;
    }
    setIsSubmitting(true);
    try {
      // Use Supabase Auth directly for password reset
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(loginEmail);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Password reset link sent to your email');
      setIsResetMode(false);
    } catch {
      toast.error('Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuth(null);
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        <div className="gradient-navy px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {isResetMode ? 'Reset Password' : authMode === 'login' ? 'Welcome Back' : 'Join GraceFund'}
            </DialogTitle>
            <button onClick={handleClose} className="rounded-full p-1 hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-white/70">
            {isResetMode
              ? 'Enter your email to receive a password reset link'
              : authMode === 'login'
              ? 'Sign in to manage your campaigns and donations'
              : 'Create an account to start making a difference'}
          </p>
        </div>

        <div className="p-6">
          {isResetMode ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <Tabs defaultValue={authMode}>
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="mt-4 space-y-4">
                  <div>
                    <Label>Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    Forgot your password?
                  </button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="mt-4 space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Your full name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 8 characters"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
