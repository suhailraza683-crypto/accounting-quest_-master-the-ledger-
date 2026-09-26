import React from 'react';
import { PlayerStats, RankTier } from '../../types.ts';
import { Volume2, VolumeX, BookOpen, User, Flame, ArrowLeft, Bot, BookMarked, Trophy } from 'lucide-react';

interface HeaderProps {
  stats: PlayerStats;
  rankInfo: { tier: RankTier; nextXp: number; progress: number; badgeColor: string };
  currentMultiplier: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStudyGuide: () => void;
  onOpenGlossary: () => void;
  onOpenStats: () => void;
  onOpenLeaderboard: () => void;
  onOpenChat: () => void;
  activeLevel: number | null;
  onReturnHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  rankInfo,
  currentMultiplier,
  soundEnabled,
  onToggleSound,
  onOpenStudyGuide,
  onOpenGlossary,
  onOpenStats,
  onOpenLeaderboard,
  onOpenChat,
  activeLevel,
  onReturnHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-100 text-slate-800 px-4 py-3 sm:px-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Title & Navigation */}
        <div className="flex items-center gap-3">
          {activeLevel !== null ? (
            <button
              onClick={onReturnHome}
              className="btn-tactile flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors border-2 border-slate-200 border-b-4 border-b-slate-300 active:border-b-2 shadow-sm"
              title="Return to Chapter Menu"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Back to Menu</span>
            </button>
          ) : null}

          <div
            onClick={activeLevel !== null ? onReturnHome : undefined}
            className={`flex items-center gap-2.5 ${activeLevel !== null ? 'cursor-pointer hover:opacity-90' : ''}`}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 shadow-md shadow-indigo-500/25 flex items-center justify-center text-white text-xl">
              <span>📖</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  Accounting Quest
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
                  Class 11
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Master NCERT Double-Entry Arcade
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Streak & Multiplier Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 shadow-sm">
            <Flame
              className={`w-4 h-4 transition-transform ${
                stats.currentStreak > 0
                  ? 'text-amber-500 fill-amber-500 scale-110 animate-bounce'
                  : 'text-amber-300'
              }`}
            />
            <div className="flex items-center gap-1 text-xs">
              <span className="font-black text-amber-700 text-sm">{stats.currentStreak}</span>
              <span className="text-amber-600 font-semibold hidden sm:inline">Streak</span>
              {currentMultiplier > 1 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-md font-black text-[11px] bg-amber-400 text-amber-950 shadow-xs">
                  {currentMultiplier}x
                </span>
              )}
            </div>
          </div>

          {/* Rank Badge & XP */}
          <div
            onClick={onOpenStats}
            className="cursor-pointer group flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-indigo-50/80 hover:bg-indigo-50 border-2 border-indigo-100 text-indigo-950 transition-all shadow-sm"
            title="View Player Stats & Badges"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shrink-0" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="truncate max-w-[100px] sm:max-w-none text-slate-800">
                  {rankInfo.tier}
                </span>
                <span className="text-indigo-600 font-extrabold">{stats.xp} XP</span>
              </div>
              <div className="w-16 sm:w-24 h-1.5 bg-indigo-200/70 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${rankInfo.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSound}
              className="btn-tactile p-2 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 border-b-4 border-b-slate-300 active:border-b-2 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              onClick={onOpenChat}
              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:border-b-0 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-500/20"
              title="Ask AI Accounting Tutor (Professor Ledger)"
            >
              <Bot className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">AI Tutor</span>
            </button>

            <button
              onClick={onOpenGlossary}
              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 border-b-4 border-b-indigo-300 active:border-b-2 text-indigo-700 text-xs font-bold transition-all shadow-sm"
              title="Accounting Glossary & NCERT References"
            >
              <BookMarked className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Glossary</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="btn-tactile p-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 border-b-4 border-b-amber-300 active:border-b-2 text-amber-700 transition-colors shadow-sm"
              title="View Global Leaderboard"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
            </button>

            <button
              onClick={onOpenStudyGuide}
              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 border-b-4 border-b-slate-300 active:border-b-2 text-slate-700 text-xs font-bold transition-all shadow-sm"
              title="Study Guide & NCERT Summary"
            >
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Handbook</span>
            </button>

            <button
              onClick={onOpenStats}
              className="btn-tactile p-2 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 border-b-4 border-b-slate-300 active:border-b-2 text-slate-700 hover:text-indigo-600 transition-colors shadow-sm"
              title="Player Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
