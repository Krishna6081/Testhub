import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { LeaderboardUser } from '../types';
import { LeaderboardTable } from '../components/analytics/LeaderboardTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAppSelector } from '../hooks/storeHooks';
import { Award, Trophy, Medal } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly' | 'daily'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dashboardService
      .getLeaderboard(timeframe)
      .then((res) => {
        if (res.success) setUsers(res.data);
      })
      .finally(() => setLoading(false));
  }, [timeframe]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-amber-200" />
          <h1 className="text-3xl font-extrabold">TestHub Hall of Fame</h1>
        </div>
        <p className="text-amber-100 text-sm max-w-xl">
          Top scoring students ranked by total points, test completion volume, and accuracy percentage.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          {(['all', 'monthly', 'weekly', 'daily'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                timeframe === tf
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tf === 'all' ? 'All Time' : tf}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Calculating student rankings..." />
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          No rankings recorded for this timeframe yet.
        </div>
      ) : (
        <LeaderboardTable users={users} currentUserId={user?.id} />
      )}
    </div>
  );
};
