import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { PerformanceChart } from '../components/analytics/PerformanceChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const PerformancePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getPerformance()
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Generating performance analytics..." />;
  if (!data) return <div className="p-8 text-center text-slate-500">Failed to load analytics data.</div>;

  const { performanceOverTime, sectionPerformance, topicPerformance } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Performance Analytics</h1>
        <p className="text-xs text-slate-500">Visual progress tracking, section accuracy, and score trends.</p>
      </div>

      {/* Score Progress Chart */}
      <PerformanceChart
        title="Score Progress Over Time (%)"
        data={performanceOverTime}
        dataKey="percentage"
        xAxisKey="date"
        type="area"
      />

      {/* Section Accuracy Chart */}
      <PerformanceChart
        title="Section-wise Accuracy (%)"
        data={sectionPerformance}
        dataKey="accuracy"
        xAxisKey="sectionName"
        type="bar"
      />

      {/* Topic Accuracy Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Topic-wise Accuracy Breakdown</h3>
        <div className="space-y-3">
          {topicPerformance.map((top: any) => (
            <div key={top.topicName} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800">{top.topicName}</span>
                <span className={top.accuracy >= 70 ? 'text-emerald-600' : 'text-rose-600'}>
                  {top.accuracy}% Accuracy ({top.correct}/{top.attempted})
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${top.accuracy}%` }}
                  className={`h-full rounded-full ${
                    top.accuracy >= 70 ? 'bg-emerald-500' : top.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
