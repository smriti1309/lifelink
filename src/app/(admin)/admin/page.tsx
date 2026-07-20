'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Droplet, ShieldCheck, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { adminLoginAction } from '@/app/actions/admin-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (rememberMe) formData.append('rememberMe', 'on');

    try {
      const result = await adminLoginAction(formData);
      if (result.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setErrorMessage(result.error || 'Authentication failed. Access denied.');
      }
    } catch (err) {
      setErrorMessage('An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-900/20 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl shadow-lg flex items-center justify-center">
            <Droplet className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Life<span className="text-primary">Link</span> Administration
          </h1>
          <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 font-semibold px-3 py-1 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Authorized Personnel Only
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl text-slate-100">
          <CardHeader className="text-center pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Admin Sign In</h2>
            <p className="text-xs text-slate-400">Enter your secure administrator credentials to proceed</p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Administrator Email
                </label>
                <Input
                  type="email"
                  required
                  placeholder="admin@lifelink.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary/20"
                />
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span>Remember session for 7 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold transition-all shadow-lg shadow-primary/25"
              >
                {isLoading ? 'Authenticating...' : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In to Admin Panel <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} LifeLink Emergency Blood Donation Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
