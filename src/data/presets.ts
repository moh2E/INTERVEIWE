import { CandidateProfile } from '../types/interview';

export interface PresetScenario {
  id: string;
  badge: string;
  title: string;
  description: string;
  profile: CandidateProfile;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'pfe-fullstack',
    badge: 'Stage PFE Tech',
    title: 'Développeur Full Stack (React / Node.js)',
    description: 'Stage de fin d\'études chez une grande ESN (ex: Capgemini, CGI)',
    profile: {
      company: 'Capgemini',
      position: 'Stagiaire PFE Développeur Web Full Stack',
      opportunityType: 'stage_pfe',
      level: 'debutant',
      skills: 'React, TypeScript, Node.js, Express, PostgreSQL, REST APIs, Git, Tailwind CSS',
      language: 'fr',
      questionCount: 8,
    },
  },
  {
    id: 'junior-data',
    badge: 'Data & Finance',
    title: 'Junior Data Analyst & BI',
    description: 'Poste junior dans une banque / institution financière',
    profile: {
      company: 'Banque Centrale Populaire / CIH',
      position: 'Junior Data Analyst & Business Intelligence',
      opportunityType: 'emploi',
      level: 'junior',
      skills: 'Python (Pandas, Numpy), SQL, PowerBI, Data Cleaning, Dashboarding, Statistiques descriptives',
      language: 'fr',
      questionCount: 8,
    },
  },
  {
    id: 'pfe-ai',
    badge: 'IA & Machine Learning',
    title: 'Stage PFE Ingénieur IA & NLP',
    description: 'Projet d\'innovation IA chez une startup ou centre R&D',
    profile: {
      company: 'Innovatech AI Lab',
      position: 'Stagiaire PFE Ingénieur IA & Traitement du Langage',
      opportunityType: 'stage_pfe',
      level: 'debutant',
      skills: 'Python, PyTorch, Hugging Face, LLMs (Gemma, Gemini), RAG, Vector Databases, FastAPI',
      language: 'fr',
      questionCount: 8,
    },
  },
  {
    id: 'mobile-reactnative',
    badge: 'Mobile App',
    title: 'Développeur Mobile Junior (React Native / Flutter)',
    description: 'Alternance ou premier emploi dans une agence digitale',
    profile: {
      company: 'AppStudio Solutions',
      position: 'Développeur Mobile Junior',
      opportunityType: 'alternance',
      level: 'junior',
      skills: 'React Native, Flutter, Redux, State Management, Consommation d\'APIs, UX Mobile',
      language: 'fr',
      questionCount: 8,
    },
  },
  {
    id: 'digital-marketing',
    badge: 'Marketing & Business',
    title: 'Stage Marketing Digital & E-commerce',
    description: 'Stage chez une marque e-commerce ou agence de communication',
    profile: {
      company: 'Jumia / BrandCo',
      position: 'Stagiaire Marketing Digital & Growth',
      opportunityType: 'stage_ete',
      level: 'etudiant',
      skills: 'SEO, Google Analytics, Campagnes Meta Ads, Content Marketing, Réseaux sociaux, Canva',
      language: 'fr',
      questionCount: 8,
    },
  },
];
