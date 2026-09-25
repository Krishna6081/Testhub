import React from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle, Target, Clock, Zap } from 'lucide-react';

interface ResultCardProps {
  score: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  timeTaken: number; // seconds
}

export const ResultCard: React.FC<ResultCardProps> = ({
  score,
  totalMarks,
  percentage,
  accuracy,
  correctAnswers,
  incorrectAnswers,
  unattempted,
  timeTaken,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  const getGradeInfo = (pct: number) => {
    if (pct >= 85) return { grade: 'Excellent!', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (pct >= 70) return { grade: 'Good Job!', color: 'text-brand-600 bg-brand-50 border-brand-200' };
    if (pct >= 50) return { grade: 'Average', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { grade: 'Needs Improvement', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const grade = getGradeInfo(percentage);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
      {/* Top Banner Grade */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Award className="w-9 h-9" />
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${grade.color}`}>
              {grade.grade}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Test Results</h2>
          </div>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-2 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
          <span className="text-4xl font-black text-brand-600">{score}</span>
          <span className="text-sm font-semibold text-slate-400">/ {totalMarks} Marks</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Percentage */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
          <Zap className="w-5 h-5 text-indigo-600 mb-1" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Score %</span>
          <span className="text-2xl font-bold text-slate-900 mt-1">{percentage}%</span>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
          <Target className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Accuracy</span>
          <span className="text-2xl font-bold text-slate-900 mt-1">{accuracy}%</span>
        </div>

        {/* Correct Answers */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Correct</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1">{correctAnswers}</span>
        </div>

        {/* Time Taken */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
          <Clock className="w-5 h-5 text-cyan-600 mb-1" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Time Taken</span>
          <span className="text-lg font-bold text-slate-900 mt-1">{formatTime(timeTaken)}</span>
        </div>
      </div>

      {/* Breakdown bar */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span className="text-emerald-600">{correctAnswers} Correct</span>
          <span className="text-rose-600">{incorrectAnswers} Incorrect</span>
          <span className="text-slate-400">{unattempted} Unattempted</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {correctAnswers > 0 && (
            <div
              style={{ width: `${(correctAnswers / (correctAnswers + incorrectAnswers + unattempted)) * 100}%` }}
              className="bg-emerald-500 h-full"
            />
          )}
          {incorrectAnswers > 0 && (
            <div
              style={{ width: `${(incorrectAnswers / (correctAnswers + incorrectAnswers + unattempted)) * 100}%` }}
              className="bg-rose-500 h-full"
            />
          )}
          {unattempted > 0 && (
            <div
              style={{ width: `${(unattempted / (correctAnswers + incorrectAnswers + unattempted)) * 100}%` }}
              className="bg-slate-300 h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};
