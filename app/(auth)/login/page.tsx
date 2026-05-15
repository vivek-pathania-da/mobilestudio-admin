'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageFallback() {
  return (
    <div className="flex w-full flex-col items-center px-4 py-12">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const sessionExpired = searchParams.get('reason') === 'session_expired';

  useEffect(() => {
    if (sessionExpired) {
      clearError();
    }
  }, [sessionExpired, clearError]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    await login(data.email, data.password);

    const state = useAuthStore.getState();
    if (state.isAuthenticated) {
      toast.success('Welcome back!');
      router.push('/dashboard');
    } else if (state.error) {
      toast.error(state.error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center px-4">
      <div className="mb-8 flex items-center gap-2">
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          MobileStudio
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          ADMIN
        </span>
      </div>

      <div
        className="w-full max-w-[400px] rounded-3xl border p-8"
        style={{
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="mb-6">
          <h1
            className="mb-1 text-[28px] font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Sign in to your account
          </h1>
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Internal operations portal
          </p>
          {sessionExpired ? (
            <p
              className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              Your session has expired. Please sign in again.
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-[11px] font-medium tracking-wider uppercase"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              autoFocus
              {...register('email')}
              className={cn(
                errors.email && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-[11px] font-medium tracking-wider uppercase"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                className={cn(
                  'pr-10',
                  errors.password &&
                    'border-red-500 focus-visible:ring-red-500'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                style={{ color: 'var(--color-text-tertiary)' }}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-2 h-[46px] w-full rounded-md text-base font-semibold"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>

      <div
        className="mt-6 flex items-center gap-1.5 text-[13px]"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        <span>System Status:</span>
        <span
          className="flex items-center gap-1 font-medium"
          style={{ color: 'var(--color-success)' }}
        >
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: 'var(--color-success)' }}
          />
          Operational
        </span>
      </div>
    </div>
  );
}
