import React from 'react';
import { Link } from 'react-router-dom';
import { Topic } from '../../types';
import { BookOpen, ArrowRight, HelpCircle } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md">
            {topic.section?.name || 'Topic'}
          </span>
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> {topic._count?.questions || 0} Questions
          </span>
        </div>
        <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
          {topic.name}
        </h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{topic.description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">{topic._count?.tests || 0} Practice Tests</span>
        <Link
          to={`/topics/${topic.id}`}
          className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
        >
          Practice <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
