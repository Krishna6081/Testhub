import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testService } from '../services/testService';
import { bookmarkService } from '../services/bookmarkService';
import { Question, TestAttempt } from '../types';
import { QuestionCard } from '../components/test/QuestionCard';
import { QuestionPalette } from '../components/test/QuestionPalette';
import { Timer } from '../components/test/Timer';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useAppDispatch } from '../hooks/storeHooks';
import { addToast } from '../store/slices/uiSlice';
import { ChevronLeft, ChevronRight, Send, AlertTriangle, Brain } from 'lucide-react';

export const TestAttemptPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [test, setTest] = useState<any>(null);
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [visitedIndices, setVisitedIndices] = useState<Set<number>>(new Set([0]));
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Initialize test attempt
  useEffect(() => {
    if (testId) {
      testService
        .startTest(testId)
        .then((res) => {
          if (res.success) {
            setAttempt(res.data.attempt);
            setTest(res.data.test);
            setQuestions(res.data.questions);

            // Populate existing answers if resuming
            if (res.data.attempt.answers && Array.isArray(res.data.attempt.answers)) {
              const ansMap: Record<string, string | null> = {};
              res.data.attempt.answers.forEach((ans: any) => {
                ansMap[ans.questionId] = ans.selectedOptionId;
              });
              setAnswers(ansMap);
            }
          } else {
            dispatch(addToast({ type: 'error', message: res.message || 'Failed to start test' }));
            navigate('/tests');
          }
        })
        .catch((err) => {
          dispatch(addToast({ type: 'error', message: 'Failed to start test attempt' }));
          navigate('/tests');
        })
        .finally(() => setLoading(false));

      // Fetch user bookmarks
      bookmarkService.getBookmarks().then((res) => {
        if (res.success) {
          const ids = new Set<string>(res.data.map((b) => b.questionId));
          setBookmarkedQuestionIds(ids);
        }
      });
    }
  }, [testId, dispatch, navigate]);

  const handleSelectOption = (optionId: string) => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const handleClearAnswer = () => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const handleToggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  };

  const handleToggleBookmark = async () => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    const isB = bookmarkedQuestionIds.has(qId);

    try {
      if (isB) {
        await bookmarkService.removeBookmark(qId);
        setBookmarkedQuestionIds((prev) => {
          const next = new Set(prev);
          next.delete(qId);
          return next;
        });
        dispatch(addToast({ type: 'info', message: 'Bookmark removed' }));
      } else {
        await bookmarkService.addBookmark(qId);
        setBookmarkedQuestionIds((prev) => new Set(prev).add(qId));
        dispatch(addToast({ type: 'success', message: 'Question bookmarked' }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setVisitedIndices((prev) => new Set(prev).add(nextIdx));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setVisitedIndices((prev) => new Set(prev).add(prevIdx));
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setVisitedIndices((prev) => new Set(prev).add(index));
  };

  // Submit test implementation
  const handleSubmitTest = useCallback(async () => {
    if (!testId || !attempt || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] || null,
        timeSpent: 0,
      }));

      const res = await testService.submitTest(testId, attempt.id, formattedAnswers);

      if (res.success) {
        dispatch(addToast({ type: 'success', message: 'Test submitted successfully!' }));
        navigate(`/attempts/${res.data.attemptId}/result`);
      } else {
        dispatch(addToast({ type: 'error', message: res.message || 'Submission failed' }));
      }
    } catch (error: any) {
      dispatch(addToast({ type: 'error', message: error.message || 'Error submitting test' }));
    } finally {
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  }, [testId, attempt, questions, answers, isSubmitting, dispatch, navigate]);

  if (loading) return <LoadingSpinner message="Loading exam interface..." />;
  if (!test || !attempt || questions.length === 0) return <div className="p-8 text-center text-slate-500">Test data not available.</div>;

  const currentQuestion = questions[currentIndex];
  const isBookmarked = bookmarkedQuestionIds.has(currentQuestion.id);
  const isMarked = markedForReview.has(currentIndex);
  const selectedOptionId = answers[currentQuestion.id] || null;

  // Counts for summary modal
  const totalAnsCount = Object.keys(answers).filter((k) => answers[k]).length;
  const totalUnansCount = questions.length - totalAnsCount;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Test Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-none text-white truncate max-w-xs sm:max-w-md">
              {test.title}
            </h1>
            <span className="text-[11px] text-slate-400">Competitive Examination Engine</span>
          </div>
        </div>

        {/* Right Timer & Submit CTA */}
        <div className="flex items-center gap-4">
          <Timer
            durationMinutes={test.duration}
            startTime={attempt.startTime}
            onTimeUp={handleSubmitTest}
          />
          <Button
            size="sm"
            variant="amber"
            onClick={() => setShowSubmitModal(true)}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Submit Test
          </Button>
        </div>
      </header>

      {/* Main Examination Engine Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Question Viewer (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              selectedOptionId={selectedOptionId}
              isMarkedForReview={isMarked}
              isBookmarked={isBookmarked}
              onSelectOption={handleSelectOption}
              onClearAnswer={handleClearAnswer}
              onToggleMarkForReview={handleToggleMarkForReview}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* Bottom Controls Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              <div className="text-xs font-semibold text-slate-500">
                Question {currentIndex + 1} of {questions.length}
              </div>

              <Button
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Save & Next
              </Button>
            </div>
          </div>

          {/* Palette Sidebar (1 Col) */}
          <div className="lg:col-span-1">
            <QuestionPalette
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              visitedIndices={visitedIndices}
              markedForReview={markedForReview}
              onSelectQuestion={handleJumpToQuestion}
            />
          </div>
        </div>
      </main>

      {/* Submit Test Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Confirm Test Submission"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to submit your test? Here is a summary of your attempt:
          </p>

          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
              <span className="block font-bold text-lg text-emerald-600">{totalAnsCount}</span>
              <span>Answered</span>
            </div>
            <div className="p-2 bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
              <span className="block font-bold text-lg text-rose-600">{totalUnansCount}</span>
              <span>Unanswered</span>
            </div>
            <div className="p-2 bg-purple-50 text-purple-800 rounded-xl border border-purple-200">
              <span className="block font-bold text-lg text-purple-600">{markedForReview.size}</span>
              <span>Marked Review</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setShowSubmitModal(false)}>
              Continue Test
            </Button>
            <Button size="sm" isLoading={isSubmitting} onClick={handleSubmitTest}>
              Submit Test Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
