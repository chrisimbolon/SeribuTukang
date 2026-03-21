'use client';

import { categoryApi, jobApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { CategoryResponse, JobResponse } from '@/types';
import {
    ChevronRight,
    Clock,
    DollarSign,
    Loader2,
    MapPin,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BrowseJobsPage() {
  const { isAuthenticated, initialize } = useAuthStore();
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [search, setSearch] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    categoryApi.getAll().then(res => setCategories(res.data.data));
    fetchJobs();
  }, [isAuthenticated, selectedCategory]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobApi.listOpen(selectedCategory);
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.description.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Cari Pekerjaan 🔍
        </h1>
        <p className="text-gray-500 mt-1">
          Temukan pekerjaan yang sesuai keahlian Anda
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2
                           h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari pekerjaan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                     bg-white focus:outline-none focus:ring-2
                     focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium
                      whitespace-nowrap transition-colors
                      ${!selectedCategory
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                      }`}>
          Semua
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium
                        whitespace-nowrap transition-colors
                        ${selectedCategory === cat.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                        }`}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          {filteredJobs.length} pekerjaan tersedia
        </p>
      )}

      {/* Job List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Tidak ada pekerjaan
          </h3>
          <p className="text-gray-500">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <div key={job.id}
              className="bg-white rounded-2xl border border-gray-100
                         p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">

                  {/* New badge */}
                  <div className="inline-flex items-center gap-1.5
                                  px-2.5 py-1 rounded-full text-xs
                                  font-medium mb-3
                                  bg-green-100 text-green-700">
                    <Clock className="h-3.5 w-3.5" />
                    Baru Diposting
                  </div>

                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {job.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                    )}
                    {job.budget && (
                      <span className="flex items-center gap-1.5 text-orange-600 font-medium">
                        <DollarSign className="h-4 w-4" />
                        Rp {job.budget.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-1 text-orange-500
                             font-medium text-sm hover:text-orange-600
                             whitespace-nowrap">
                  Lamar
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}