import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Send,
  Timer,
  BookOpen,
  HelpCircle,
  X,
  Bot,
  User,
  CheckCircle,
  Wand2,
  Check,
  Zap,
} from 'lucide-react';
import {
  InterviewQuestion,
  CandidateProfile,
  QuestionEvaluation,
  SessionAnswerRecord,
  InterviewLanguage,
} from '../types/interview';
import { TRANSLATIONS } from '../i18n/translations';
import {
  playQuestionSpeech,
  stopQuestionSpeech,
  createSpeechRecognizer,
} from '../utils/speech';
import { FeedbackCard } from './FeedbackCard';
import { AudioVisualizer } from './AudioVisualizer';

interface SimulatorProps {
  questions: InterviewQuestion[];
  candidateProfile: CandidateProfile;
  currentLanguage: InterviewLanguage;
  onFinishSession: (records: SessionAnswerRecord[]) => void;
  onExit: () => void;
}

export const Simulator: React.FC<SimulatorProps> = ({
  questions,
  candidateProfile,
  currentLanguage,
  onFinishSession,
  onExit,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<QuestionEvaluation | null>(null);
  const [answersHistory, setAnswersHistory] = useState<SessionAnswerRecord[]>([]);

  // Audio speech synthesis & recognition state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const speechRecognizerRef = useRef<any>(null);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // STAR helper toggle
  const [showStarHelper, setShowStarHelper] = useState(false);

  // AI Re-writer state
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenData, setRewrittenData] = useState<{
    optimizedAnswer: string;
    starBreakdown?: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    coachTip?: string;
  } | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Start timer on mount and reset per question
  useEffect(() => {
    setSecondsElapsed(0);
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopQuestionSpeech();
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stop();
      }
    };
  }, [currentIndex]);

  const handleToggleQuestionSpeech = () => {
    if (isPlayingAudio) {
      stopQuestionSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      playQuestionSpeech(currentQuestion.question, currentLanguage, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleToggleListening = () => {
    setSpeechError(null);

    if (isListening) {
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognizer = createSpeechRecognizer(currentLanguage, {
      onResult: (transcript, isFinal) => {
        setUserAnswer((prev) => {
          const separator = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
          return prev + separator + transcript;
        });
      },
      onError: (err) => {
        console.warn('Speech recognition error:', err);
        setSpeechError('Microphone indisponible ou permission non accordée.');
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (!recognizer) {
      setSpeechError('La reconnaissance vocale n’est pas supportée sur ce navigateur.');
      return;
    }

    try {
      recognizer.start();
      speechRecognizerRef.current = recognizer;
      setIsListening(true);
    } catch (e: any) {
      console.error(e);
      setSpeechError('Impossible de démarrer le microphone.');
      setIsListening(false);
    }
  };

  const handleInsertStarTemplate = () => {
    const starTemplate = `[Situation : Contexte du projet ou de l'entreprise]\n[Tâche : Défi à résoudre ou objectif fixé]\n[Action : Ce que j'ai mis en place personnellement, technologies utilisées]\n[Résultat : Impact chiffré, retours d'utilisateurs ou leçon retenue]`;
    setUserAnswer((prev) => (prev.trim().length ? prev + '\n\n' + starTemplate : starTemplate));
  };

  // AI Answer Rewrite Handler
  const handleRewriteWithAI = async () => {
    if (!userAnswer.trim()) return;
    setIsRewriting(true);
    setRewrittenData(null);

    try {
      const res = await fetch('/api/interview/rewrite-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawAnswer: userAnswer,
          question: currentQuestion,
          candidateProfile,
          language: currentLanguage,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRewrittenData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleApplyRewritten = () => {
    if (rewrittenData?.optimizedAnswer) {
      setUserAnswer(rewrittenData.optimizedAnswer);
      setRewrittenData(null);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    stopQuestionSpeech();
    setIsPlayingAudio(false);
    if (isListening && speechRecognizerRef.current) {
      speechRecognizerRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    setSpeechError(null);

    try {
      const res = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          category: currentQuestion.category,
          userResponse: userAnswer,
          candidateProfile,
          language: currentLanguage,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setCurrentEvaluation(data.data);
      } else {
        throw new Error(data.error || 'Erreur d\'évaluation');
      }
    } catch (err: any) {
      console.error(err);
      setSpeechError(err.message || 'Erreur lors de l’évaluation.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    const newRecord: SessionAnswerRecord = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      category: currentQuestion.category,
      userAnswer,
      timeSpentSeconds: secondsElapsed,
      evaluation: currentEvaluation || undefined,
    };

    const updatedHistory = [...answersHistory, newRecord];
    setAnswersHistory(updatedHistory);

    if (isLastQuestion) {
      onFinishSession(updatedHistory);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setCurrentEvaluation(null);
      setRewrittenData(null);
    }
  };

  const handleRetryQuestion = () => {
    setCurrentEvaluation(null);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const categoryBadgeColors = {
    motivation: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    technical: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    projects: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    behavioral: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  }[currentQuestion.category];

  const personaLabel = {
    coach: 'Coach Mentor Pédagogue',
    tech_lead: 'Lead Tech Exigeant',
    corporate_hr: 'Recruteur Corporate RH',
  }[candidateProfile.recruiterPersona || 'coach'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Bar: Progress, Timer, Exit */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            Question {currentIndex + 1} / {questions.length}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${categoryBadgeColors}`}
          >
            {currentQuestion.categoryLabel}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg">
            <span className="font-medium text-slate-300">{personaLabel}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Timer className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <button
            onClick={onExit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Quitter la simulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-900 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Recruiter Question Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 p-0.5 shrink-0 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-slate-400">
                Recruteur ({candidateProfile.company}) • <span className="text-slate-300">{personaLabel}</span>
              </span>
              <button
                type="button"
                onClick={handleToggleQuestionSpeech}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors cursor-pointer"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>Arrêter la voix</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.listenQuestion}</span>
                  </>
                )}
              </button>
            </div>

            <h2 className="text-base sm:text-xl font-bold text-white leading-snug">
              {currentQuestion.question}
            </h2>

            {isPlayingAudio && (
              <div className="mt-2">
                <AudioVisualizer isActive={true} color="indigo" />
              </div>
            )}

            <div className="mt-3 text-xs text-slate-400 flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-300">Intention du recruteur : </strong>
                {currentQuestion.intent}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* If evaluation is ready, show FeedbackCard */}
      {currentEvaluation ? (
        <FeedbackCard
          evaluation={currentEvaluation}
          question={currentQuestion}
          isLastQuestion={isLastQuestion}
          currentLanguage={currentLanguage}
          onNextQuestion={handleNextQuestion}
          onRetryQuestion={handleRetryQuestion}
        />
      ) : (
        /* Candidate Answer Input Section */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          {/* Header toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-300">
                Votre réponse de candidat
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleInsertStarTemplate}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Insérer la structure Situation - Tâche - Action - Résultat"
              >
                <BookOpen className="w-3 h-3 text-amber-400" />
                <span>Trame STAR</span>
              </button>

              <button
                type="button"
                onClick={() => setShowStarHelper(!showStarHelper)}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                {t.starMethodHelp}
              </button>
            </div>
          </div>

          {/* STAR Method explainer callout */}
          {showStarHelper && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <div className="font-bold mb-1">Méthode S.T.A.R recommandée :</div>
              <div className="text-[11px] text-amber-300/90 leading-relaxed">
                {t.starExplanation}
              </div>
            </div>
          )}

          {/* Textarea */}
          <div className="relative">
            <textarea
              rows={6}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={t.answerPlaceholder}
              disabled={isEvaluating}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all"
            />

            <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 pointer-events-none">
              {userAnswer.trim().split(/\s+/).filter(Boolean).length} mots •{' '}
              {userAnswer.length} caractères
            </div>
          </div>

          {/* AI Re-write Preview Box */}
          {rewrittenData && (
            <div className="mt-4 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 animate-in fade-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Reformulation STAR optimisée par l'IA :
                </span>
                <button
                  type="button"
                  onClick={handleApplyRewritten}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Utiliser cette version</span>
                </button>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/70 p-3 rounded-lg border border-slate-850 mb-2">
                "{rewrittenData.optimizedAnswer}"
              </p>

              {rewrittenData.coachTip && (
                <div className="text-[11px] text-indigo-300 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{rewrittenData.coachTip}</span>
                </div>
              )}
            </div>
          )}

          {/* Microphone dictation & Audio Visualizer */}
          {isListening && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-emerald-300 font-medium">
                  {t.listeningActive}
                </span>
              </div>
              <AudioVisualizer isActive={true} color="emerald" />
            </div>
          )}

          {speechError && (
            <div className="mt-2 text-xs text-rose-400">
              {speechError}
            </div>
          )}

          {/* Action Row */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mic button */}
              <button
                type="button"
                onClick={handleToggleListening}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 text-rose-400" />
                    <span>{t.stopListening}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>{t.speakBtn}</span>
                  </>
                )}
              </button>

              {/* AI Rewrite Draft button */}
              {userAnswer.trim().length > 20 && !rewrittenData && (
                <button
                  type="button"
                  onClick={handleRewriteWithAI}
                  disabled={isRewriting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 transition-colors cursor-pointer"
                  title="Optimiser la formulation selon la méthode STAR"
                >
                  {isRewriting ? (
                    <div className="w-3.5 h-3.5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                  <span>Optimiser avec l'IA</span>
                </button>
              )}
            </div>

            {/* Submit for evaluation CTA */}
            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={isEvaluating || !userAnswer.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/25 transition-all transform active:scale-98 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.evaluatingAnswer}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.submitAnswerBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
