import React from 'react';
import { Question } from '../../types';
import { Bookmark, RotateCcw, BookmarkCheck } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string | null;
  isMarkedForReview: boolean;
  isBookmarked: boolean;
  onSelectOption: (optionId: string) => void;
  onClearAnswer: () => void;
  onToggleMarkForReview: () => void;
  onToggleBookmark: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  isMarkedForReview,
  isBookmarked,
  onSelectOption,
  onClearAnswer,
  onToggleMarkForReview,
  onToggleBookmark,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-col justify-between min-h-[480px]">
      <div>
        {/* Question Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-brand-50 text-brand-700 font-bold text-sm rounded-lg">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              +{question.marks} / -{question.negativeMarks} Marks
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Bookmark Question"
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-600" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="text-base md:text-lg font-semibold text-slate-900 leading-relaxed space-y-3">
          <p className="whitespace-pre-line">{question.questionText}</p>
          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt="Question illustration"
              className="max-h-64 rounded-xl border border-slate-200 my-4 object-contain"
            />
          )}
        </div>

        {/* Options List */}
        <div className="mt-8 space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <label
                key={option.id}
                onClick={() => onSelectOption(option.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-brand-50/80 border-brand-500 text-brand-950 ring-2 ring-brand-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {optionLetter}
                </div>
                <div className="flex-1 text-sm md:text-base font-medium pt-0.5 leading-snug">
                  {option.optionText}
                  {option.imageUrl && (
                    <img src={option.imageUrl} alt="Option illustration" className="max-h-32 rounded-lg mt-2" />
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {selectedOptionId && (
            <button
              onClick={onClearAnswer}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Selection
            </button>
          )}
        </div>

        <button
          onClick={onToggleMarkForReview}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            isMarkedForReview
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
          }`}
        >
          {isMarkedForReview ? '✓ Marked for Review' : 'Mark for Review'}
        </button>
      </div>
    </div>
  );
};
