import React from 'react';
import { Question } from '../../types';

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string | null>;
  visitedIndices: Set<number>;
  markedForReview: Set<number>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  answers,
  visitedIndices,
  markedForReview,
  onSelectQuestion,
}) => {
  // Counts
  let answeredCount = 0;
  let notAnsweredCount = 0;
  let markedCount = 0;
  let unvisitedCount = 0;

  questions.forEach((q, idx) => {
    const hasAns = answers[q.id] !== undefined && answers[q.id] !== null;
    const isMarked = markedForReview.has(idx);
    const isVisited = visitedIndices.has(idx);

    if (isMarked) {
      markedCount++;
    } else if (hasAns) {
      answeredCount++;
    } else if (isVisited) {
      notAnsweredCount++;
    } else {
      unvisitedCount++;
    }
  });

  const getButtonStatusClass = (index: number, questionId: string) => {
    const isCurrent = index === currentIndex;
    const hasAns = answers[questionId] !== undefined && answers[questionId] !== null;
    const isMarked = markedForReview.has(index);
    const isVisited = visitedIndices.has(index);

    let baseClass = 'w-9 h-9 md:w-10 md:h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer border ';

    if (isCurrent) {
      baseClass += 'ring-2 ring-brand-500 ring-offset-2 scale-105 z-10 ';
    }

    if (isMarked) {
      return baseClass + 'bg-purple-600 text-white border-purple-700 shadow-xs';
    }
    if (hasAns) {
      return baseClass + 'bg-emerald-600 text-white border-emerald-700 shadow-xs';
    }
    if (isVisited) {
      return baseClass + 'bg-rose-50 text-rose-600 border-rose-300 font-semibold';
    }
    return baseClass + 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-full">
      <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
        Question Palette ({questions.length})
      </h3>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 my-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-emerald-600 flex-shrink-0"></span>
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-rose-50 border border-rose-300 flex-shrink-0"></span>
          <span>Not Answered ({notAnsweredCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-purple-600 flex-shrink-0"></span>
          <span>Marked Review ({markedCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-200 flex-shrink-0"></span>
          <span>Unvisited ({unvisitedCount})</span>
        </div>
      </div>

      {/* Grid Palette */}
      <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 pt-2">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={getButtonStatusClass(idx, q.id)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
