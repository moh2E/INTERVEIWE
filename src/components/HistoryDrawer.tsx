import React from 'react';
import { X, Trash2, Calendar, Trophy, Briefcase, Building2, ArrowRight } from 'lucide-react';
import { SavedInterviewSession, InterviewLanguage } from '../types/interview';
import { TRANSLATIONS } from '../i18n/translations';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SavedInterviewSession[];
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  currentLanguage: InterviewLanguage;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  onDeleteSession,
  onClearAll,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-400" />
                {t.historyBtn}
              </h2>
              <p className="text-xs text-slate-400">
                Vos simulations enregistrées sur cet appareil
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                {t.noHistory}
              </div>
            ) : (
              sessions.map((sess) => {
                const dateStr = new Date(sess.timestamp).toLocaleDateString(
                  currentLanguage === 'ar' ? 'ar-MA' : currentLanguage === 'en' ? 'en-US' : 'fr-FR',
                  {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                );

                return (
                  <div
                    key={sess.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{sess.profile.company}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sess.profile.position}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-400">
                          {sess.overallScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>

                      <button
                        type="button"
                        onClick={() => onDeleteSession(sess.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="Supprimer cette session"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {sessions.length > 0 && (
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1.5 transition-colors cursor-pointer"
              >
                Effacer tout l'historique
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
