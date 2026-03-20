'use client';

import { categoryApi } from '@/lib/api';
import { CategoryResponse } from '@/types';
import {
  ChevronRight,
  Clock,
  Hammer,
  Paintbrush,
  Search,
  Shield,
  Sparkles,
  ThumbsUp,
  Wind,
  Wrench, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  'Plumbing':    <Wrench className="h-8 w-8" />,
  'Electrical':  <Zap className="h-8 w-8" />,
  'Cleaning':    <Sparkles className="h-8 w-8" />,
  'Painting':    <Paintbrush className="h-8 w-8" />,
  'AC Service':  <Wind className="h-8 w-8" />,
  'Carpentry':   <Hammer className="h-8 w-8" />,
};

// Category colors mapping
const categoryColors: Record<string, string> = {
  'Plumbing':   'bg-blue-50 text-blue-600 hover:bg-blue-100',
  'Electrical': 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
  'Cleaning':   'bg-green-50 text-green-600 hover:bg-green-100',
  'Painting':   'bg-purple-50 text-purple-600 hover:bg-purple-100',
  'AC Service': 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
  'Carpentry':  'bg-orange-50 text-orange-600 hover:bg-orange-100',
};

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">

      {/* ── HERO SECTION ── */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Temukan Tukang
            <br />
            <span className="text-orange-100">Terpercaya</span> di Sekitar Anda
          </h1>
          <p className="text-orange-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Platform marketplace jasa tukang profesional.
            Plumbing, listrik, cleaning, dan lebih banyak lagi —
            cepat, aman, dan terpercaya. 🇮🇩
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2
                                 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari jasa tukang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-orange-300
                           text-base"
              />
            </div>
            <Link
              href={`/jobs${searchQuery ? `?q=${searchQuery}` : ''}`}
              className="bg-white text-orange-500 px-6 py-4 rounded-xl
                         font-semibold hover:bg-orange-50 transition-colors
                         whitespace-nowrap">
              Cari Sekarang
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 mt-12 text-orange-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-sm">Tukang Terverifikasi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5000+</div>
              <div className="text-sm">Pekerjaan Selesai</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.8⭐</div>
              <div className="text-sm">Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES SECTION ── */}
      <section className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Layanan Kami
          </h2>
          <p className="text-gray-500 text-lg">
            Pilih kategori jasa yang Anda butuhkan
          </p>
        </div>

        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}
                className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/jobs?serviceCategoryId=${cat.id}`}
                className={`flex flex-col items-center justify-center gap-3
                            p-8 rounded-2xl transition-all duration-200
                            cursor-pointer border border-transparent
                            hover:border-current hover:shadow-md
                            ${categoryColors[cat.name] ||
                              'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                {categoryIcons[cat.name] || <Wrench className="h-8 w-8" />}
                <span className="font-semibold text-base">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-orange-500
                       font-semibold hover:text-orange-600 transition-colors">
            Lihat Semua Pekerjaan
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Cara Kerja SeribuTukang
            </h2>
            <p className="text-gray-500 text-lg">
              Mudah, cepat, dan terpercaya
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full
                              flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">1</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Pasang Iklan
              </h3>
              <p className="text-gray-500">
                Ceritakan pekerjaan yang Anda butuhkan.
                Gratis dan mudah!
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full
                              flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">2</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Terima Penawaran
              </h3>
              <p className="text-gray-500">
                Tukang profesional akan melamar.
                Pilih yang terbaik!
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full
                              flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">3</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Pekerjaan Selesai
              </h3>
              <p className="text-gray-500">
                Konfirmasi selesai dan beri ulasan
                untuk tukang Anda!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY SERIBUTUKANG ── */}
      <section className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Mengapa SeribuTukang?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border
                          border-gray-100 flex gap-4">
            <div className="bg-green-100 p-3 rounded-xl h-fit">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Tukang Terverifikasi
              </h3>
              <p className="text-gray-500 text-sm">
                Semua tukang telah melalui proses
                verifikasi ketat kami.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border
                          border-gray-100 flex gap-4">
            <div className="bg-blue-100 p-3 rounded-xl h-fit">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Respons Cepat
              </h3>
              <p className="text-gray-500 text-sm">
                Rata-rata tukang merespons dalam
                waktu kurang dari 1 jam.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border
                          border-gray-100 flex gap-4">
            <div className="bg-yellow-100 p-3 rounded-xl h-fit">
              <ThumbsUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Garansi Kepuasan
              </h3>
              <p className="text-gray-500 text-sm">
                Tidak puas? Kami akan bantu
                mencarikan solusi terbaik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600
                          text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Mulai? 🔨
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang telah
            menemukan tukang terpercaya mereka di SeribuTukang.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-white text-orange-500 px-8 py-4 rounded-xl
                         font-bold hover:bg-orange-50 transition-colors text-lg">
              Cari Tukang Sekarang
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-xl
                         font-bold hover:bg-orange-600 transition-colors text-lg">
              Daftar Sebagai Tukang
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}