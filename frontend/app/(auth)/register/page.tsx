'use client';

import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, HardHat, Loader2, User, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// ─────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────
const userSchema = z.object({
  fullName: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak cocok!',
  path: ['confirmPassword'],
});

const providerSchema = z.object({
  fullName: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  specialization: z.string().min(3, 'Spesialisasi wajib diisi'),
  bio: z.string().min(10, 'Bio minimal 10 karakter'),
  yearsOfExperience: z.coerce.number()
    .min(0, 'Pengalaman minimal 0 tahun')
    .max(50, 'Pengalaman maksimal 50 tahun'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak cocok!',
  path: ['confirmPassword'],
});

type UserForm = z.infer<typeof userSchema>;
type ProviderForm = z.infer<typeof providerSchema>;

// ─────────────────────────────────────────
// Reusable Input Component
// ─────────────────────────────────────────
function FormInput({
  label, error, children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function RegisterPage() {
  const { login } = useAuthStore();
  const [role, setRole] = useState<'USER' | 'PROVIDER'>('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // USER form
  const userForm = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  // PROVIDER form
  const providerForm = useForm<ProviderForm>({
    resolver: zodResolver(providerSchema),
  });

  const onSubmitUser = async (data: UserForm) => {
    setIsLoading(true);
    setServerError('');
    try {
      const res = await authApi.registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      login(res.data);
      await new Promise(r => setTimeout(r, 100));
      window.location.href = '/dashboard/jobs';
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error.response?.data?.message || 'Registrasi gagal!');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitProvider = async (data: ProviderForm) => {
    setIsLoading(true);
    setServerError('');
    try {
      const res = await authApi.registerProvider({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        specialization: data.specialization,
        bio: data.bio,
        yearsOfExperience: data.yearsOfExperience,
      });
      login(res.data);
      await new Promise(r => setTimeout(r, 100));
      window.location.href = '/dashboard/browse';
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error.response?.data?.message || 'Registrasi gagal!');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError: boolean) => `
    w-full px-4 py-3 rounded-xl border
    focus:outline-none focus:ring-2
    focus:ring-orange-500 focus:border-transparent
    transition-colors text-gray-900
    placeholder:text-gray-400
    ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}
  `;

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
            Buat Akun Baru 🎉
          </h1>
          <p className="mt-2 text-gray-500">
            Bergabung dengan ribuan pengguna SeribuTukang
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => { setRole('USER'); setServerError(''); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl
                        border-2 transition-all font-medium
                        ${role === 'USER'
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}>
            <User className="h-6 w-6" />
            <span>Saya Pemesan</span>
            <span className="text-xs font-normal opacity-70">
              Butuh jasa tukang
            </span>
          </button>

          <button
            onClick={() => { setRole('PROVIDER'); setServerError(''); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl
                        border-2 transition-all font-medium
                        ${role === 'PROVIDER'
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}>
            <HardHat className="h-6 w-6" />
            <span>Saya Tukang</span>
            <span className="text-xs font-normal opacity-70">
              Tawarkan jasa saya
            </span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100
                            rounded-xl text-red-600 text-sm">
              {serverError}
            </div>
          )}

          {/* ── USER FORM ── */}
          {role === 'USER' && (
            <form
              onSubmit={userForm.handleSubmit(onSubmitUser)}
              className="space-y-5">

              <FormInput
                label="Nama Lengkap"
                error={userForm.formState.errors.fullName?.message}>
                <input
                  {...userForm.register('fullName')}
                  placeholder="Budi Santoso"
                  className={inputClass(
                    !!userForm.formState.errors.fullName)}
                />
              </FormInput>

              <FormInput
                label="Email"
                error={userForm.formState.errors.email?.message}>
                <input
                  {...userForm.register('email')}
                  type="email"
                  placeholder="budi@example.com"
                  className={inputClass(
                    !!userForm.formState.errors.email)}
                />
              </FormInput>

              <FormInput
                label="Password"
                error={userForm.formState.errors.password?.message}>
                <div className="relative">
                  <input
                    {...userForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={inputClass(
                      !!userForm.formState.errors.password)
                      + ' pr-12'}
                  />
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               text-gray-400 hover:text-gray-600">
                    {showPassword
                      ? <EyeOff className="h-5 w-5" />
                      : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormInput>

              <FormInput
                label="Konfirmasi Password"
                error={userForm.formState.errors.confirmPassword?.message}>
                <div className="relative">
                  <input
                    {...userForm.register('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={inputClass(
                      !!userForm.formState.errors.confirmPassword)
                      + ' pr-12'}
                  />
                  <button type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               text-gray-400 hover:text-gray-600">
                    {showConfirm
                      ? <EyeOff className="h-5 w-5" />
                      : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormInput>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl
                           font-semibold hover:bg-orange-600 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 mt-2">
                {isLoading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />Mendaftar...</>
                ) : 'Daftar Sebagai Pemesan'}
              </button>
            </form>
          )}

          {/* ── PROVIDER FORM ── */}
          {role === 'PROVIDER' && (
            <form
              onSubmit={providerForm.handleSubmit(onSubmitProvider)}
              className="space-y-5">

              <FormInput
                label="Nama Lengkap"
                error={providerForm.formState.errors.fullName?.message}>
                <input
                  {...providerForm.register('fullName')}
                  placeholder="Pak Tukang"
                  className={inputClass(
                    !!providerForm.formState.errors.fullName)}
                />
              </FormInput>

              <FormInput
                label="Email"
                error={providerForm.formState.errors.email?.message}>
                <input
                  {...providerForm.register('email')}
                  type="email"
                  placeholder="tukang@example.com"
                  className={inputClass(
                    !!providerForm.formState.errors.email)}
                />
              </FormInput>

              <FormInput
                label="Spesialisasi"
                error={providerForm.formState.errors.specialization?.message}>
                <input
                  {...providerForm.register('specialization')}
                  placeholder="Plumber, Electrician, dll"
                  className={inputClass(
                    !!providerForm.formState.errors.specialization)}
                />
              </FormInput>

              <FormInput
                label="Bio / Deskripsi Diri"
                error={providerForm.formState.errors.bio?.message}>
                <textarea
                  {...providerForm.register('bio')}
                  rows={3}
                  placeholder="Ceritakan pengalaman dan keahlian Anda..."
                  className={inputClass(
                    !!providerForm.formState.errors.bio)
                    + ' resize-none'}
                />
              </FormInput>

              <FormInput
                label="Tahun Pengalaman"
                error={providerForm.formState.errors.yearsOfExperience?.message}>
                <input
                  {...providerForm.register('yearsOfExperience')}
                  type="number"
                  min="0"
                  max="50"
                  placeholder="5"
                  className={inputClass(
                    !!providerForm.formState.errors.yearsOfExperience)}
                />
              </FormInput>

              <FormInput
                label="Password"
                error={providerForm.formState.errors.password?.message}>
                <div className="relative">
                  <input
                    {...providerForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={inputClass(
                      !!providerForm.formState.errors.password)
                      + ' pr-12'}
                  />
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               text-gray-400 hover:text-gray-600">
                    {showPassword
                      ? <EyeOff className="h-5 w-5" />
                      : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormInput>

              <FormInput
                label="Konfirmasi Password"
                error={providerForm.formState.errors.confirmPassword?.message}>
                <div className="relative">
                  <input
                    {...providerForm.register('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={inputClass(
                      !!providerForm.formState.errors.confirmPassword)
                      + ' pr-12'}
                  />
                  <button type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               text-gray-400 hover:text-gray-600">
                    {showConfirm
                      ? <EyeOff className="h-5 w-5" />
                      : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormInput>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl
                           font-semibold hover:bg-orange-600 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 mt-2">
                {isLoading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />Mendaftar...</>
                ) : 'Daftar Sebagai Tukang'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-sm text-gray-400">atau</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Sudah punya akun?{' '}
            <Link href="/login"
              className="text-orange-500 font-semibold hover:text-orange-600">
              Masuk Sekarang
            </Link>
          </p>
        </div>

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