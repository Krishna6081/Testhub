import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { testService } from '../services/testService';
import { Test } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useAppSelector } from '../hooks/storeHooks';
import {
  Clock,
  HelpCircle,
  Award,
  ShieldCheck,
  PlayCircle,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

export const TestDetailsPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (testId) {
      testService
        .getTestById(testId)
        .then((res) => {
          if (res.success) setTest(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [testId]);

  const handleStartAttempt = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/tests/${testId}` } });
      return;
    }
    navigate(`/tests/${testId}/attempt`);
  };

  if (loading) return <LoadingSpinner message="Fetching test details..." />;
  if (!test) return <div className="p-8 text-center text-slate-500">Test not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link to="/tests" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Tests
      </Link>

      {/* Main Details Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              {test.testType}
            </span>
            {test.section && (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                Section: {test.section.name}
              </span>
            )}
            {test.topic && (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                Topic: {test.topic.name}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">{test.title}</h1>

          <p className="text-slate-600 text-sm leading-relaxed">{test.description}</p>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Questions
            </span>
            <p className="text-xl font-bold text-slate-900 mt-1">{test.totalQuestions}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Duration
            </span>
            <p className="text-xl font-bold text-slate-900 mt-1">{test.duration} Minutes</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5" /> Total Marks
            </span>
            <p className="text-xl font-bold text-slate-900 mt-1">{test.totalMarks}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Neg. Marking
            </span>
            <p className="text-xl font-bold text-rose-600 mt-1">-{test.negativeMarking}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Important Test Instructions:</h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span>The test consists of {test.totalQuestions} multiple-choice questions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span>The countdown timer will start immediately once you click "Start Test".</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span>Each correct answer awards positive marks (+{test.totalMarks / test.totalQuestions || 1}).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
              <span>Each wrong answer deducts <strong>-{test.negativeMarking} marks</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span>Use the Question Palette to quickly jump between questions during the test.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span>The test will automatically submit when the timer reaches 00:00.</span>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-slate-100">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            leftIcon={<PlayCircle className="w-5 h-5" />}
            onClick={() => setShowConfirmModal(true)}
          >
            Start Test Now
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Ready to Begin Test?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            You are about to start <strong>"{test.title}"</strong>. The timer of {test.duration} minutes will start immediately.
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Do not refresh or close the browser during the exam.</span>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleStartAttempt}>
              Start Exam Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
