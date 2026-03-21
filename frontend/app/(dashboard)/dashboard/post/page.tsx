'use client';

import { categoryApi, jobApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { CategoryResponse } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const postJobSchema = z.object({
  serviceCategoryId: z.coerce.number().min(1, 'Pilih kategori jasa'),
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  location: z.string().min(3, 'Lokasi wajib diisi'),
  budget: z.coerce.number().min(0, 'Budget tidak valid').optional(),
  scheduledAt: z.string().optional(),
});

type PostJobForm = z.infer<typeof postJobSchema>;

export default function PostJobPage() {
  const { isAuthenticated, initialize } = useAuthStore();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostJobForm>({
    resolver: zodResolver(postJobSchema),
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    categoryApi.getAll().then(res => setCategories(res.data.data));
  }, [isAuthenticated]);

  const onSubmit = async (data: PostJobForm) => {
    setIsLoading(true);
    setServerError('');
    try {
      await jobApi.create({
        serviceCategoryId: data.serviceCategoryId,
        title: data.title,
        description: data.description,
        location: data.location,
        budget: data.budget,
        scheduledAt: data.scheduledAt || undefined,
      });
      window.location.href = '/dashboard/jobs';
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error.response?.data?.message || 'Gagal membuat pekerjaan!');
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
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-gray-500
                     hover:text-orange-500 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Pasang Iklan Pekerjaan 🔨
        </h1>
        <p className="text-gray-500 mt-1">
          Ceritakan pekerjaan yang Anda butuhkan
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100
                          rounded-xl text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kategori Jasa <span className="text-red-500">*</span>
            </label>
            <select
              {...register('serviceCategoryId')}
              className={inputClass(!!errors.serviceCategoryId)}>
              <option value="">Pilih kategori...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.serviceCategoryId && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.serviceCategoryId.message}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Judul Pekerjaan <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              placeholder="Contoh: Perbaikan pipa bocor kamar mandi"
              className={inputClass(!!errors.title)}
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Jelaskan detail pekerjaan yang dibutuhkan..."
              className={inputClass(!!errors.description) + ' resize-none'}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              {...register('location')}
              placeholder="Contoh: Jakarta Selatan, Kebayoran Baru"
              className={inputClass(!!errors.location)}
            />
            {errors.location && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Budget + Schedule side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Budget (Rp)
              </label>
              <input
                {...register('budget')}
                type="number"
                min="0"
                placeholder="500000"
                className={inputClass(!!errors.budget)}
              />
              {errors.budget && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.budget.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Jadwal (Opsional)
              </label>
              <input
                {...register('scheduledAt')}
                type="datetime-local"
                className={inputClass(!!errors.scheduledAt)}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white py-3.5 rounded-xl
                       font-semibold hover:bg-orange-600 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2">
            {isLoading ? (
              <><Loader2 className="h-5 w-5 animate-spin" />Memposting...</>
            ) : '🔨 Pasang Iklan Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}