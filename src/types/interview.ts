export type OpportunityType = 'stage_pfe' | 'stage_ete' | 'alternance' | 'emploi' | 'freelance';

export type CandidateLevel = 'etudiant' | 'debutant' | 'junior' | 'experimente';

export type QuestionCategory = 'motivation' | 'technical' | 'projects' | 'behavioral';

export type InterviewLanguage = 'fr' | 'en' | 'ar';

export type RecruiterPersona = 'coach' | 'tech_lead' | 'corporate_hr';

export interface CandidateProfile {
  company: string;
  position: string;
  opportunityType: OpportunityType;
  level: CandidateLevel;
  skills: string;
  language: InterviewLanguage;
  cvText?: string;
  questionCount?: number;
  recruiterPersona?: RecruiterPersona;
}

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  categoryLabel: string;
  question: string;
  intent: string;
  difficulty: 'facile' | 'moyen' | 'avancé';
  sampleAnswerTip: string;
  expectedKeywords: string[];
}

export interface QuestionEvaluation {
  score: number;
  criteriaScores: {
    clarity: number;
    relevance: number;
    depthAndSTAR: number;
    confidence: number;
  };
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  encouragement: string;
}

export interface SessionAnswerRecord {
  questionId: string;
  questionText: string;
  category: QuestionCategory;
  userAnswer: string;
  timeSpentSeconds: number;
  evaluation?: QuestionEvaluation;
}

export interface FinalReportData {
  overallScore: number;
  verdict: string;
  summaryAnalysis: string;
  categoryPerformance: {
    motivation: number;
    technical: number;
    projects: number;
    behavioral: number;
  };
  topStrengths: string[];
  priorityAreasToRevise: string[];
  interviewDayCheatSheet: string[];
}

export interface SavedInterviewSession {
  id: string;
  timestamp: number;
  profile: CandidateProfile;
  questionsCount: number;
  overallScore: number;
  verdict: string;
}
