import React from 'react';
import { Brain, ShieldCheck, Target, Award, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">About TestHub</h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          "Practice Smart. Test Yourself. Improve Every Day."
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6 text-slate-700 leading-relaxed text-sm md:text-base">
        <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
        <p>
          TestHub was created to empower competitive exam aspirants with a realistic, high-performance examination environment. Whether you are preparing for Staff Selection Commission (SSC), Banking, Railways, or State-level competitive exams, TestHub provides topic-wise practice, section-wise drills, and full-length mock exams.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <Target className="w-6 h-6 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-base">Targeted Practice</h3>
            <p className="text-xs text-slate-500">Drill specific topics in Reasoning, Mathematics, Science, and GK.</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <Award className="w-6 h-6 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Real Simulation</h3>
            <p className="text-xs text-slate-500">Official time countdown, negative marking, and question palettes.</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Actionable Analytics</h3>
            <p className="text-xs text-slate-500">Identify weak topics automatically and track your accuracy over time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
