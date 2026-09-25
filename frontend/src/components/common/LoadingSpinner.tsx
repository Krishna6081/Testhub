import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading TestHub...' }) => {
  return (
    <div className="min-h-[350px] flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
      <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
