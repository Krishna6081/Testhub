import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/Toast';
import {
  ShieldAlert,
  Users,
  Layers,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
  Upload,
  LayoutDashboard,
} from 'lucide-react';
import { useAppSelector } from '../hooks/storeHooks';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-600 mt-2 max-w-md">
          You do not have administrative privileges to access this control panel.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 px-6 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const adminNavItems = [
    { label: 'Admin Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Manage Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Manage Sections', path: '/admin/sections', icon: <Layers className="w-4 h-4" /> },
    { label: 'Manage Topics', path: '/admin/topics', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Manage Questions', path: '/admin/questions', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Manage Tests', path: '/admin/tests', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { label: 'Import Questions', path: '/admin/import', icon: <Upload className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">TestHub Admin Control Center</h1>
            <p className="text-xs text-slate-500">System management, question bank, test publisher & user directory</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Admin Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xs'
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

          {/* Admin Main View */}
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
