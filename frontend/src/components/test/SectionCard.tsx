import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Calculator, Atom, Globe, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';
import { Section } from '../../types';

interface SectionCardProps {
  section: Section;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  const getSectionIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'reasoning':
        return <Brain className="w-7 h-7 text-indigo-600" />;
      case 'mathematics':
        return <Calculator className="w-7 h-7 text-blue-600" />;
      case 'science':
        return <Atom className="w-7 h-7 text-emerald-600" />;
      case 'general knowledge (gk)':
      case 'gk':
        return <Globe className="w-7 h-7 text-amber-600" />;
      default:
        return <BookOpen className="w-7 h-7 text-brand-600" />;
    }
  };

  const getBgGradient = (name: string) => {
    switch (name.toLowerCase()) {
      case 'reasoning':
        return 'from-indigo-500/10 to-purple-500/5 border-indigo-200 hover:border-indigo-300';
      case 'mathematics':
        return 'from-blue-500/10 to-cyan-500/5 border-blue-200 hover:border-blue-300';
      case 'science':
        return 'from-emerald-500/10 to-teal-500/5 border-emerald-200 hover:border-emerald-300';
      default:
        return 'from-amber-500/10 to-orange-500/5 border-amber-200 hover:border-amber-300';
    }
  };

  return (
    <div
      className={`relative group bg-white rounded-2xl border p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${getBgGradient(
        section.name
      )}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
            {getSectionIcon(section.name)}
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Section
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
          {section.name}
        </h3>
        <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {section.description || `Comprehensive test series and topic practice for ${section.name}.`}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>{section._count?.topics || 0} Topics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>{section._count?.questions || 0} Questions</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to={`/sections/${section.id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white transition-all shadow-xs"
        >
          Explore Section <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
