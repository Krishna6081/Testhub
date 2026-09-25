import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { TestAttempt } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { FileCheck, RotateCcw, Eye, Clock, Award } from 'lucide-react';

export const MyTestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    attemptService
      .getUserAttempts({ page, limit: 10 })
      .then((res) => {
        if (res.success) {
          setAttempts(res.data.attempts);
          setTotalPages(res.data.pagination.totalPages);
        }
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <LoadingSpinner message="Loading your test history..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Test History</h1>
          <p className="text-xs text-slate-500">Track past performance, review solutions, and retry tests.</p>
        </div>
        <Link to="/tests">
          <Button size="sm">Browse More Tests</Button>
        </Link>
      </div>

      {attempts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <FileCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-slate-600 font-medium">You haven't attempted any tests yet.</p>
          <Link to="/tests" className="text-xs font-bold text-brand-600 hover:underline inline-block">
            Start Your First Practice Test
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Test Title</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6 text-center">Score</th>
                    <th className="py-3.5 px-6 text-center">Percentage</th>
                    <th className="py-3.5 px-6 text-center">Accuracy</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {att.test?.title || 'Practice Test'}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {new Date(att.createdAt || '').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-brand-600">
                        {att.score} pts
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-slate-800">
                        {att.percentage}%
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-emerald-600">
                        {att.accuracy}%
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/attempts/${att.id}/result`}
                            className="p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                            title="View Detailed Results & Solutions"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/tests/${att.testId}`}
                            className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="Retry Test"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>
      )}
    </div>
  );
};
