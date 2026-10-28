import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  Briefcase,
  GraduationCap,
  Layers,
  FileText,
  Wand2,
  CheckCircle2,
  ArrowRight,
  Flame,
  HelpCircle,
  Clock,
  UserCheck,
  Code2,
  BarChart3,
  Cloud,
  Cpu,
  Coins,
  TrendingUp,
} from 'lucide-react';
import {
  CandidateProfile,
  OpportunityType,
  CandidateLevel,
  InterviewLanguage,
  RecruiterPersona,
} from '../types/interview';
import { PRESET_SCENARIOS, PresetScenario } from '../data/presets';
import { TRANSLATIONS } from '../i18n/translations';

interface SetupFormProps {
  currentLanguage: InterviewLanguage;
  onSubmit: (profile: CandidateProfile) => void;
  isLoading: boolean;
}

export const SetupForm: React.FC<SetupFormProps> = ({
  currentLanguage,
  onSubmit,
  isLoading,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const [activeTab, setActiveTab] = useState<'manual' | 'cv'>('manual');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pfe-fullstack');

  // Fields
  const [company, setCompany] = useState('Capgemini');
  const [position, setPosition] = useState('Stagiaire PFE Développeur Web Full Stack');
  const [opportunityType, setOpportunityType] = useState<OpportunityType>('stage_pfe');
  const [level, setLevel] = useState<CandidateLevel>('debutant');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, Express, PostgreSQL, REST APIs, Git, Tailwind CSS');
  const [interviewLanguage, setInterviewLanguage] = useState<InterviewLanguage>(currentLanguage);
  const [questionCount, setQuestionCount] = useState<number>(8);
  const [recruiterPersona, setRecruiterPersona] = useState<RecruiterPersona>('coach');

  // CV parsing
  const [cvText, setCvText] = useState('');
  const [isParsingCv, setIsParsingCv] = useState(false);
  const [cvParsedFeedback, setCvParsedFeedback] = useState<string | null>(null);

  // Student Domains Quick-Select
  const studentDomains = [
    {
      id: 'software',
      icon: Code2,
      label: 'Génie Logiciel & Web',
      defaultRole: 'Stagiaire PFE Développeur Web Full Stack',
      defaultCompany: 'Capgemini / ESN',
      defaultSkills: 'React, Node.js, TypeScript, PostgreSQL, Git, Docker, REST APIs',
    },
    {
      id: 'data',
      icon: BarChart3,
      label: 'Data Science & IA',
      defaultRole: 'Junior Data Analyst & Machine Learning',
      defaultCompany: 'Banque / Institution Financière',
      defaultSkills: 'Python, SQL, Pandas, Scikit-learn, PowerBI, Data Viz, NLP',
    },
    {
      id: 'devops',
      icon: Cloud,
      label: 'Cloud & DevOps',
      defaultRole: 'Stagiaire Ingénieur DevOps / Cloud',
      defaultCompany: 'Orange / DXC Technology',
      defaultSkills: 'Docker, Kubernetes, Linux, CI/CD, AWS/Azure, Terraform, Bash',
    },
    {
      id: 'industry',
      icon: Cpu,
      label: 'Génie Industriel & OCP',
      defaultRole: 'Ingénieur Amélioration Continue & Lean',
      defaultCompany: 'OCP Group / Renault Tanger',
      defaultSkills: 'Lean Manufacturing, 5S, DMAIC, Gestion de production, ERP, Supply Chain',
    },
    {
      id: 'finance',
      icon: Coins,
      label: 'Finance & Banques',
      defaultRole: 'Auditeur Financier Junior / Risques',
      defaultCompany: 'Attijariwafa bank / BCP',
      defaultSkills: 'Analyse financière, BFR, Modélisation Excel, Risque crédit, Comptabilité',
    },
    {
      id: 'marketing',
      icon: TrendingUp,
      label: 'Marketing & Growth',
      defaultRole: 'Stagiaire Growth & Marketing Digital',
      defaultCompany: 'Startup E-commerce',
      defaultSkills: 'SEO, Google Ads, Meta Ads, Google Analytics, Content Marketing, CRM',
    },
  ];

  const handleApplyDomain = (dom: typeof studentDomains[0]) => {
    setPosition(dom.defaultRole);
    setCompany(dom.defaultCompany);
    setSkills(dom.defaultSkills);
  };

  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    setCompany(preset.profile.company);
    setPosition(preset.profile.position);
    setOpportunityType(preset.profile.opportunityType);
    setLevel(preset.profile.level);
    setSkills(preset.profile.skills);
    if (preset.profile.questionCount) {
      setQuestionCount(preset.profile.questionCount);
    }
    setCvParsedFeedback(null);
  };

  const handleParseCv = async () => {
    if (!cvText.trim()) return;
    setIsParsingCv(true);
    setCvParsedFeedback(null);

    try {
      const res = await fetch('/api/interview/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, language: currentLanguage }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const info = data.data;
        if (info.suggestedPosition) setPosition(info.suggestedPosition);
        if (info.suggestedLevel) setLevel(info.suggestedLevel);
        if (info.suggestedOpportunityType) setOpportunityType(info.suggestedOpportunityType);
        if (info.extractedSkills) setSkills(info.extractedSkills);
        setCvParsedFeedback(
          info.briefSummary ||
            'CV analysé avec succès ! Compétences et niveau auto-complétés.'
        );
        setActiveTab('manual');
      }
    } catch (err) {
      console.error(err);
      setCvParsedFeedback('Erreur lors de l’analyse. Vous pouvez compléter manuellement.');
    } finally {
      setIsParsingCv(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      company,
      position,
      opportunityType,
      level,
      skills,
      language: interviewLanguage,
      cvText: cvText.trim() ? cvText : undefined,
      questionCount,
      recruiterPersona,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Header with Group ALBA4EVER Attribution */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Created by Group ALBA4EVER • Moteur IA Gemma & Gemini</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          {currentLanguage === 'ar' ? (
            <>
              حضّر لمقابلة عملك أو تدريبك مع{' '}
              <span className="text-emerald-400">InterviewMate AI</span>
            </>
          ) : currentLanguage === 'en' ? (
            <>
              Ace your internship & job interviews with{' '}
              <span className="text-emerald-400">Personalized AI</span>
            </>
          ) : (
            <>
              Préparez votre entretien sur-mesure selon{' '}
              <span className="text-emerald-400">votre poste exact</span>
            </>
          )}
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          {currentLanguage === 'ar'
            ? 'منصة ذكية صممتها مجموعة ALBA4EVER لمساعدة الطلبة على اجتياز مقابلات الـ Stage PFE والوظائف الأولى بأسئلة دقيقة حسب الشركة والتخصص مع تقييم صوتي وكتابي فوري.'
            : currentLanguage === 'en'
            ? 'Designed by Group ALBA4EVER to help students prepare for internships and jobs with tailored questions, speech feedback, and realistic recruiter personas.'
            : 'Plateforme dédiée aux étudiants et jeunes diplômés : générez des questions ciblées selon votre entreprise (Capgemini, OCP, Banques, Startups) et votre spécialité, puis entraînez-vous face à notre recruteur IA.'}
        </p>
      </div>

      {/* Spécialités Étudiants Quick-Select Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            Choisissez votre spécialité étudiante
          </span>
          <span className="text-[11px] text-slate-500">Auto-remplit le poste et la stack</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {studentDomains.map((dom) => {
            const Icon = dom.icon;
            return (
              <button
                key={dom.id}
                type="button"
                onClick={() => handleApplyDomain(dom)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-left transition-all cursor-pointer group"
              >
                <Icon className="w-4 h-4 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white truncate">{dom.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40">
        {/* Tabs */}
        <div className="flex items-center border-b border-slate-800 pb-4 mb-6 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Paramétrage personnalisé</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cv')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'cv'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Extraire depuis mon CV</span>
          </button>
        </div>

        {/* Tab 2: CV extraction */}
        {activeTab === 'cv' && (
          <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              {t.cvUploadLabel}
            </label>
            <textarea
              rows={4}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder={t.cvUploadPlaceholder}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                L'IA détectera votre niveau, vos projets phares et vos technologies.
              </span>
              <button
                type="button"
                onClick={handleParseCv}
                disabled={isParsingCv || !cvText.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
              >
                {isParsingCv ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    {t.parseCvBtn}
                  </>
                )}
              </button>
            </div>
            {cvParsedFeedback && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{cvParsedFeedback}</span>
              </div>
            )}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Post & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {t.formCompany}
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Capgemini, OCP, Attijariwafa, Startup..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                {t.formPosition}
              </label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Ex: Stagiaire PFE Full Stack, Data Analyst..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Opportunity Type & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                {t.formOppType}
              </label>
              <select
                value={opportunityType}
                onChange={(e) => setOpportunityType(e.target.value as OpportunityType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="stage_pfe">{t.stagePfe}</option>
                <option value="stage_ete">{t.stageEte}</option>
                <option value="alternance">{t.alternance}</option>
                <option value="emploi">{t.emploi}</option>
                <option value="freelance">{t.freelance}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                {t.formLevel}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CandidateLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="etudiant">{t.levelEtudiant}</option>
                <option value="debutant">{t.levelDebutant}</option>
                <option value="junior">{t.levelJunior}</option>
                <option value="experimente">{t.levelExperimente}</option>
              </select>
            </div>
          </div>

          {/* Recruiter Persona Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Posture et Personnalité du Recruteur IA
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'coach',
                  name: 'Coach Mentor Pédagogue',
                  desc: 'Bienveillant, met en valeur vos projets d\'école et votre potentiel.',
                },
                {
                  id: 'tech_lead',
                  name: 'Lead Tech Exigeant',
                  desc: 'Questions techniques ciblées, architecture et cas limites.',
                },
                {
                  id: 'corporate_hr',
                  name: 'Recruteur RH Corporate',
                  desc: 'Questions pièges, résistance au stress et adéquation culturelle.',
                },
              ].map((persona) => {
                const isSelected = recruiterPersona === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setRecruiterPersona(persona.id as RecruiterPersona)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/50 border-indigo-500 text-white shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-white mb-0.5">{persona.name}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{persona.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills & Technologies */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                {t.formSkills}
              </label>
              <span className="text-[11px] text-slate-500">
                Séparez par des virgules pour cibler les questions techniques
              </span>
            </div>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Ex: React, Node.js, SQL, Docker, Résolution de problèmes, Git..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Language & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.formLang}
              </label>
              <select
                value={interviewLanguage}
                onChange={(e) => setInterviewLanguage(e.target.value as InterviewLanguage)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="fr">{t.langFr}</option>
                <option value="en">{t.langEn}</option>
                <option value="ar">{t.langAr}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Nombre de questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[6, 8, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      questionCount === count
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {count} questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white shadow-lg shadow-indigo-500/25 transition-all transform active:scale-99 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.generatingQuestions}</span>
                </>
              ) : (
                <>
                  <span>Générer l'entretien ciblé pour ce poste</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
