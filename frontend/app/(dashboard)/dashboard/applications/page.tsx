'use client';

import { applicationApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ApplicationStatus, JobApplicationResponse } from '@/types';
import {
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    Loader2,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const statusConfig: Record<ApplicationStatus, {
  label: string;
  color: string;
  icon: React.ReactNode;
}> = {
  PENDING: {
    label: 'Menunggu',
    color: 'bg-yellow-100 text-yellow-700',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  ACCEPTED: {
    label: 'Diterima! 🎉',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  REJECTED: {
    label: 'Ditolak',
    color: 'bg-red-100 text-red-600',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export default function MyApplicationsPage() {
  const { isAuthenticated, initialize } = useAuthStore();
  const [applications, setApplications] = useState<JobApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    applicationApi.getMyApplications()
      .then(res => setApplications(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Lamaran Saya 📨
        </h1>
        <p className="text-gray-500 mt-1">
          Pantau status lamaran pekerjaan Anda
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Belum ada lamaran
          </h3>
          <p className="text-gray-500 mb-6">
            Mulai lamar pekerjaan dan tingkatkan penghasilan Anda!
          </p>
          <Link
            href="/dashboard/browse"
            className="bg-orange-500 text-white px-6 py-3 rounded-xl
                       font-semibold hover:bg-orange-600 transition-colors
                       inline-block">
            Cari Pekerjaan
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const config = statusConfig[app.status];
            return (
              <div key={app.id}
                className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">

                    {/* Status */}
                    <div className={`inline-flex items-center gap-1.5
                                    px-2.5 py-1 rounded-full text-xs
                                    font-medium mb-3 ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </div>

                    <p className="text-gray-700 mb-3 text-sm">
                      {app.message}
                    </p>

                    <div className="flex gap-4 text-sm text-gray-500">
                      {app.proposedPrice && (
                        <span className="flex items-center gap-1.5
                                         text-orange-600 font-medium">
                          <DollarSign className="h-4 w-4" />
                          Rp {app.proposedPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                      <span className="text-gray-400">
                        Job #{app.jobId}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/jobs/${app.jobId}`}
                    className="flex items-center gap-1 text-orange-500
                               font-medium text-sm hover:text-orange-600
                               whitespace-nowrap">
                    Lihat Job
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