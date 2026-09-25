import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { sectionService } from '../../services/sectionService';
import { Section, Topic } from '../../types';
import { Button } from '../../components/common/Button';
import { useAppDispatch } from '../../hooks/storeHooks';
import { addToast } from '../../store/slices/uiSlice';
import { Upload, CheckCircle2, AlertCircle, FileText, Code } from 'lucide-react';

export const AdminImportPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [sections, setSections] = useState<Section[]>([]);
  const [jsonText, setJsonText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [parseError, setParseError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultSummary, setResultSummary] = useState<any>(null);

  useEffect(() => {
    sectionService.getSections().then((res) => {
      if (res.success) setSections(res.data);
    });
  }, []);

  const handleLoadSample = async () => {
    if (sections.length === 0) return;
    const sampleSecId = sections[0].id;

    const topicsRes = await sectionService.getTopics(sampleSecId);
    const sampleTopicId = topicsRes.success && topicsRes.data.length > 0 ? topicsRes.data[0].id : '';

    const sample = [
      {
        sectionId: sampleSecId,
        topicId: sampleTopicId,
        questionText: 'Which of the following numbers is divisible by 9?',
        difficulty: 'EASY',
        marks: 1.0,
        negativeMarks: 0.25,
        explanation: 'Sum of digits must be divisible by 9. (2+4+3=9)',
        options: [
          { optionText: '243', isCorrect: true },
          { optionText: '244', isCorrect: false },
          { optionText: '245', isCorrect: false },
          { optionText: '247', isCorrect: false },
        ],
      },
      {
        sectionId: sampleSecId,
        topicId: sampleTopicId,
        questionText: 'What is the capital city of Australia?',
        difficulty: 'EASY',
        marks: 1.0,
        negativeMarks: 0.25,
        explanation: 'Canberra is the capital of Australia.',
        options: [
          { optionText: 'Sydney', isCorrect: false },
          { optionText: 'Melbourne', isCorrect: false },
          { optionText: 'Canberra', isCorrect: true },
          { optionText: 'Brisbane', isCorrect: false },
        ],
      },
    ];

    setJsonText(JSON.stringify(sample, null, 2));
    setParsedQuestions(sample);
    setParseError('');
  };

  const handleParseJSON = (text: string) => {
    setJsonText(text);
    if (!text.trim()) {
      setParsedQuestions([]);
      setParseError('');
      return;
    }

    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        setParseError('Root element must be a JSON array of question objects.');
        setParsedQuestions([]);
      } else {
        setParseError('');
        setParsedQuestions(parsed);
      }
    } catch (err: any) {
      setParseError('Invalid JSON format: ' + err.message);
      setParsedQuestions([]);
    }
  };

  const handleImport = async () => {
    if (parsedQuestions.length === 0 || parseError) return;

    setLoading(true);
    try {
      const res = await adminService.importQuestions(parsedQuestions);
      if (res.success) {
        setResultSummary(res.data);
        dispatch(addToast({ type: 'success', message: `Imported ${res.data.importedCount} questions successfully!` }));
      } else {
        dispatch(addToast({ type: 'error', message: res.message || 'Import failed' }));
      }
    } catch (e: any) {
      dispatch(addToast({ type: 'error', message: e.message || 'Error during import' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Bulk Question Importer</h2>
        <p className="text-xs text-slate-500">
          Import multiple questions via validated JSON payloads. Architecture is ready for PDF question extraction integration.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Code className="w-4 h-4 text-brand-600" /> Question Data Payload (JSON)
          </span>
          <button
            onClick={handleLoadSample}
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            Load Sample Template
          </button>
        </div>

        <textarea
          rows={10}
          value={jsonText}
          onChange={(e) => handleParseJSON(e.target.value)}
          placeholder="Paste JSON question array here..."
          className="w-full p-4 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        {parseError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {parseError}
          </div>
        )}

        {parsedQuestions.length > 0 && !parseError && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Validated {parsedQuestions.length} questions ready for import.
          </div>
        )}

        <Button
          onClick={handleImport}
          disabled={parsedQuestions.length === 0 || !!parseError || loading}
          isLoading={loading}
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Import Questions Now
        </Button>
      </div>

      {resultSummary && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Import Results Summary</h3>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="text-emerald-600 font-bold">Successfully Imported: {resultSummary.importedCount} questions</p>
            {resultSummary.errorsCount > 0 && (
              <p className="text-rose-600 font-bold">Failed Records: {resultSummary.errorsCount}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
