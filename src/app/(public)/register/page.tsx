'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle } from 'lucide-react';

import { RegisterSchema, type RegisterInput } from '@/lib/validators/auth';
import { AuthService } from '@/services/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      await AuthService.register(data.email, data.password);
      router.push('/profile');
      router.refresh();
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Friendly mapped error messages
      let message = 'An unexpected error occurred. Please try again.';
      const errorMsg = error?.message?.toLowerCase() || '';
      
      if (errorMsg.includes('already registered') || errorMsg.includes('already exists') || errorMsg.includes('taken')) {
        message = 'This email is already registered. Please sign in instead.';
      } else if (errorMsg.includes('weak password') || errorMsg.includes('should be at least')) {
        message = 'Password is too weak. Please choose a stronger password.';
      } else if (errorMsg.includes('network')) {
        message = 'Network connection failed. Please check your internet connectivity.';
      } else if (error?.message) {
        message = error.message;
      }
      
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <Card className="w-full max-w-md mx-auto shadow-premium border-border/40">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Join LifeLink to request or donate blood in emergencies
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
              {...register('password')}
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              icon={<Lock className="w-4 h-4" />}
              disabled={isLoading}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-xs text-muted-foreground">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-semibold transition-all-300">
              Sign In Here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
