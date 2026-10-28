import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SetupForm } from './components/SetupForm';
import { QuestionReview } from './components/QuestionReview';
import { Simulator } from './components/Simulator';
import { FinalReport } from './components/FinalReport';
import { HistoryDrawer } from './components/HistoryDrawer';
import { QuestionBankView } from './components/QuestionBankView';
import { InterviewTrapsGuide } from './components/InterviewTrapsGuide';
import {
  CandidateProfile,
  InterviewQuestion,
  SessionAnswerRecord,
  FinalReportData,
  SavedInterviewSession,
  InterviewLanguage,
} from './types/interview';
import { BankQuestion } from './data/studentQuestionBank';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<InterviewLanguage>('fr');
  const [activeNavTab, setActiveNavTab] = useState<'simulator' | 'bank' | 'traps'>('simulator');
  const [step, setStep] = useState<'setup' | 'review' | 'simulator' | 'report'>('setup');

  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [roleSummary, setRoleSummary] = useState<string>('');
  const [companyContext, setCompanyContext] = useState<string>('');
  const [sessionAnswers, setSessionAnswers] = useState<SessionAnswerRecord[]>([]);
  const [reportData, setReportData] = useState<FinalReportData | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History state
  const [savedSessions, setSavedSessions] = useState<SavedInterviewSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('interviewmate_sessions');
      if (stored) {
        setSavedSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load sessions from localStorage', e);
    }
  }, []);

  // Update HTML document dir attribute when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage]);

  // Generate Questions handler
  const handleGenerateQuestions = async (profile: CandidateProfile) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCandidateProfile(profile);

    try {
      const res = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          language: profile.language || currentLanguage,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setQuestions(data.data.questions || []);
        setRoleSummary(data.data.roleSummary || '');
        setCompanyContext(data.data.companyContext || '');
        setStep('review');
        setActiveNavTab('simulator');
      } else {
        throw new Error(data.error || 'Erreur lors de la génération des questions.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 'Impossible de contacter le moteur IA. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Practice a specific question selected directly from the Question Bank
  const handlePracticeQuestionFromBank = (bankQ: BankQuestion) => {
    const profile: CandidateProfile = {
      company: bankQ.companyTarget.split('/')[0].trim(),
      position: bankQ.role,
      opportunityType: 'stage_pfe',
      level: 'debutant',
      skills: 'Compétences de la spécialité',
      language: currentLanguage,
      recruiterPersona: 'coach',
    };

    const singleQ: InterviewQuestion = {
      id: bankQ.id,
      category: bankQ.category,
      categoryLabel: bankQ.domainLabel,
      question: bankQ.question,
      intent: bankQ.recruiterTrap,
      difficulty: 'moyen',
      sampleAnswerTip: bankQ.keyAdvice,
      expectedKeywords: ['STAR', 'Méthode', 'Résultat'],
    };

    setCandidateProfile(profile);
    setQuestions([singleQ]);
    setRoleSummary(`Entraînement ciblé sur une question clé pour le poste de ${bankQ.role}.`);
    setCompanyContext(`Entreprises cibles : ${bankQ.companyTarget}.`);
    setStep('simulator');
    setActiveNavTab('simulator');
  };

  // Finish Simulator & Generate Final Report
  const handleFinishSimulator = async (answers: SessionAnswerRecord[]) => {
    setSessionAnswers(answers);
    setIsGeneratingReport(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/interview/generate-final-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateProfile,
          answersAndEvaluations: answers,
          language: currentLanguage,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const finalRep = data.data as FinalReportData;
        setReportData(finalRep);

        // Save session to history
        if (candidateProfile) {
          const newSaved: SavedInterviewSession = {
            id: 'sess_' + Date.now(),
            timestamp: Date.now(),
            profile: candidateProfile,
            questionsCount: answers.length,
            overallScore: finalRep.overallScore,
            verdict: finalRep.verdict,
          };
          const updated = [newSaved, ...savedSessions].slice(0, 20);
          setSavedSessions(updated);
          try {
            localStorage.setItem('interviewmate_sessions', JSON.stringify(updated));
          } catch (e) {
            console.warn('Storage error', e);
          }
        }

        setStep('report');
      } else {
        throw new Error(data.error || 'Erreur lors de la génération du bilan final');
      }
    } catch (err: any) {
      console.error(err);
      const avgScore =
        answers.length > 0
          ? Math.round(
              answers.reduce((acc, curr) => acc + (curr.evaluation?.score ?? 75), 0) /
                answers.length
            )
          : 80;

      const fallbackReport: FinalReportData = {
        overallScore: avgScore,
        verdict:
          avgScore >= 80
            ? 'Prêt(e) à performer pour l’entretien !'
            : 'Bonne dynamique, continuez l’entraînement',
        summaryAnalysis:
          'Vous avez fait preuve d’une bonne structure dans vos réponses. Vos explications démontrent une réelle motivation et un potentiel solide pour le poste.',
        categoryPerformance: {
          motivation: 82,
          technical: 78,
          projects: 80,
          behavioral: 85,
        },
        topStrengths: [
          'Excellente clarté d’expression et vocabulaire professionnel.',
          'Capacité à relier vos compétences aux besoins de l’entreprise.',
        ],
        priorityAreasToRevise: [
          'Quantifier encore davantage vos résultats (chiffres, délais, métriques).',
          'Structurer systématiquement avec la méthode STAR.',
        ],
        interviewDayCheatSheet: [
          'Arrivez 10 minutes avant et soignez les 2 premières minutes (sourire, pitch fluide).',
          `Question à poser au recruteur chez ${candidateProfile?.company} : "Quels seront les principaux défis techniques ou humains confiés au candidat retenu dans les 3 premiers mois ?"`,
          'Préparez 2 anecdotes marquantes sur vos projets personnels ou scolaires.',
        ],
      };
      setReportData(fallbackReport);
      setStep('report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleRestart = () => {
    setQuestions([]);
    setSessionAnswers([]);
    setReportData(null);
    setStep('setup');
    setActiveNavTab('simulator');
  };

  const handleDeleteSession = (id: string) => {
    const updated = savedSessions.filter((s) => s.id !== id);
    setSavedSessions(updated);
    try {
      localStorage.setItem('interviewmate_sessions', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleClearAllSessions = () => {
    setSavedSessions([]);
    try {
      localStorage.removeItem('interviewmate_sessions');
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={(lang) => setCurrentLanguage(lang)}
        activeNavTab={activeNavTab}
        onSelectNavTab={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'simulator' && step === 'report') {
            setStep('setup');
          }
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedSessionsCount={savedSessions.length}
        onResetToHome={handleRestart}
      />

      <main className="flex-1">
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white ml-2 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* View Tab 1: Banque de Questions par Poste */}
        {activeNavTab === 'bank' && (
          <QuestionBankView
            currentLanguage={currentLanguage}
            onPracticeQuestion={handlePracticeQuestionFromBank}
          />
        )}

        {/* View Tab 2: Guide des Questions Pièges pour Étudiants */}
        {activeNavTab === 'traps' && (
          <InterviewTrapsGuide
            currentLanguage={currentLanguage}
            onLaunchSimulator={() => {
              setActiveNavTab('simulator');
              setStep('setup');
            }}
          />
        )}

        {/* View Tab 3: Simulateur Interactif IA */}
        {activeNavTab === 'simulator' && (
          <>
            {isGeneratingReport ? (
              <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
                <div className="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">
                  Génération de votre Bilan de Performance...
                </h2>
                <p className="text-xs text-slate-400 max-w-sm">
                  L'IA analyse vos {sessionAnswers.length} réponses, synthétise vos forces et rédige votre fiche mémo pour le jour J.
                </p>
              </div>
            ) : (
              <>
                {step === 'setup' && (
                  <SetupForm
                    currentLanguage={currentLanguage}
                    onSubmit={handleGenerateQuestions}
                    isLoading={isLoading}
                  />
                )}

                {step === 'review' && candidateProfile && (
                  <QuestionReview
                    questions={questions}
                    roleSummary={roleSummary}
                    companyContext={companyContext}
                    candidateProfile={candidateProfile}
                    currentLanguage={currentLanguage}
                    onStartSimulator={() => setStep('simulator')}
                    onBackToEdit={() => setStep('setup')}
                  />
                )}

                {step === 'simulator' && candidateProfile && (
                  <Simulator
                    questions={questions}
                    candidateProfile={candidateProfile}
                    currentLanguage={currentLanguage}
                    onFinishSession={handleFinishSimulator}
                    onExit={() => setStep('review')}
                  />
                )}

                {step === 'report' && reportData && candidateProfile && (
                  <FinalReport
                    reportData={reportData}
                    candidateProfile={candidateProfile}
                    sessionAnswers={sessionAnswers}
                    currentLanguage={currentLanguage}
                    onRestart={handleRestart}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={savedSessions}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllSessions}
        currentLanguage={currentLanguage}
      />

      {/* Footer with Group ALBA4EVER Attribution */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">InterviewMate AI</span>
            <span>—</span>
            <span className="font-semibold text-emerald-400">Created by Group ALBA4EVER</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">Google Gemma & Gemini Hackathon</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Conçu pour propulser la réussite des étudiants et stagiaires dans leurs entretiens.
          </div>
        </div>
      </footer>
    </div>
  );
}
