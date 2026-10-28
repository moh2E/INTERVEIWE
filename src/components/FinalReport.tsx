import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Printer,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  Building,
  Target,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';
import {
  CandidateProfile,
  SessionAnswerRecord,
  FinalReportData,
  InterviewLanguage,
} from '../types/interview';
import { TRANSLATIONS } from '../i18n/translations';

interface FinalReportProps {
  reportData: FinalReportData;
  candidateProfile: CandidateProfile;
  sessionAnswers: SessionAnswerRecord[];
  currentLanguage: InterviewLanguage;
  onRestart: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({
  reportData,
  candidateProfile,
  sessionAnswers,
  currentLanguage,
  onRestart,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [showQuestionsBreakdown, setShowQuestionsBreakdown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const textToCopy = `InterviewMate AI - Bilan d'entretien pour ${candidateProfile.position} chez ${candidateProfile.company}
Score Global: ${reportData.overallScore}/100 - ${reportData.verdict}
Forces: ${reportData.topStrengths.join(' | ')}
Fiche Jour J: ${reportData.interviewDayCheatSheet.join(' | ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getScoreVerdictBadge = (score: number) => {
    if (score >= 80) {
      return {
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        text: 'Niveau Élevé - Prêt(e) à performer !',
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        text: 'Bonne dynamique - Quelques révisions recommandées',
      };
    }
    return {
      bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      text: 'Entraînement supplémentaire conseillé',
    };
  };

  const badgeInfo = getScoreVerdictBadge(reportData.overallScore);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 print:p-0 print:m-0 print:max-w-full">
      {/* Top Banner */}
      <div className="text-center mb-8 print:mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>{t.sessionFinished}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
          {t.finalReportTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          {candidateProfile.position} • {candidateProfile.company} ({candidateProfile.opportunityType})
        </p>
      </div>

      {/* Main Scorecard Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden print:border-slate-300 print:text-black">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="text-center md:text-left">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${badgeInfo.bg}`}>
              {reportData.verdict || badgeInfo.text}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Performance globale de l'entretien
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
              {reportData.summaryAnalysis}
            </p>
          </div>

          {/* Big Score Radial/Circle */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 min-w-[140px] shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Score Final
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                {reportData.overallScore}
              </span>
              <span className="text-sm font-bold text-slate-500">/100</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">
              {sessionAnswers.length} questions testées
            </span>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Maîtrise par catégorie d'évaluation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Motivation</span>
                <span className="font-bold text-indigo-400">
                  {reportData.categoryPerformance?.motivation ?? 80}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${reportData.categoryPerformance?.motivation ?? 80}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Technique</span>
                <span className="font-bold text-emerald-400">
                  {reportData.categoryPerformance?.technical ?? 75}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${reportData.categoryPerformance?.technical ?? 75}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Projets (STAR)</span>
                <span className="font-bold text-amber-400">
                  {reportData.categoryPerformance?.projects ?? 75}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${reportData.categoryPerformance?.projects ?? 75}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Soft Skills</span>
                <span className="font-bold text-purple-400">
                  {reportData.categoryPerformance?.behavioral ?? 85}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${reportData.categoryPerformance?.behavioral ?? 85}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Priority Revisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Top Strengths */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Vos points forts observés</span>
          </h3>
          <ul className="space-y-2.5">
            {reportData.topStrengths.map((str, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Revisions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Points clés à réviser avant le jour J</span>
          </h3>
          <ul className="space-y-2.5">
            {reportData.priorityAreasToRevise.map((rev, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">!</span>
                <span className="leading-relaxed">{rev}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cheat Sheet for Interview Day */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">
            {t.cheatSheetTitle} : {candidateProfile.company}
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Conseils stratégiques et questions à poser au recruteur pour laisser une impression mémorable.
        </p>

        <div className="space-y-2.5">
          {reportData.interviewDayCheatSheet.map((tip, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {i + 1}
              </div>
              <span className="leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion: All Questions & Answers Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl mb-8 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowQuestionsBreakdown(!showQuestionsBreakdown)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white">
              Détail des {sessionAnswers.length} réponses et remarques individuelles
            </span>
          </div>
          {showQuestionsBreakdown ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showQuestionsBreakdown && (
          <div className="p-4 pt-0 space-y-4 border-t border-slate-800">
            {sessionAnswers.map((rec, index) => (
              <div key={index} className="p-4 rounded-xl bg-slate-950 border border-slate-850">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white">
                    Q{index + 1} : {rec.questionText}
                  </span>
                  {rec.evaluation && (
                    <span className="font-extrabold text-xs text-emerald-400">
                      {rec.evaluation.score}/100
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 italic mb-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  "{rec.userAnswer || 'Pas de réponse formulée'}"
                </div>
                {rec.evaluation && (
                  <div className="text-[11px] text-slate-300">
                    <strong className="text-indigo-400">Axe clé : </strong>
                    {rec.evaluation.improvements[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.exportReport}</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copié !' : 'Partager / Copier'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all transform active:scale-98 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.restartInterview}</span>
        </button>
      </div>
    </div>
  );
};
