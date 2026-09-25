import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, Shield, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-white">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-white font-extrabold tracking-tight">
                TEST<span className="text-brand-400">HUB</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Practice Smart. Test Yourself. Improve Every Day."
            </p>
            <p className="text-xs text-slate-500">
              The premium competitive-exam practice platform with real analytics, timed test engine, and topic-wise drilling.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Exam Sections</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/sections" className="hover:text-brand-400 transition-colors">
                  Reasoning Aptitude
                </Link>
              </li>
              <li>
                <Link to="/sections" className="hover:text-brand-400 transition-colors">
                  Mathematics & Arithmetic
                </Link>
              </li>
              <li>
                <Link to="/sections" className="hover:text-brand-400 transition-colors">
                  General Science
                </Link>
              </li>
              <li>
                <Link to="/sections" className="hover:text-brand-400 transition-colors">
                  General Knowledge & Polity
                </Link>
              </li>
            </ul>
          </div>

          {/* Test Modes */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Practice Modes</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/tests" className="hover:text-brand-400 transition-colors">
                  Full-Length Mock Tests
                </Link>
              </li>
              <li>
                <Link to="/daily-test" className="hover:text-brand-400 transition-colors">
                  Daily Challenge Test
                </Link>
              </li>
              <li>
                <Link to="/practice" className="hover:text-brand-400 transition-colors">
                  Untimed Practice Mode
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-brand-400 transition-colors">
                  Global Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">
                  About TestHub
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} TestHub Exam Preparation Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Server Security Active
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" /> PostgreSQL Backed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
