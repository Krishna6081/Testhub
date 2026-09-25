import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { testService } from '../../services/testService';
import { sectionService } from '../../services/sectionService';
import { Test, Section, Topic } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAppDispatch } from '../../hooks/storeHooks';
import { addToast } from '../../store/slices/uiSlice';
import { Plus, Trash2, Edit2, PlayCircle } from 'lucide-react';

export const AdminTestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [tests, setTests] = useState<Test[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [duration, setDuration] = useState(15);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [totalMarks, setTotalMarks] = useState(5.0);
  const [negativeMarking, setNegativeMarking] = useState(0.25);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [testType, setTestType] = useState<'TOPIC' | 'SECTION' | 'MIXED' | 'FULL_LENGTH' | 'DAILY' | 'PRACTICE'>('TOPIC');

  const fetchTests = () => {
    setLoading(true);
    testService
      .getTests({ limit: 50 })
      .then((res) => {
        if (res.success) setTests(res.data.tests);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTests();
    sectionService.getSections().then((res) => {
      if (res.success) setSections(res.data);
    });
  }, []);

  useEffect(() => {
    if (sectionId) {
      sectionService.getTopics(sectionId).then((res) => {
        if (res.success) setTopics(res.data);
      });
    }
  }, [sectionId]);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || duration <= 0) return;

    try {
      await adminService.createTest({
        title,
        description,
        sectionId: sectionId || undefined,
        topicId: topicId || undefined,
        duration: Number(duration),
        totalQuestions: Number(totalQuestions),
        totalMarks: Number(totalMarks),
        negativeMarking: Number(negativeMarking),
        difficulty,
        testType,
        status: 'PUBLISHED',
        autoSelectCount: Number(totalQuestions),
      });

      dispatch(addToast({ type: 'success', message: 'Test published successfully.' }));
      setIsModalOpen(false);
      fetchTests();
    } catch (e: any) {
      dispatch(addToast({ type: 'error', message: 'Failed to create test.' }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this test?')) return;
    try {
      await adminService.deleteTest(id);
      dispatch(addToast({ type: 'info', message: 'Test deleted.' }));
      fetchTests();
    } catch (e) {
      dispatch(addToast({ type: 'error', message: 'Failed to delete test.' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Test & Mock Exam Management</h2>
          <p className="text-xs text-slate-500">Configure exam duration, negative marking, and question selection.</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Create New Test
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading tests..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {t.testType}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{t.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{t.description}</p>
                <div className="mt-3 text-[11px] text-slate-400 font-semibold space-x-3">
                  <span>{t.totalQuestions} Questions</span>
                  <span>•</span>
                  <span>{t.duration} Mins</span>
                  <span>•</span>
                  <span>{t.totalMarks} Marks</span>
                </div>
              </div>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Configure & Publish Test" maxWidth="lg">
        <form onSubmit={handleCreateTest} className="space-y-4">
          <Input label="Test Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Test Type"
              value={testType}
              onChange={(e) => setTestType(e.target.value as any)}
              options={[
                { value: 'TOPIC', label: 'Topic-wise' },
                { value: 'SECTION', label: 'Section-wise' },
                { value: 'MIXED', label: 'Mixed Test' },
                { value: 'FULL_LENGTH', label: 'Full Length' },
                { value: 'DAILY', label: 'Daily Test' },
                { value: 'PRACTICE', label: 'Practice Mode' },
              ]}
            />
            <Select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              options={[
                { value: 'EASY', label: 'Easy' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HARD', label: 'Hard' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Section"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              options={[{ value: '', label: 'All / None' }, ...sections.map((s) => ({ value: s.id, label: s.name }))]}
            />
            <Select
              label="Topic"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              options={[{ value: '', label: 'All / None' }, ...topics.map((t) => ({ value: t.id, label: t.name }))]}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Duration (Mins)" type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} required />
            <Input label="Question Count" type="number" value={totalQuestions} onChange={(e) => setTotalQuestions(Number(e.target.value))} required />
            <Input label="Total Marks" type="number" value={totalMarks} onChange={(e) => setTotalMarks(Number(e.target.value))} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Publish Test
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
