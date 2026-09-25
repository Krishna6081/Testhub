import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { sectionService } from '../../services/sectionService';
import { Topic, Section } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAppDispatch } from '../../hooks/storeHooks';
import { addToast } from '../../store/slices/uiSlice';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminTopicsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sectionId, setSectionId] = useState('');

  const fetchTopics = () => {
    setLoading(true);
    sectionService
      .getTopics()
      .then((res) => {
        if (res.success) setTopics(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTopics();
    sectionService.getSections().then((res) => {
      if (res.success) {
        setSections(res.data);
        if (res.data.length > 0) setSectionId(res.data[0].id);
      }
    });
  }, []);

  const handleOpenModal = (t?: Topic) => {
    if (t) {
      setEditingTopic(t);
      setName(t.name);
      setDescription(t.description || '');
      setSectionId(t.sectionId);
    } else {
      setEditingTopic(null);
      setName('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sectionId) return;

    try {
      if (editingTopic) {
        await adminService.updateTopic(editingTopic.id, { name, description, sectionId });
        dispatch(addToast({ type: 'success', message: 'Topic updated successfully.' }));
      } else {
        await adminService.createTopic({ name, description, sectionId });
        dispatch(addToast({ type: 'success', message: 'Topic created successfully.' }));
      }
      setIsModalOpen(false);
      fetchTopics();
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: 'Failed to save topic.' }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;
    try {
      await adminService.deleteTopic(id);
      dispatch(addToast({ type: 'info', message: 'Topic deleted.' }));
      fetchTopics();
    } catch (e) {
      dispatch(addToast({ type: 'error', message: 'Failed to delete topic.' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Topic Management</h2>
          <p className="text-xs text-slate-500">Manage syllabus topics assigned to specific sections.</p>
        </div>
        <Button size="sm" onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Topic
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading topics..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((top) => (
            <div key={top.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                  {top.section?.name || 'Section'}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{top.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{top.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenModal(top)} className="p-1 rounded text-slate-400 hover:text-brand-600">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(top.id)} className="p-1 rounded text-slate-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTopic ? 'Edit Topic' : 'Create Topic'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Section"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            options={sections.map((s) => ({ value: s.id, label: s.name }))}
          />
          <Input label="Topic Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Topic
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
