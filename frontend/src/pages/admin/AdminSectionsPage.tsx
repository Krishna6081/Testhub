import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { sectionService } from '../../services/sectionService';
import { Section } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useAppDispatch } from '../../hooks/storeHooks';
import { addToast } from '../../store/slices/uiSlice';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminSectionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchSections = () => {
    setLoading(true);
    sectionService
      .getSections()
      .then((res) => {
        if (res.success) setSections(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleOpenModal = (sec?: Section) => {
    if (sec) {
      setEditingSection(sec);
      setName(sec.name);
      setDescription(sec.description || '');
    } else {
      setEditingSection(null);
      setName('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      if (editingSection) {
        await adminService.updateSection(editingSection.id, { name, description });
        dispatch(addToast({ type: 'success', message: 'Section updated successfully.' }));
      } else {
        await adminService.createSection({ name, description });
        dispatch(addToast({ type: 'success', message: 'Section created successfully.' }));
      }
      setIsModalOpen(false);
      fetchSections();
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Failed to save section' }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await adminService.deleteSection(id);
      dispatch(addToast({ type: 'info', message: 'Section deleted.' }));
      fetchSections();
    } catch (e) {
      dispatch(addToast({ type: 'error', message: 'Failed to delete section.' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Section Management</h2>
          <p className="text-xs text-slate-500">Create, edit, or manage core exam sections.</p>
        </div>
        <Button size="sm" onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Section
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading sections..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((sec) => (
            <div key={sec.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{sec.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sec.description}</p>
                <div className="mt-3 text-[11px] text-slate-400 font-semibold space-x-3">
                  <span>{sec._count?.topics || 0} Topics</span>
                  <span>•</span>
                  <span>{sec._count?.questions || 0} Questions</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(sec)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(sec.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSection ? 'Edit Section' : 'Create Section'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Section Name" value={name} onChange={(e) => setName(e.target.value)} required />
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
              Save Section
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
