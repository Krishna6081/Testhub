import React, { useEffect, useState } from 'react';
import { sectionService } from '../services/sectionService';
import { adminService } from '../services/adminService';
import { Section, Topic, Question } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { CheckCircle2, XCircle, BookOpen, ArrowRight, Zap } from 'lucide-react';

export const PracticeModePage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sectionService.getSections().then((res) => {
      if (res.success) setSections(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedSection) {
      sectionService.getTopics(selectedSection).then((res) => {
        if (res.success) setTopics(res.data);
      });
    } else {
      setTopics([]);
      setSelectedTopic('');
    }
  }, [selectedSection]);

  useEffect(() => {
    setLoading(true);
    adminService
      .getQuestions({
        sectionId: selectedSection || undefined,
        topicId: selectedTopic || undefined,
        limit: 30,
      })
      .then((res) => {
        if (res.success) {
          setQuestions(res.data.questions);
          setCurrentIndex(0);
          setSelectedOptionId(null);
          setShowExplanation(false);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedSection, selectedTopic]);

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId) return; // Prevent changing after selection in practice mode
    setSelectedOptionId(optId);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold border border-cyan-200">
          <Zap className="w-3.5 h-3.5" /> Practice Mode
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Untimed Instant Practice</h1>
        <p className="text-slate-600 text-sm">
          No strict timer. Receive instant feedback and step-by-step explanations for every question.
        </p>
      </div>

      {/* Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Filter by Section"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          options={[
            { value: '', label: 'All Sections' },
            ...sections.map((s) => ({ value: s.id, label: s.name })),
          ]}
        />

        <Select
          label="Filter by Topic"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          disabled={!selectedSection}
          options={[
            { value: '', label: 'All Topics' },
            ...topics.map((t) => ({ value: t.id, label: t.name })),
          ]}
        />
      </div>

      {/* Practice Question Engine */}
      {loading ? (
        <LoadingSpinner message="Loading practice questions..." />
      ) : questions.length === 0 || !currentQ ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          No practice questions available for selected filters.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-semibold text-slate-500">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>
              {currentQ.section?.name} • {currentQ.topic?.name}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-relaxed">{currentQ.questionText}</h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.isCorrect;

              let style = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';

              if (showExplanation) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold';
                }
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${style}`}
                >
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.optionText}</span>
                  </div>

                  {showExplanation && isCorrect && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Correct Answer
                    </span>
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Your Choice
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Section */}
          {showExplanation && currentQ.explanation && (
            <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-200 text-xs space-y-1.5 animate-in fade-in duration-300">
              <span className="font-bold text-brand-900 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-600" /> Explanation:
              </span>
              <p className="text-slate-700 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="pt-4 flex justify-end">
              <Button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Question
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
