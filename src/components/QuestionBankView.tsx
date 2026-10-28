import React, { useState } from 'react';
import {
  Search,
  Filter,
  Play,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  BookOpen,
  ArrowRight,
  Briefcase,
  Copy,
  Check,
} from 'lucide-react';
import { STUDENT_QUESTION_BANK, BankQuestion } from '../data/studentQuestionBank';
import { InterviewLanguage } from '../types/interview';

interface QuestionBankViewProps {
  currentLanguage: InterviewLanguage;
  onPracticeQuestion: (question: BankQuestion) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  currentLanguage,
  onPracticeQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const domains = [
    { id: 'all', label: 'Toutes les spécialités' },
    { id: 'software', label: 'Dev Web & Mobile' },
    { id: 'data', label: 'Data Science & IA' },
    { id: 'devops', label: 'Cloud & DevOps' },
    { id: 'industry', label: 'Génie Industriel & OCP' },
    { id: 'finance', label: 'Finance & Banques' },
  ];

  const filteredQuestions = STUDENT_QUESTION_BANK.filter((q) => {
    const matchesDomain = selectedDomain === 'all' || q.domain === selectedDomain;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.companyTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.keyAdvice.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleCopyQuestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Banque Officielle de Questions Types pour Étudiants</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
          Trouvez les Questions Posées selon Votre Poste
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Questions réelles d'entretiens (Capgemini, OCP, Banques, Startups) avec les pièges des recruteurs et les réponses modèles STAR.
        </p>
      </div>

      {/* Search and Domain Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un poste, une techno (React, Python, 5S...), ou une entreprise..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {domains.map((dom) => (
            <button
              key={dom.id}
              onClick={() => setSelectedDomain(dom.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedDomain === dom.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {dom.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
        <span>{filteredQuestions.length} questions sélectionnées pour votre profil</span>
        <span className="text-[11px] text-slate-500">Mises à jour pour les sessions de recrutement 2026</span>
      </div>

      {/* Questions Cards List */}
      <div className="space-y-5 mb-10">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            Aucune question trouvée pour cette recherche. Essayez d'autres mots-clés.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-slate-700 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md text-[11px]">
                    {q.role}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-[11px]">{q.companyTarget}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-[11px]">{q.stageType}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyQuestion(q.id, q.question)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-950 border border-slate-800 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    title="Copier la question"
                  >
                    {copiedId === q.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onPracticeQuestion(q)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>S'entraîner</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base font-bold text-white mb-4 leading-snug">
                "{q.question}"
              </h3>

              {/* Grid: Recruiter trap & Advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Le piège du recruteur :</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {q.recruiterTrap}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>Conseil pour réussir :</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {q.keyAdvice}
                  </p>
                </div>
              </div>

              {/* Model STAR Answer */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Réponse modèle recommandée (Méthode S.T.A.R) :</span>
                </div>
                <p className="text-slate-300 italic leading-relaxed text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                  "{q.modelAnswer}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
