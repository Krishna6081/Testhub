import React, { useEffect, useState } from 'react';
import { bookmarkService } from '../services/bookmarkService';
import { Bookmark as BookmarkType } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { BookmarkCheck, Trash2, BookOpen } from 'lucide-react';
import { useAppDispatch } from '../hooks/storeHooks';
import { addToast } from '../store/slices/uiSlice';

export const BookmarksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookmarkService
      .getBookmarks()
      .then((res) => {
        if (res.success) setBookmarks(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await bookmarkService.removeBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      dispatch(addToast({ type: 'info', message: 'Bookmark removed.' }));
    } catch (e) {
      dispatch(addToast({ type: 'error', message: 'Failed to remove bookmark.' }));
    }
  };

  if (loading) return <LoadingSpinner message="Loading bookmarked questions..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Bookmarked Questions</h1>
        <p className="text-xs text-slate-500">Review saved high-yield questions for rapid revision.</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <BookmarkCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-slate-600 font-medium">No bookmarked questions yet.</p>
          <p className="text-xs text-slate-400">Click the bookmark icon during test attempts to save questions here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm) => {
            const q = bm.question;
            const correctOpt = q.options?.find((o) => o.isCorrect);

            return (
              <div key={bm.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
                      {q.section?.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{q.topic?.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemove(bm.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-base font-semibold text-slate-900 leading-relaxed">{q.questionText}</p>

                {correctOpt && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                    <span className="font-bold block text-emerald-700">Correct Answer:</span>
                    {correctOpt.optionText}
                  </div>
                )}

                {q.explanation && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-brand-600" /> Explanation:
                    </span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
