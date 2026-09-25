import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { useAppSelector } from '../hooks/storeHooks';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TestCard } from '../components/test/TestCard';
import {
  FileCheck,
  HelpCircle,
  TrendingUp,
  Target,
  AlertTriangle,
  PlayCircle,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading your dashboard statistics..." />;
  if (!data) return <div className="p-8 text-center text-slate-500">Failed to load dashboard data.</div>;

  const { stats, recentAttempts, recommendedTests, weakTopics } = data;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Student Performance Dashboard
          </span>
          <h1 className="text-2xl md:text-3xl font-black">Welcome back, {user?.name}!</h1>
          <p className="text-slate-300 text-xs md:text-sm">
            Keep up your test streak. Here is a summary of your competitive exam preparation status.
          </p>
        </div>
        <Link
          to="/tests"
          className="px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 flex-shrink-0"
        >
          <PlayCircle className="w-4 h-4" /> Start New Test
        </Link>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tests Attempted */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Tests Attempted</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.testsAttempted}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Questions Solved */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Questions Solved</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.questionsSolved}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Average Score</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.averageScore}%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Overall Accuracy</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats.accuracy}%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Weak Topics Automatic Alert */}
      {weakTopics && weakTopics.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Weak Topics Identified ({weakTopics.length})</span>
          </div>
          <p className="text-xs text-amber-800">
            Your accuracy in these topics is below 65%. Focused practice is recommended.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {weakTopics.map((wt: any) => (
              <div
                key={wt.topicId}
                className="bg-white rounded-xl p-4 border border-amber-200 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{wt.topicName}</h4>
                  <span className="text-[10px] text-rose-600 font-semibold">
                    {wt.accuracy}% Accuracy ({wt.correct}/{wt.total})
                  </span>
                </div>
                <Link
                  to={`/topics/${wt.topicId}`}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                >
                  Practice Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tests Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Test Attempts</h2>
          <Link to="/my-tests" className="text-xs font-semibold text-brand-600 hover:underline">
            View All History
          </Link>
        </div>

        {recentAttempts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500 text-xs">
            No test attempts completed yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                    <th className="py-3 px-5">Test Title</th>
                    <th className="py-3 px-5 text-center">Score</th>
                    <th className="py-3 px-5 text-center">Accuracy</th>
                    <th className="py-3 px-5 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentAttempts.map((att: any) => (
                    <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">{att.test?.title}</td>
                      <td className="py-3.5 px-5 text-center font-bold text-brand-600">{att.score} pts</td>
                      <td className="py-3.5 px-5 text-center font-semibold text-emerald-600">{att.accuracy}%</td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          to={`/attempts/${att.id}/result`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 inline-block"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Tests */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900">Recommended Practice Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedTests.slice(0, 4).map((t: any) => (
            <TestCard key={t.id} test={t} />
          ))}
        </div>
      </div>
    </div>
  );
};
