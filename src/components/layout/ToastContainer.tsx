import React from 'react';
import { ToastItem, FloatingXpItem } from '../../types.ts';
import { Sparkles, Target, Zap, X, Flame, Award, CheckCircle2 } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastItem[];
  floatingXps: FloatingXpItem[];
  onDismissToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  floatingXps,
  onDismissToast,
}) => {
  return (
    <>
      {/* Floating XP Animation Overlay */}
      {floatingXps.length > 0 && (
        <div
          className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2 select-none"
          aria-live="polite"
        >
          {floatingXps.map((item) => (
            <div
              key={item.id}
              className="animate-float-xp flex items-center gap-2.5 sm:gap-3.5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white/95 border-3 border-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.35)] backdrop-blur-md text-amber-900 font-black tracking-wide"
            >
              <div className="p-1 rounded-full bg-amber-100 text-amber-600">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-amber-500" style={{ animationDuration: '4s' }} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  +{item.amount} XP
                </span>

                {item.multiplier && item.multiplier > 1 && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-xs font-black text-amber-800">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span>{item.multiplier.toFixed(1)}x</span>
                  </span>
                )}
              </div>

              {item.label && (
                <span className="text-xs font-bold text-slate-600 pl-2 border-l-2 border-amber-200 max-w-[160px] sm:max-w-xs truncate">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification Stack */}
      {toasts.length > 0 && (
        <aside
          aria-label="Notifications"
          className="fixed top-16 sm:top-20 right-3 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-[calc(100%-1.5rem)] pointer-events-none"
        >
          {toasts.map((toast) => {
            const isXp = toast.type === 'xp_gain';
            const isMission = toast.type === 'mission_completed';
            const isRank = toast.type === 'rank_up';

            return (
              <div
                key={toast.id}
                role="status"
                className={`animate-toast-slide pointer-events-auto relative overflow-hidden rounded-2xl border-2 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-200 bg-white ${
                  isXp
                    ? 'border-amber-300 shadow-amber-500/10'
                    : isMission
                    ? 'border-emerald-300 shadow-emerald-500/10 ring-2 ring-emerald-400/20'
                    : isRank
                    ? 'border-indigo-300 shadow-indigo-500/10'
                    : 'border-slate-200'
                }`}
              >
                <div className="p-4 flex items-start gap-3.5">
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isXp
                        ? 'bg-amber-100 text-amber-600 border border-amber-200'
                        : isMission
                        ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                        : isRank
                        ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {isXp ? (
                      <Zap className="w-5 h-5 fill-amber-500/20" />
                    ) : isMission ? (
                      <Target className="w-5 h-5" />
                    ) : isRank ? (
                      <Award className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {toast.title}
                      </h4>

                      {toast.xpAmount && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 border border-amber-200 text-amber-800">
                          +{toast.xpAmount} XP
                        </span>
                      )}

                      {toast.multiplier && toast.multiplier > 1 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 border border-orange-200 text-orange-800 flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                          {toast.multiplier.toFixed(1)}x
                        </span>
                      )}
                    </div>

                    {toast.message && (
                      <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2 font-medium">
                        {toast.message}
                      </p>
                    )}
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={() => onDismissToast(toast.id)}
                    aria-label="Dismiss notification"
                    className="shrink-0 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Duration Progress Bar */}
                {toast.durationMs && (
                  <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full animate-progress-shrink ${
                        isXp
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
                          : isMission
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                          : 'bg-indigo-500'
                      }`}
                      style={{ animationDuration: `${toast.durationMs}ms` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </aside>
      )}
    </>
  );
};
