import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sectionService } from '../services/sectionService';
import { testService } from '../services/testService';
import { Section, Test } from '../types';
import { SectionCard } from '../components/test/SectionCard';
import { TestCard } from '../components/test/TestCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Brain,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
  Award,
  Users,
  HelpCircle,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [popularTests, setPopularTests] = useState<Test[]>([]);
  const [dailyTest, setDailyTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [secRes, testRes] = await Promise.all([
          sectionService.getSections(),
          testService.getTests({ limit: 6 }),
        ]);

        if (secRes.success) setSections(secRes.data);
        if (testRes.success) {
          setPopularTests(testRes.data.tests);
          const dt = testRes.data.tests.find((t) => t.testType === 'DAILY');
          if (dt) setDailyTest(dt);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading TestHub Platform..." />;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold tracking-wide text-brand-300 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Next-Gen Competitive Exam Preparation
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Practice Smart. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 via-cyan-300 to-indigo-200">
                Test Yourself.
              </span> <br />
              Improve Every Day.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Prepare for competitive examinations with topic-wise, section-wise and full-length practice tests backed by real-time analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/tests"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-cyan-500 hover:from-brand-600 hover:to-cyan-600 text-white font-bold text-base shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <PlayCircle className="w-5 h-5" /> Start Practicing Now
              </Link>
              <Link
                to="/sections"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
              >
                Explore Sections <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300 text-xs font-medium border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Timed Test Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Negative Marking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Detailed Solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Weak Topics Tracker</span>
              </div>
            </div>
          </div>

          {/* Graphic Showcase Card */}
          <div className="relative z-10 flex justify-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Exam Practice Hub</h3>
                    <p className="text-xs text-slate-300">Live Platform Statistics</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>

              {/* Dynamic Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <HelpCircle className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-400">Total Questions</span>
                  <p className="text-xl font-extrabold text-white mt-0.5">500+</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <PlayCircle className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-400">Mock Tests</span>
                  <p className="text-xl font-extrabold text-white mt-0.5">50+</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <Users className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-400">Registered Users</span>
                  <p className="text-xl font-extrabold text-white mt-0.5">1,250+</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-400">Tests Attempted</span>
                  <p className="text-xl font-extrabold text-white mt-0.5">4,800+</p>
                </div>
              </div>

              {/* Featured Daily Test Pill */}
              {dailyTest && (
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-300">Daily Challenge Test</h4>
                      <p className="text-xs text-slate-300">{dailyTest.title}</p>
                    </div>
                  </div>
                  <Link
                    to={`/tests/${dailyTest.id}`}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors"
                  >
                    Attempt
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Primary Exam Sections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Explore Examination Sections</h2>
          <p className="text-slate-600 text-sm">
            Focus your preparation on core competitive exam sections with topic-wise practice modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((sec) => (
            <SectionCard key={sec.id} section={sec} />
          ))}
        </div>
      </section>

      {/* Popular Practice Tests */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Popular Mock Tests</h2>
            <p className="text-slate-600 text-sm mt-1">High-yield tests matching official exam patterns.</p>
          </div>
          <Link
            to="/tests"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-800"
          >
            View All Tests <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTests.slice(0, 6).map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </section>

      {/* How TestHub Works */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Simple Step-by-Step
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">How TestHub Works</h2>
            <p className="text-slate-600 text-sm">Designed to give you maximum exam performance improvement in minimum time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 font-extrabold text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Select Test</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose topic-wise, section-wise, or full-length mock exams aligned with your target exam.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 font-extrabold text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Attempt Under Timer</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Experience real exam simulation with strict countdown timer, question palette, and negative marking.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 font-extrabold text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Instant Automatic Result</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get instant score calculation, percentage, accuracy metrics, and section-by-section breakdown.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 font-extrabold text-lg flex items-center justify-center mx-auto">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base">Review Solutions & Improve</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect step-by-step explanations for all questions, track weak topics, and retry to boost score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-cyan-700 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl font-extrabold">Ready to crack your upcoming competitive exam?</h2>
            <p className="text-brand-100 text-sm max-w-xl">
              Join thousands of students practicing daily on TestHub. Track your progress, compare on the leaderboard, and master every topic.
            </p>
          </div>
          <Link
            to="/register"
            className="px-8 py-4 rounded-2xl bg-white text-brand-900 font-bold text-base hover:bg-brand-50 transition-all shadow-lg flex-shrink-0"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};
