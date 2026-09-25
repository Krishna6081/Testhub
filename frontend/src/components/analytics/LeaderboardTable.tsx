import React from 'react';
import { LeaderboardUser } from '../../types';
import { Trophy, Award, Medal, User as UserIcon } from 'lucide-react';

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  currentUserId?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ users, currentUserId }) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-extrabold shadow-xs">
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold shadow-xs">
            <Medal className="w-5 h-5 text-slate-500" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-800/10 text-amber-800 flex items-center justify-center font-extrabold shadow-xs">
            <Award className="w-5 h-5 text-amber-800" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Rank</th>
              <th className="py-3.5 px-6">Student</th>
              <th className="py-3.5 px-6 text-center">Tests Taken</th>
              <th className="py-3.5 px-6 text-center">Total Score</th>
              <th className="py-3.5 px-6 text-center">Avg Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map((u) => {
              const isMe = u.userId === currentUserId;
              return (
                <tr
                  key={u.userId}
                  className={`transition-colors hover:bg-slate-50 ${
                    isMe ? 'bg-brand-50/60 font-semibold' : ''
                  }`}
                >
                  <td className="py-4 px-6">{getRankBadge(u.rank)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold overflow-hidden">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {u.name} {isMe && <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full">You</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-medium text-slate-700">{u.testsCompleted}</td>
                  <td className="py-4 px-6 text-center font-bold text-brand-600">{u.totalScore} pts</td>
                  <td className="py-4 px-6 text-center font-medium text-emerald-600">{u.averageAccuracy}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
