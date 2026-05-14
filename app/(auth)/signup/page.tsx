'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*\d).+$/,
        'Include at least one uppercase letter and one number'
      ),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    clearError();
    await signup(data.email, data.password, data.name);

    const state = useAuthStore.getState();
    if (state.isAuthenticated) {
      toast.success('Account ready — welcome!');
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
            Create your account
          </h1>
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Internal operations portal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-[11px] font-medium tracking-wider uppercase"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Full name
            </Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Jane Doe"
              {...register('name')}
              className={cn(
                errors.name && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

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
                autoComplete="new-password"
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

          <div className="space-y-1.5">
            <Label
              htmlFor="confirmPassword"
              className="text-[11px] font-medium tracking-wider uppercase"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className={cn(
                errors.confirmPassword &&
                  'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600">
                {errors.confirmPassword.message}
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
            {isLoading ? 'Creating account…' : 'Sign up'}
          </Button>
        </form>

        <div
          className="my-5 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        />

        <div
          className="flex items-center justify-center gap-2"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[13px]">Secured by JWT authentication</span>
        </div>
      </div>

      <p
        className="mt-6 text-sm"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium hover:underline"
          style={{ color: 'var(--color-primary)' }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
