import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sectionService } from '../services/sectionService';
import { Section, Topic } from '../types';
import { TopicCard } from '../components/test/TopicCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ArrowLeft, BookOpen, Brain, Calculator, Atom, Globe } from 'lucide-react';

export const SectionDetailsPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [section, setSection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sectionId) {
      sectionService
        .getSectionById(sectionId)
        .then((res) => {
          if (res.success) setSection(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [sectionId]);

  if (loading) return <LoadingSpinner message="Loading section topics..." />;
  if (!section) return <div className="p-8 text-center text-slate-500">Section not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/sections" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> All Sections
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
        <h1 className="text-3xl font-black text-slate-900">{section.name}</h1>
        <p className="text-slate-600 text-sm max-w-2xl">{section.description}</p>

        <div className="flex gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
          <span>{section.topics?.length || 0} Topics</span>
          <span>•</span>
          <span>{section._count?.questions || 0} Total Questions</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Topics in {section.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.topics?.map((topic: Topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
};
