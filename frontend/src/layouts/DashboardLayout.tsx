import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/Toast';
import {
  LayoutDashboard,
  FileCheck,
  TrendingUp,
  Bookmark,
  Award,
  Zap,
  User,
} from 'lucide-react';
import { useAppSelector } from '../hooks/storeHooks';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Test History', path: '/my-tests', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Performance Analytics', path: '/performance', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Bookmarked Questions', path: '/bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Award className="w-4 h-4" /> },
    { label: 'Practice Mode', path: '/practice', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center">
              <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{user?.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-200">
                {user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
              </span>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Content Pane */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};
