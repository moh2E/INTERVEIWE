import React from 'react';
import {
  Bot,
  History,
  Languages,
  BookOpen,
  ShieldAlert,
  Play,
  Users,
} from 'lucide-react';
import { InterviewLanguage } from '../types/interview';
import { TRANSLATIONS } from '../i18n/translations';

interface HeaderProps {
  currentLanguage: InterviewLanguage;
  onLanguageChange: (lang: InterviewLanguage) => void;
  activeNavTab: 'simulator' | 'bank' | 'traps';
  onSelectNavTab: (tab: 'simulator' | 'bank' | 'traps') => void;
  onOpenHistory: () => void;
  savedSessionsCount: number;
  onResetToHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  activeNavTab,
  onSelectNavTab,
  onOpenHistory,
  savedSessionsCount,
  onResetToHome,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark + Group ALBA4EVER Attribution */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onResetToHome}
            className="flex items-center gap-2.5 text-left transition-transform active:scale-98 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  InterviewMate <span className="text-emerald-400">AI</span>
                </span>
              </div>
              <div className="text-[10px] font-semibold text-indigo-400/90 tracking-wide flex items-center gap-1">
                <span>By Group ALBA4EVER</span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line controls) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onSelectNavTab('simulator')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'simulator'
                ? 'bg-slate-850 text-white border border-slate-750 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
            <span>Simulateur d'Entretien</span>
          </button>

          <button
            onClick={() => onSelectNavTab('bank')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'bank'
                ? 'bg-slate-850 text-white border border-slate-750 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Banque par Poste</span>
          </button>

          <button
            onClick={() => onSelectNavTab('traps')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'traps'
                ? 'bg-slate-850 text-white border border-slate-750 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Guide des Pièges</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Language + History) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language selector */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as InterviewLanguage)}
              aria-label={t.formLang}
              className="bg-transparent text-slate-200 py-1 px-1 focus:outline-none cursor-pointer font-medium text-xs"
            >
              <option value="fr" className="bg-slate-900 text-slate-200">
                Français
              </option>
              <option value="en" className="bg-slate-900 text-slate-200">
                English
              </option>
              <option value="ar" className="bg-slate-900 text-slate-200">
                العربية
              </option>
            </select>
          </div>

          {/* Past Sessions History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            title={t.historyBtn}
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Sessions</span>
            {savedSessionsCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                {savedSessionsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-850 bg-slate-950 px-2 py-1.5 text-xs">
        <button
          onClick={() => onSelectNavTab('simulator')}
          className={`px-2 py-1 rounded text-[11px] font-semibold ${
            activeNavTab === 'simulator' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          Simulateur
        </button>
        <button
          onClick={() => onSelectNavTab('bank')}
          className={`px-2 py-1 rounded text-[11px] font-semibold ${
            activeNavTab === 'bank' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          Banque par Poste
        </button>
        <button
          onClick={() => onSelectNavTab('traps')}
          className={`px-2 py-1 rounded text-[11px] font-semibold ${
            activeNavTab === 'traps' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          Guide Pièges
        </button>
      </div>
    </header>
  );
};
