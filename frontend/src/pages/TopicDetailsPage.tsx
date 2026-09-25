import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sectionService } from '../services/sectionService';
import { testService } from '../services/testService';
import { Topic, Test } from '../types';
import { TestCard } from '../components/test/TestCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

export const TopicDetailsPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicId) {
      Promise.all([
        sectionService.getTopicById(topicId),
        testService.getTests({ topicId, limit: 20 }),
      ])
        .then(([topRes, testRes]) => {
          if (topRes.success) setTopic(topRes.data);
          if (testRes.success) setTests(testRes.data.tests);
        })
        .finally(() => setLoading(false));
    }
  }, [topicId]);

  if (loading) return <LoadingSpinner message="Loading topic practice tests..." />;
  if (!topic) return <div className="p-8 text-center text-slate-500">Topic not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/sections" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Sections
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
          {topic.section?.name || 'Topic Practice'}
        </span>
        <h1 className="text-3xl font-black text-slate-900">{topic.name}</h1>
        <p className="text-slate-600 text-sm max-w-2xl">{topic.description}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Practice Tests on {topic.name}</h2>
        {tests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-sm">
            No tests available specifically for this topic yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
