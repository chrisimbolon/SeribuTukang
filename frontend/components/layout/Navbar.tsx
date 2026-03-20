'use client';

import { useAuthStore } from '@/store/authStore';
import { Briefcase, LogOut, Menu, User, Wrench, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isUser, isProvider, logout, initialize } =
    useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  // Restore auth state from cookies on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">
              Seribu<span className="text-orange-500">Tukang</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-orange-500 
                         font-medium transition-colors">
              Cari Tukang
            </Link>

            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-orange-500 
                             font-medium transition-colors">
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-500 text-white px-4 py-2 
                             rounded-lg font-medium hover:bg-orange-600 
                             transition-colors">
                  Daftar
                </Link>
              </>
            )}

            {isAuthenticated && (
              <div className="flex items-center gap-4">
                {/* USER links */}
                {isUser && (
                  <>
                    <Link
                      href="/dashboard/post"
                      className="bg-orange-500 text-white px-4 py-2 
                                 rounded-lg font-medium hover:bg-orange-600 
                                 transition-colors flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Pasang Iklan
                    </Link>
                    <Link
                      href="/dashboard/jobs"
                      className="text-gray-600 hover:text-orange-500 
                                 font-medium transition-colors">
                      Pekerjaan Saya
                    </Link>
                  </>
                )}

                {/* PROVIDER links */}
                {isProvider && (
                  <>
                    <Link
                      href="/dashboard/browse"
                      className="bg-orange-500 text-white px-4 py-2 
                                 rounded-lg font-medium hover:bg-orange-600 
                                 transition-colors flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Cari Pekerjaan
                    </Link>
                    <Link
                      href="/dashboard/applications"
                      className="text-gray-600 hover:text-orange-500 
                                 font-medium transition-colors">
                      Lamaran Saya
                    </Link>
                  </>
                )}

                {/* User info + logout */}
                <div className="flex items-center gap-3 border-l pl-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-1.5 rounded-full">
                      <User className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.fullName.split(' ')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 
                               transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen
              ? <X className="h-6 w-6" />
              : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 
                          flex flex-col gap-4">
            <Link
              href="/jobs"
              className="text-gray-600 font-medium"
              onClick={() => setMenuOpen(false)}>
              Cari Tukang
            </Link>

            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 font-medium"
                  onClick={() => setMenuOpen(false)}>
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-500 text-white px-4 py-2 
                             rounded-lg font-medium text-center"
                  onClick={() => setMenuOpen(false)}>
                  Daftar
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                {isUser && (
                  <>
                    <Link href="/dashboard/post"
                      className="text-gray-600 font-medium"
                      onClick={() => setMenuOpen(false)}>
                      Pasang Iklan
                    </Link>
                    <Link href="/dashboard/jobs"
                      className="text-gray-600 font-medium"
                      onClick={() => setMenuOpen(false)}>
                      Pekerjaan Saya
                    </Link>
                  </>
                )}
                {isProvider && (
                  <>
                    <Link href="/dashboard/browse"
                      className="text-gray-600 font-medium"
                      onClick={() => setMenuOpen(false)}>
                      Cari Pekerjaan
                    </Link>
                    <Link href="/dashboard/applications"
                      className="text-gray-600 font-medium"
                      onClick={() => setMenuOpen(false)}>
                      Lamaran Saya
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 font-medium">
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}