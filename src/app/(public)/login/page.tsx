'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle } from 'lucide-react';

import { LoginSchema, type LoginInput } from '@/lib/validators/auth';
import { AuthService } from '@/services/auth';
import { checkUserProfileStatus } from '@/app/actions/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      await AuthService.login(data.email, data.password);
      
      // Determine redirection target based on profile completion status
      const statusRes = await checkUserProfileStatus();
      let targetPath = '/profile';

      const queryRedirect = searchParams.get('redirectTo');
      if (queryRedirect) {
        targetPath = queryRedirect;
      } else if (statusRes.success && statusRes.hasProfile) {
        targetPath = '/dashboard';
      }

      router.push(targetPath);
      router.refresh();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Friendly, mapped error messages
      let message = error?.message || 'An unexpected error occurred. Please try again.';
      if (error?.message?.toLowerCase().includes('network')) {
        message = 'Network connection failed. Please check your internet connectivity.';
      }
      
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-premium border-border/40">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your LifeLink account to coordinate blood requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {authError && (
            <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2.5 text-xs text-destructive font-medium animate-fade-in">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            icon={<Mail className="w-4 h-4" />}
            disabled={isLoading}
            suppressHydrationWarning
            {...register('email')}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            icon={<Lock className="w-4 h-4" />}
            disabled={isLoading}
            suppressHydrationWarning
            {...register('password')}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-center text-xs text-muted-foreground">
        <p>
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-semibold transition-all-300">
            Register Here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto bg-white border border-border rounded-xl p-8 shadow-premium space-y-6">
      <div className="h-8 bg-muted rounded w-2/3 mx-auto animate-pulse" />
      <div className="h-4 bg-muted rounded w-1/2 mx-auto animate-pulse" />
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded w-full animate-pulse" />
        <div className="h-10 bg-muted rounded w-full animate-pulse" />
      </div>
      <div className="h-10 bg-muted rounded w-full animate-pulse" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <React.Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
