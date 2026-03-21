'use client';

import { jobApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { JobResponse, JobStatus } from '@/types';
import {
    Briefcase,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    Loader2,
    MapPin,
    Plus,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const statusConfig: Record<JobStatus, {
  label: string;
  color: string;
  icon: React.ReactNode;
}> = {
  OPEN: {
    label: 'Menunggu Tukang',
    color: 'bg-blue-100 text-blue-700',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  ASSIGNED: {
    label: 'Tukang Ditemukan',
    color: 'bg-orange-100 text-orange-700',
    icon: <Briefcase className="h-3.5 w-3.5" />,
  },
  COMPLETED: {
    label: 'Selesai',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  CANCELLED: {
    label: 'Dibatalkan',
    color: 'bg-gray-100 text-gray-600',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export default function MyJobsPage() {
  const { user, isAuthenticated, initialize } = useAuthStore();
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    fetchJobs();
  }, [isAuthenticated, activeFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const status = activeFilter === 'ALL' ? undefined : activeFilter;
      const res = await jobApi.getMyJobs(status);
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filters = ['ALL', 'OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'];
  const filterLabels: Record<string, string> = {
    ALL: 'Semua',
    OPEN: 'Menunggu',
    ASSIGNED: 'Dikerjakan',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pekerjaan Saya 📋
          </h1>
          <p className="text-gray-500 mt-1">
            Halo {user?.fullName.split(' ')[0]}! Kelola pekerjaan Anda di sini.
          </p>
        </div>
        <Link
          href="/dashboard/post"
          className="bg-orange-500 text-white px-4 py-2.5 rounded-xl
                     font-semibold hover:bg-orange-600 transition-colors
                     flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Pasang Iklan
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium
                        whitespace-nowrap transition-colors
                        ${activeFilter === filter
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                        }`}>
            {filterLabels[filter]}
          </button>
        ))}
      </div>

      {/* Job List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Belum ada pekerjaan
          </h3>
          <p className="text-gray-500 mb-6">
            Pasang iklan pertama Anda dan temukan tukang terbaik!
          </p>
          <Link
            href="/dashboard/post"
            className="bg-orange-500 text-white px-6 py-3 rounded-xl
                       font-semibold hover:bg-orange-600 transition-colors
                       inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Pasang Iklan Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => {
            const config = statusConfig[job.status];
            return (
              <div key={job.id}
                className="bg-white rounded-2xl border border-gray-100
                           p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">

                    {/* Status badge */}
                    <div className={`inline-flex items-center gap-1.5
                                    px-2.5 py-1 rounded-full text-xs
                                    font-medium mb-3 ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 text-lg
                                   truncate mb-2">
                      {job.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {job.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                      )}
                      {job.budget && (
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4" />
                          Rp {job.budget.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="flex items-center gap-1 text-orange-500
                               font-medium text-sm hover:text-orange-600
                               whitespace-nowrap">
                    Detail
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}