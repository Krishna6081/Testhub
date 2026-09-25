import React, { useEffect, useState } from 'react';
import { testService } from '../services/testService';
import { Test } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TestCard } from '../components/test/TestCard';
import { Flame, Clock, Award, HelpCircle } from 'lucide-react';

export const DailyTestPage: React.FC = () => {
  const [dailyTest, setDailyTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testService
      .getTests({ testType: 'DAILY', limit: 1 })
      .then((res) => {
        if (res.success && res.data.tests.length > 0) {
          setDailyTest(res.data.tests[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Fetching Today's Challenge Test..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Daily Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-8 h-8 text-amber-200 animate-bounce" />
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/20">
            Daily Practice Streak
          </span>
        </div>

        <h1 className="text-3xl font-extrabold">Daily Test Challenge #125</h1>
        <p className="text-amber-100 text-sm max-w-xl leading-relaxed">
          Test your memory, speed, and accuracy with today's curated mixed practice questions from Reasoning, Math, Science, and GK.
        </p>
      </div>

      {dailyTest ? (
        <div className="max-w-md mx-auto">
          <TestCard test={dailyTest} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          No daily test scheduled for today. Check back tomorrow!
        </div>
      )}
    </div>
  );
};
