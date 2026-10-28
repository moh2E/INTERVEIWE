import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  Volume2,
} from 'lucide-react';
import {
  QuestionEvaluation,
  InterviewQuestion,
  InterviewLanguage,
} from '../types/interview';
import { TRANSLATIONS } from '../i18n/translations';
import { playQuestionSpeech, stopQuestionSpeech } from '../utils/speech';

interface FeedbackCardProps {
  evaluation: QuestionEvaluation;
  question: InterviewQuestion;
  isLastQuestion: boolean;
  currentLanguage: InterviewLanguage;
  onNextQuestion: () => void;
  onRetryQuestion: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  evaluation,
  question,
  isLastQuestion,
  currentLanguage,
  onNextQuestion,
  onRetryQuestion,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [showModelAnswer, setShowModelAnswer] = useState(true);
  const [isPlayingModelSpeech, setIsPlayingModelSpeech] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const handleToggleModelSpeech = () => {
    if (isPlayingModelSpeech) {
      stopQuestionSpeech();
      setIsPlayingModelSpeech(false);
    } else {
      setIsPlayingModelSpeech(true);
      playQuestionSpeech(evaluation.modelAnswer, currentLanguage, () => {
        setIsPlayingModelSpeech(false);
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
      {/* Top Header: Score & Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Sparkles className="w-3 h-3" />
            Évaluation par l'IA de votre réponse
          </div>
          <h3 className="text-lg font-bold text-white">
            {evaluation.score >= 80
              ? 'Excellente réponse ! Très percutant.'
              : evaluation.score >= 60
              ? 'Bonne base, avec quelques points à préciser.'
              : 'Réponse perfectible, travaillez la méthode STAR.'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {evaluation.encouragement}
          </p>
        </div>

        {/* Big Score Badge */}
        <div className="flex sm:flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 min-w-[120px]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">
            Note globale
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-3xl sm:text-4xl font-extrabold ${
                evaluation.score >= 80
                  ? 'text-emerald-400'
                  : evaluation.score >= 60
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {evaluation.score}
            </span>
            <span className="text-xs text-slate-500 font-bold">/100</span>
          </div>
        </div>
      </div>

      {/* 4 Criteria Bars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 text-[11px]">{t.criteriaClarity}</span>
            <span className="font-bold text-white text-xs">{evaluation.criteriaScores?.clarity ?? 80}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${evaluation.criteriaScores?.clarity ?? 80}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 text-[11px]">{t.criteriaRelevance}</span>
            <span className="font-bold text-white text-xs">{evaluation.criteriaScores?.relevance ?? 80}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${evaluation.criteriaScores?.relevance ?? 80}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 text-[11px]">{t.criteriaDepth}</span>
            <span className="font-bold text-white text-xs">{evaluation.criteriaScores?.depthAndSTAR ?? 75}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${evaluation.criteriaScores?.depthAndSTAR ?? 75}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 text-[11px]">{t.criteriaConfidence}</span>
            <span className="font-bold text-white text-xs">{evaluation.criteriaScores?.confidence ?? 80}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${evaluation.criteriaScores?.confidence ?? 80}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strengths & Improvements side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Points forts */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {t.strengthsTitle}
          </h4>
          <ul className="space-y-2">
            {evaluation.strengths.map((st, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Axes d'amélioration */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
          <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            {t.improvementsTitle}
          </h4>
          <ul className="space-y-2">
            {evaluation.improvements.map((imp, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Benchmark Model Answer (STAR) */}
      <div className="mb-6 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowModelAnswer(!showModelAnswer)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">
              {t.modelAnswerTitle}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
              Méthode STAR
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            {showModelAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showModelAnswer && (
          <div className="p-4 pt-1 border-t border-slate-850">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-900/70 p-3.5 rounded-lg border border-slate-800/80">
              "{evaluation.modelAnswer}"
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Utilisez cette structure pour ancrer des faits, chiffres et résultats.
              </span>
              <button
                type="button"
                onClick={handleToggleModelSpeech}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingModelSpeech ? 'Arrêter la lecture' : 'Écouter la réponse modèle'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onRetryQuestion}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.retryAnswer}</span>
        </button>

        <button
          type="button"
          onClick={onNextQuestion}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all transform active:scale-98 cursor-pointer"
        >
          <span>{isLastQuestion ? t.viewFinalReport : t.nextQuestion}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
