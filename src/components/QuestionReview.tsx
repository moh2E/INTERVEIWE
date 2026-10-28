import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Building,
  Target,
  Play,
  Layers,
} from 'lucide-react';
import {
  InterviewQuestion,
  CandidateProfile,
  QuestionCategory,
  InterviewLanguage,
} from '../types/interview';
import { TRANSLATIONS } from '../i18n/translations';

interface QuestionReviewProps {
  questions: InterviewQuestion[];
  roleSummary?: string;
  companyContext?: string;
  candidateProfile: CandidateProfile;
  currentLanguage: InterviewLanguage;
  onStartSimulator: () => void;
  onBackToEdit: () => void;
}

export const QuestionReview: React.FC<QuestionReviewProps> = ({
  questions,
  roleSummary,
  companyContext,
  candidateProfile,
  currentLanguage,
  onStartSimulator,
  onBackToEdit,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const categoryConfig: Record<
    QuestionCategory,
    { label: string; bg: string; text: string; border: string }
  > = {
    motivation: {
      label: t.categoryMotivation,
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20',
    },
    technical: {
      label: t.categoryTechnical,
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
    projects: {
      label: t.categoryProjects,
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
    },
    behavioral: {
      label: t.categoryBehavioral,
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
    },
  };

  const difficultyBadge = (diff: string) => {
    switch (diff) {
      case 'facile':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Facile</span>;
      case 'avancé':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">Avancé</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">Moyen</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onBackToEdit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Modifier le profil ou les critères</span>
        </button>

        <button
          onClick={onStartSimulator}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-98 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{t.startSimulationBtn}</span>
        </button>
      </div>

      {/* Header Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {candidateProfile.company}
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="text-xs font-medium text-slate-300">
            {candidateProfile.position}
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="capitalize text-xs text-slate-400">
            Niveau {candidateProfile.level}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {t.questionsReadyTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-4 max-w-3xl">
          {roleSummary ||
            'Vos questions ont été générées et adaptées sur-mesure aux exigences de ce poste et de cette entreprise.'}
        </p>

        {companyContext && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
            <Building className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Contexte Entreprise : </span>
              {companyContext}
            </div>
          </div>
        )}
      </div>

      {/* Category Pills & Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>{questions.length} questions générées (Simulation complète)</span>
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          Entraînez-vous avec notre simulateur vocal et textuel
        </div>
      </div>

      {/* Questions Grid */}
      <div className="space-y-4 mb-10">
        {questions.map((q, index) => {
          const cfg = categoryConfig[q.category] || categoryConfig.motivation;
          return (
            <div
              key={q.id || index}
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-xl p-5 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300">
                    {index + 1}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                {difficultyBadge(q.difficulty)}
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-white mb-2 leading-snug">
                {q.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-start gap-2 text-slate-400">
                  <Target className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Ce qui est évalué : </strong>
                    {q.intent}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-slate-400">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Astuce clé : </strong>
                    {q.sampleAnswerTip}
                  </span>
                </div>
              </div>

              {q.expectedKeywords && q.expectedKeywords.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500">Mots-clés attendus :</span>
                  {q.expectedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating CTA Banner */}
      <div className="sticky bottom-4 z-20 bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-emerald-950/90 border border-indigo-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Prêt(e) à passer l'entretien en conditions réelles ?
          </div>
          <div className="text-xs text-slate-400">
            Le recruteur IA vous posera les questions une par une et vous fournira un feedback immédiat.
          </div>
        </div>

        <button
          onClick={onStartSimulator}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{t.startSimulationBtn}</span>
        </button>
      </div>
    </div>
  );
};
