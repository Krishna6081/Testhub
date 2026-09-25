import React, { useEffect, useState } from 'react';
import { testService } from '../services/testService';
import { sectionService } from '../services/sectionService';
import { Test, Section, Topic } from '../types';
import { TestCard } from '../components/test/TestCard';
import { SearchBar } from '../components/common/SearchBar';
import { Select } from '../components/common/Select';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const TestsPage: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTestType, setSelectedTestType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    sectionService.getSections().then((res) => {
      if (res.success) setSections(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedSection) {
      sectionService.getTopics(selectedSection).then((res) => {
        if (res.success) setTopics(res.data);
      });
    } else {
      setTopics([]);
      setSelectedTopic('');
    }
  }, [selectedSection]);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const res = await testService.getTests({
          search,
          sectionId: selectedSection || undefined,
          topicId: selectedTopic || undefined,
          difficulty: selectedDifficulty || undefined,
          testType: selectedTestType || undefined,
          page,
          limit: 9,
        });

        if (res.success) {
          setTests(res.data.tests);
          setTotalPages(res.data.pagination.totalPages);
        }
      } catch (err) {
        console.error('Failed to load tests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [search, selectedSection, selectedTopic, selectedDifficulty, selectedTestType, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Explore Practice & Mock Tests</h1>
        <p className="text-slate-600 text-sm">
          Select from section-wise drills, topic-wise practice, and full-length competitive exam papers.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search test titles..."
          />

          <Select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Sections' },
              ...sections.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />

          <Select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setPage(1);
            }}
            disabled={!selectedSection}
            options={[
              { value: '', label: 'All Topics' },
              ...topics.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />

          <Select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Difficulties' },
              { value: 'EASY', label: 'Easy' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HARD', label: 'Hard' },
            ]}
          />

          <Select
            value={selectedTestType}
            onChange={(e) => {
              setSelectedTestType(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Test Types' },
              { value: 'TOPIC', label: 'Topic-wise' },
              { value: 'SECTION', label: 'Section-wise' },
              { value: 'MIXED', label: 'Mixed Test' },
              { value: 'FULL_LENGTH', label: 'Full Length' },
              { value: 'DAILY', label: 'Daily Test' },
              { value: 'PRACTICE', label: 'Practice Mode' },
            ]}
          />
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <LoadingSpinner message="Loading matching tests..." />
      ) : tests.length === 0 ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <p className="text-slate-500 font-medium">No tests found matching your criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSection('');
              setSelectedTopic('');
              setSelectedDifficulty('');
              setSelectedTestType('');
            }}
            className="text-xs font-bold text-brand-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
    </div>
  );
};
