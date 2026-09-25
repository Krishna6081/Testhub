import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { ResultCard } from '../components/test/ResultCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, ArrowLeft, BookOpen } from 'lucide-react';

export const AttemptResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'solutions'>('summary');

  useEffect(() => {
    if (attemptId) {
      attemptService
        .getAttemptDetails(attemptId)
        .then((res) => {
          if (res.success) setData(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [attemptId]);

  if (loading) return <LoadingSpinner message="Calculating test results & solutions..." />;
  if (!data) return <div className="p-8 text-center text-slate-500">Attempt results not found.</div>;

  const { attempt, answers, sectionPerformance, topicPerformance } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Link to="/my-tests" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> My Test History
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/tests/${attempt.testId}`)}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Retry Test
          </Button>
          <Link to="/dashboard">
            <Button size="sm">Go to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Main Result Card */}
      <ResultCard
        score={attempt.score}
        totalMarks={attempt.totalMarks}
        percentage={attempt.percentage}
        accuracy={attempt.accuracy}
        correctAnswers={attempt.correctAnswers}
        incorrectAnswers={attempt.incorrectAnswers}
        unattempted={attempt.unattempted}
        timeTaken={attempt.timeTaken}
      />

      {/* Tabs for Summary & Solutions */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'summary'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Performance Summary
        </button>
        <button
          onClick={() => setActiveTab('solutions')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'solutions'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Detailed Solutions Review ({answers.length})
        </button>
      </div>

      {/* Summary Tab View */}
      {activeTab === 'summary' ? (
        <div className="space-y-6">
          {/* Section Breakdown */}
          {sectionPerformance && sectionPerformance.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Section-wise Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectionPerformance.map((sec: any) => (
                  <div key={sec.name} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{sec.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {sec.correct} Correct / {sec.total} Total Questions
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-brand-600">
                        {Math.round((sec.correct / sec.total) * 100)}%
                      </span>
                      <span className="block text-[10px] text-slate-400">Accuracy</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Solutions Review View */
        <div className="space-y-6">
          {answers.map((ans: any, idx: number) => {
            const correctOption = ans.options?.find((o: any) => o.isCorrect);
            const userSelectedOption = ans.options?.find((o: any) => o.id === ans.selectedOptionId);

            return (
              <div
                key={ans.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 ${
                  ans.isCorrect
                    ? 'border-emerald-200'
                    : ans.selectedOptionId
                    ? 'border-rose-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Question Header Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {ans.sectionName} • {ans.topicName}
                    </span>
                  </div>

                  <div>
                    {ans.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" /> Correct (+{ans.marksObtained})
                      </span>
                    ) : ans.selectedOptionId ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                        <XCircle className="w-4 h-4" /> Incorrect ({ans.marksObtained})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        <HelpCircle className="w-4 h-4" /> Unattempted (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question text */}
                <h4 className="text-base font-semibold text-slate-900 leading-relaxed">
                  {ans.questionText}
                </h4>

                {/* Options List */}
                <div className="space-y-2 pt-2">
                  {ans.options?.map((opt: any, oIdx: number) => {
                    const isUserPick = opt.id === ans.selectedOptionId;
                    const isRightPick = opt.isCorrect;

                    let optBg = 'bg-white border-slate-200 text-slate-700';
                    if (isRightPick) {
                      optBg = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                    } else if (isUserPick && !isRightPick) {
                      optBg = 'bg-rose-50 border-rose-400 text-rose-900 font-semibold';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-sm ${optBg}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt.optionText}</span>
                        </div>
                        {isRightPick && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                            Correct Answer
                          </span>
                        )}
                        {isUserPick && !isRightPick && (
                          <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-md">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Solution Explanation */}
                {ans.explanation && (
                  <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-200 text-xs space-y-1.5 mt-4">
                    <span className="font-bold text-brand-900 text-sm flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-brand-600" /> Explanation:
                    </span>
                    <p className="text-slate-700 leading-relaxed">{ans.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
