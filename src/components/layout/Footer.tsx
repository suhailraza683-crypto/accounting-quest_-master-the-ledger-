import React from 'react';
import { RotateCcw, Award, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onResetProgress: () => void;
  completedCount: number;
  totalChapters: number;
}

export const Footer: React.FC<FooterProps> = ({
  onResetProgress,
  completedCount,
  totalChapters,
}) => {
  return (
    <footer className="mt-auto border-t-2 border-slate-200 bg-white text-slate-600 py-6 px-4 sm:px-6 text-xs font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-700">Accounting Quest</span>
          <span>• Designed for CBSE & State Board Class 11 Accounting</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold">Curriculum: {completedCount}/{totalChapters} Chapters Mastered</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all saved game data and progress? This cannot be undone.')) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors focus:outline-none font-bold"
            title="Reset Game Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
