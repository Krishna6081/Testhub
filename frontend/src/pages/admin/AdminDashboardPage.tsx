import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Users, FileSpreadsheet, HelpCircle, FileCheck, Calendar, ShieldCheck } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getStatistics()
      .then((res) => {
        if (res.success) setStats(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading admin statistics..." />;
  if (!stats) return <div className="p-8 text-center text-slate-500">Failed to load admin stats.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">System Performance & Platform Overview</h2>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <Users className="w-5 h-5 text-purple-600 mx-auto" />
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Users</span>
          <p className="text-2xl font-black text-slate-900">{stats.totalUsers}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <FileSpreadsheet className="w-5 h-5 text-brand-600 mx-auto" />
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Tests</span>
          <p className="text-2xl font-black text-slate-900">{stats.totalTests}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <HelpCircle className="w-5 h-5 text-indigo-600 mx-auto" />
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Questions Bank</span>
          <p className="text-2xl font-black text-slate-900">{stats.totalQuestions}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <FileCheck className="w-5 h-5 text-emerald-600 mx-auto" />
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Attempts</span>
          <p className="text-2xl font-black text-slate-900">{stats.totalAttempts}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <Calendar className="w-5 h-5 text-amber-600 mx-auto" />
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Today Attempts</span>
          <p className="text-2xl font-black text-amber-600">{stats.todaysAttempts}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <ShieldCheck className="w-5 h-5 text-cyan-600 mx-auto" />
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Active Users</span>
          <p className="text-2xl font-black text-cyan-600">{stats.activeUsers}</p>
        </div>
      </div>

      {/* Section Popularity */}
      {stats.sectionPopularity && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Section Attempt Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.sectionPopularity.map((sp: any) => (
              <div key={sp.name} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-xs text-slate-800">{sp.name}</span>
                <span className="font-bold text-sm text-purple-700">{sp.attempts} Attempts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
