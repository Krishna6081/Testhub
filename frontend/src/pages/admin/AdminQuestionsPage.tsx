import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { sectionService } from '../../services/sectionService';
import { Question, Section, Topic } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { SearchBar } from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAppDispatch } from '../../hooks/storeHooks';
import { addToast } from '../../store/slices/uiSlice';
import { Plus, Edit2, Trash2, Copy, CheckCircle2 } from 'lucide-react';

export const AdminQuestionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedSec, setSelectedSec] = useState('');
  const [selectedTop, setSelectedTop] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [formSectionId, setFormSectionId] = useState('');
  const [formTopicId, setFormTopicId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [explanation, setExplanation] = useState('');
  const [marks, setMarks] = useState(1.0);
  const [negativeMarks, setNegativeMarks] = useState(0.25);

  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);

  const fetchQuestions = () => {
    setLoading(true);
    adminService
      .getQuestions({
        search,
        sectionId: selectedSec || undefined,
        topicId: selectedTop || undefined,
        page,
        limit: 10,
      })
      .then((res) => {
        if (res.success) {
          setQuestions(res.data.questions);
          setTotalPages(res.data.pagination.totalPages);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    sectionService.getSections().then((res) => {
      if (res.success) {
        setSections(res.data);
        if (res.data.length > 0 && !formSectionId) {
          setFormSectionId(res.data[0].id);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (formSectionId) {
      sectionService.getTopics(formSectionId).then((res) => {
        if (res.success) {
          setTopics(res.data);
          if (res.data.length > 0 && !formTopicId) {
            setFormTopicId(res.data[0].id);
          }
        }
      });
    }
  }, [formSectionId]);

  useEffect(() => {
    fetchQuestions();
  }, [search, selectedSec, selectedTop, page]);

  const handleOpenModal = (q?: Question) => {
    if (q) {
      setEditingQuestion(q);
      setFormSectionId(q.sectionId);
      setFormTopicId(q.topicId);
      setQuestionText(q.questionText);
      setDifficulty(q.difficulty);
      setExplanation(q.explanation || '');
      setMarks(q.marks);
      setNegativeMarks(q.negativeMarks);

      const opts = q.options || [];
      setOption1(opts[0]?.optionText || '');
      setOption2(opts[1]?.optionText || '');
      setOption3(opts[2]?.optionText || '');
      setOption4(opts[3]?.optionText || '');

      const corrIdx = opts.findIndex((o) => o.isCorrect);
      setCorrectOptionIdx(corrIdx >= 0 ? corrIdx : 0);
    } else {
      setEditingQuestion(null);
      setQuestionText('');
      setExplanation('');
      setOption1('');
      setOption2('');
      setOption3('');
      setOption4('');
      setCorrectOptionIdx(0);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText || !option1 || !option2 || !formSectionId || !formTopicId) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in question text and options.' }));
      return;
    }

    const optionsData = [
      { optionText: option1, isCorrect: correctOptionIdx === 0, optionOrder: 1 },
      { optionText: option2, isCorrect: correctOptionIdx === 1, optionOrder: 2 },
      { optionText: option3, isCorrect: correctOptionIdx === 2, optionOrder: 3 },
      { optionText: option4, isCorrect: correctOptionIdx === 3, optionOrder: 4 },
    ].filter((o) => o.optionText.trim().length > 0);

    const payload = {
      sectionId: formSectionId,
      topicId: formTopicId,
      questionText,
      difficulty,
      explanation,
      marks,
      negativeMarks,
      options: optionsData,
    };

    try {
      if (editingQuestion) {
        await adminService.updateQuestion(editingQuestion.id, payload);
        dispatch(addToast({ type: 'success', message: 'Question updated.' }));
      } else {
        await adminService.createQuestion(payload);
        dispatch(addToast({ type: 'success', message: 'Question added to bank.' }));
      }
      setIsModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: 'Failed to save question.' }));
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await adminService.duplicateQuestion(id);
      dispatch(addToast({ type: 'success', message: 'Question duplicated.' }));
      fetchQuestions();
    } catch (e) {
      dispatch(addToast({ type: 'error', message: 'Failed to duplicate question.' }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await adminService.deleteQuestion(id);
      dispatch(addToast({ type: 'info', message: 'Question deleted.' }));
      fetchQuestions();
    } catch (e) {
      dispatch(addToast({ type: 'error', message: 'Failed to delete question.' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Question Bank Management</h2>
          <p className="text-xs text-slate-500">Create, edit, duplicate, and filter examination questions.</p>
        </div>
        <Button size="sm" onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Question
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search questions..." />
        <Select
          value={selectedSec}
          onChange={(e) => { setSelectedSec(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All Sections' }, ...sections.map((s) => ({ value: s.id, label: s.name }))]}
        />
        <Select
          value={selectedTop}
          onChange={(e) => { setSelectedTop(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All Topics' }, ...topics.map((t) => ({ value: t.id, label: t.name }))]}
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Loading question bank..." />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{q.section?.name}</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{q.topic?.name}</span>
                    <span className="text-slate-400">+{q.marks} / -{q.negativeMarks}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">{q.questionText}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleOpenModal(q)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDuplicate(q.id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingQuestion ? 'Edit Question' : 'Add New Question'} maxWidth="2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Section"
              value={formSectionId}
              onChange={(e) => setFormSectionId(e.target.value)}
              options={sections.map((s) => ({ value: s.id, label: s.name }))}
            />
            <Select
              label="Topic"
              value={formTopicId}
              onChange={(e) => setFormTopicId(e.target.value)}
              options={topics.map((t) => ({ value: t.id, label: t.name }))}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Question Text</label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter question text..."
              className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-700">Options (Select radio for correct answer)</label>
            {[
              { val: option1, set: setOption1, idx: 0, label: 'Option A' },
              { val: option2, set: setOption2, idx: 1, label: 'Option B' },
              { val: option3, set: setOption3, idx: 2, label: 'Option C' },
              { val: option4, set: setOption4, idx: 3, label: 'Option D' },
            ].map((opt) => (
              <div key={opt.idx} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionIdx === opt.idx}
                  onChange={() => setCorrectOptionIdx(opt.idx)}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                />
                <Input
                  placeholder={opt.label}
                  value={opt.val}
                  onChange={(e) => opt.set(e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-slate-700">Explanation</label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Detailed solution explanation..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
