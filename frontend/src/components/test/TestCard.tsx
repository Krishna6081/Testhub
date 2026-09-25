import React from 'react';
import { Link } from 'react-router-dom';
import { Test } from '../../types';
import { Clock, HelpCircle, Award, PlayCircle, Flame, Layers } from 'lucide-react';

interface TestCardProps {
  test: Test;
}

export const TestCard: React.FC<TestCardProps> = ({ test }) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Easy</span>;
      case 'HARD':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Hard</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Medium</span>;
    }
  };

  const getTestTypeBadge = (type: string) => {
    switch (type) {
      case 'FULL_LENGTH':
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">Full Length</span>;
      case 'DAILY':
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider flex items-center gap-1"><Flame className="w-3 h-3 text-amber-600" /> Daily Test</span>;
      case 'MIXED':
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-700 uppercase tracking-wider">Mixed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">{type}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {getTestTypeBadge(test.testType)}
          {getDifficultyBadge(test.difficulty)}
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
          {test.title}
        </h3>

        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {test.description || 'Practice test designed to assess speed, accuracy, and subject knowledge.'}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-2 mt-5 py-3 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]"><HelpCircle className="w-3.5 h-3.5" /> Questions</span>
            <span className="font-bold text-slate-800 mt-0.5">{test.totalQuestions}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-x border-slate-200">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]"><Clock className="w-3.5 h-3.5" /> Time</span>
            <span className="font-bold text-slate-800 mt-0.5">{test.duration} mins</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]"><Award className="w-3.5 h-3.5" /> Marks</span>
            <span className="font-bold text-slate-800 mt-0.5">{test.totalMarks}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Negative Marking: -{test.negativeMarking}</span>
          <span>{test._count?.attempts || 0} Attempts</span>
        </div>
      </div>

      <div className="mt-5">
        <Link
          to={`/tests/${test.id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-xs transition-all active:scale-[0.99]"
        >
          <PlayCircle className="w-4 h-4" /> Start Test
        </Link>
      </div>
    </div>
  );
};
