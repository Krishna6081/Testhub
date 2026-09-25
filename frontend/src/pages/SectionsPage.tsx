import React, { useEffect, useState } from 'react';
import { sectionService } from '../services/sectionService';
import { Section } from '../types';
import { SectionCard } from '../components/test/SectionCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SectionsPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sectionService
      .getSections()
      .then((res) => {
        if (res.success) setSections(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading exam sections..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900">Exam Sections & Subjects</h1>
        <p className="text-slate-600 text-sm">
          Master each domain with targeted topic practice, structured quizzes, and speed drills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((sec) => (
          <SectionCard key={sec.id} section={sec} />
        ))}
      </div>
    </div>
  );
};
