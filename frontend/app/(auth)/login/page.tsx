'use client';

import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Zod validation schema
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z.string()
    .min(6, 'Password minimal 6 karakter'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setServerError('');

    try {
      const res = await authApi.login(data);
      const authData = res.data.data;

      // Store in Zustand + cookies
      login(authData);

      // Redirect based on role
      if (authData.role === 'USER') {
        router.push('/dashboard/jobs');
      } else {
        router.push('/dashboard/browse');
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } }
      };
      setServerError(
        error.response?.data?.message || 'Login gagal. Coba lagi!'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-orange-500 p-2.5 rounded-xl">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">
              Seribu<span className="text-orange-500">Tukang</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Selamat Datang Kembali! 👋
          </h1>
          <p className="mt-2 text-gray-500">
            Masuk ke akun SeribuTukang Anda
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border
                        border-gray-100 p-8">

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100
                            rounded-xl text-red-600 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="budi@example.com"
                className={`w-full px-4 py-3 rounded-xl border
                            focus:outline-none focus:ring-2
                            focus:ring-orange-500 focus:border-transparent
                            transition-colors text-gray-900
                            placeholder:text-gray-400
                            ${errors.email
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200 bg-gray-50'}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border
                              focus:outline-none focus:ring-2
                              focus:ring-orange-500 focus:border-transparent
                              transition-colors text-gray-900
                              placeholder:text-gray-400
                              ${errors.password
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200 bg-gray-50'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600">
                  {showPassword
                    ? <EyeOff className="h-5 w-5" />
                    : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl
                         font-semibold hover:bg-orange-600 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 mt-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-sm text-gray-400">atau</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <Link href="/register"
              className="text-orange-500 font-semibold hover:text-orange-600">
              Daftar Sekarang
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-6 text-sm text-gray-400">
          <Link href="/"
            className="hover:text-orange-500 transition-colors">
            ← Kembali ke Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}