import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client instance with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// 1. Generate Custom Interview Questions
app.post('/api/interview/generate-questions', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      company = 'Entreprise ciblée',
      position = 'Développeur Junior',
      opportunityType = 'stage_pfe',
      level = 'debutant',
      skills = '',
      language = 'fr',
      cvText = '',
      questionCount = 8,
      recruiterPersona = 'coach',
    } = req.body;

    const personaInstructions = {
      coach: 'Adopte la posture d\'un Recruteur RH Bienveillant et Mentor pédagogique : pose des questions encourageantes mais rigoureuses, adaptées pour mettre en valeur le potentiel d\'un étudiant/jeune diplômé.',
      tech_lead: 'Adopte la posture d\'un Lead Tech Exigeant et Expert Métier : pose des questions techniques précises, interroge sur les choix d\'architecture, la gestion de cas limites (edge-cases), les bugs réels et la qualité du code.',
      corporate_hr: 'Adopte la posture d\'un Recruteur RH Corporate Senior : pose des questions challengeantes sur la motivation, la résistance au stress, la résolution de conflits et les questions pièges classiques.'
    }[recruiterPersona as 'coach' | 'tech_lead' | 'corporate_hr'] || 'Adopte une posture professionnelle et réaliste.';

    const langInstruction =
      language === 'ar'
        ? 'Generate all questions and guidance in Arabic / Darija as appropriate for Moroccan/Arab job seekers, with technical terms in standard French/English as commonly used.'
        : language === 'en'
        ? 'Generate all questions, tips, and descriptions in clear, professional English.'
        : 'Générez toutes les questions, intentions et conseils en français professionnel adapté au marché marocain et francophone.';

    const prompt = `
Tu es un recruteur expert et coach RH pour "InterviewMate AI".
Ton objectif est de préparer un candidat étudiant pour un entretien réaliste et ultra-personnalisé selon son poste et son entreprise.

Posture du recruteur: ${personaInstructions}

Profil du candidat et offre ciblée:
- Entreprise: ${company}
- Poste / Intitulé: ${position}
- Type d'opportunité: ${opportunityType} (ex: stage PFE, stage d'été, alternance, emploi CDI/CDD)
- Niveau du candidat: ${level} (ex: étudiant, débutant, junior, expérimenté)
- Compétences / Technologies mentionnées: ${skills || 'Non spécifié'}
${cvText ? `- Extrait / Résumé du CV du candidat:\n${cvText.slice(0, 2000)}` : ''}

Consignes impératives:
1. ${langInstruction}
2. Adapte rigoureusement la difficulté et la profondeur au niveau "${level}" et au type "${opportunityType}". Ne pose pas de questions d'architecte senior à un débutant en stage PFE, mais pose des questions précises sur les fondamentaux, les projets d'études et la curiosité technique.
3. Génère un total de ${questionCount} questions (réparties équitablement entre les 4 catégories ci-dessous):
   - "motivation": Présentation du candidat, motivation pour l'entreprise "${company}", compréhension de la mission.
   - "technical": Connaissances techniques concrètes directement liées au poste et aux compétences déclarées (${skills}).
   - "projects": Questions précises sur les projets réalisés (défis surmontés, choix techniques, méthode STAR).
   - "behavioral": Situations concrètes, gestion d'imprévus, esprit d'équipe, curiosité d'apprentissage.
4. Précise que ces questions sont des simulations préparatoires réalistes.

Réponds UNIQUEMENT sous forme d'un JSON valide respectant cette structure exacte:
{
  "roleSummary": "Brève synthèse personnalisée du profil et de l'enjeu de l'entretien (2 phrases)",
  "companyContext": "Remarque sur l'entreprise ou le secteur pour bien se préparer",
  "questions": [
    {
      "id": "q1",
      "category": "motivation" | "technical" | "projects" | "behavioral",
      "categoryLabel": "Catégorie en clair (ex: Motivation & Parcours, Compétences Techniques, Projets Réalisés, Comportemental & Soft Skills)",
      "question": "Le libellé exact de la question comme le recruteur la poserait",
      "intent": "Pourquoi le recruteur pose cette question et ce qu'il cherche à évaluer",
      "difficulty": "facile" | "moyen" | "avancé",
      "sampleAnswerTip": "Conseil clé pour structurer sa réponse (ex: méthode STAR, structurer en 3 points)",
      "expectedKeywords": ["mot1", "mot2", "mot3"]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonOutput(response.text || '{}');
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    res.status(500).json({
      success: false,
      error: error?.message || "Erreur lors de la génération des questions d'entretien",
    });
  }
});

// 2. Evaluate Candidate's Answer with constructive feedback & model answer
app.post('/api/interview/evaluate-answer', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      question,
      category,
      userResponse,
      candidateProfile,
      language = 'fr',
    } = req.body;

    if (!userResponse || userResponse.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Réponse vide.' });
      return;
    }

    const langInstruction =
      language === 'ar'
        ? 'Provide constructive feedback, model answer, and advice in friendly Moroccan Arabic / standard Arabic.'
        : language === 'en'
        ? 'Provide constructive feedback, model answer, and advice in encouraging professional English.'
        : 'Fournis le feedback, la réponse modèle et les conseils en français bienveillant et professionnel.';

    const prompt = `
Tu es un recruteur expert et mentor bienveillant pour la plateforme InterviewMate AI.
Un candidat s'entraîne pour son entretien et vient de répondre à une question.

Contexte du candidat:
- Poste ciblé: ${candidateProfile?.position || 'Développeur'} chez ${candidateProfile?.company || 'Entreprise'}
- Niveau: ${candidateProfile?.level || 'Junior'} (${candidateProfile?.opportunityType || 'Stage'})
- Compétences: ${candidateProfile?.skills || 'Non spécifié'}

Question posée:
"${question?.question || 'Question'}"
Catégorie: ${category || 'Général'}
Intention du recruteur: ${question?.intent || ''}

Réponse du candidat:
"${userResponse}"

Consignes pour l'évaluation:
1. ${langInstruction}
2. Évalue avec bienveillance mais rigueur pédagogique.
3. Attribue une note globale sur 100 et des notes partielles (Clarté, Pertinence par rapport au poste, Profondeur & Méthode STAR, Confiance / Impact).
4. Relève 2 à 3 points forts concrets dans sa réponse.
5. Indique 2 à 3 axes d'amélioration précis (ce qui manquait, formulation plus impactante, chiffres/exemples à ajouter).
6. Rédige une réponse modèle idéale ("modelAnswer") adaptée à son profil réel, concise, structurée (idéalement méthode STAR pour les questions de projets/comportement) pour l'inspirer.
7. Un message d'encouragement motivant.

Réponds UNIQUEMENT en JSON valide:
{
  "score": 85,
  "criteriaScores": {
    "clarity": 85,
    "relevance": 90,
    "depthAndSTAR": 75,
    "confidence": 80
  },
  "strengths": [
    "Point fort 1...",
    "Point fort 2..."
  ],
  "improvements": [
    "Axe d'amélioration 1...",
    "Axe d'amélioration 2..."
  ],
  "modelAnswer": "Exemple concret de réponse percutante et naturelle que le candidat peut utiliser comme inspiration...",
  "encouragement": "Message chaleureux d'encouragement..."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonOutput(response.text || '{}');
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({
      success: false,
      error: error?.message || "Erreur lors de l'évaluation de la réponse",
    });
  }
});

// 2b. AI Answer Re-writer (STAR Method optimization)
app.post('/api/interview/rewrite-answer', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rawAnswer, question, candidateProfile, language = 'fr' } = req.body;
    if (!rawAnswer || rawAnswer.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Réponse vide' });
      return;
    }

    const langInstruction =
      language === 'ar'
        ? 'Rewrite in confident Arabic / Moroccan Darija with clear phrasing.'
        : language === 'en'
        ? 'Rewrite in confident, impactful professional English.'
        : 'Réécris en français professionnel, fluide et percutant.';

    const prompt = `
Tu es un coach d'entretien d'embauche de haut niveau.
Un étudiant a rédigé ce premier jet de réponse pour la question suivante :
"${question?.question || 'Question'}"

Poste visé: ${candidateProfile?.position || 'Stagiaire'} chez ${candidateProfile?.company || 'Entreprise'}

Réponse brute de l'étudiant :
"""
${rawAnswer}
"""

Consignes:
1. ${langInstruction}
2. Conserve rigoureusement les faits réels, technologies et projets mentionnés par l'étudiant. N'invente pas d'expériences mensongères.
3. Structure la réponse selon la méthode S.T.A.R (Situation, Tâche, Action personnelle concrète, Résultat/Impact).
4. Élimine les tics de langage, hésitations, et phrases passives.
5. Sois direct, dynamique et valorisant.

Réponds UNIQUEMENT en JSON :
{
  "optimizedAnswer": "Le texte optimisé et percutant que le candidat peut prononcer...",
  "starBreakdown": {
    "situation": "Bref rappel du contexte...",
    "task": "L'objectif précis...",
    "action": "Ce que le candidat a personnellement fait...",
    "result": "Le résultat mesurable ou la leçon tirée..."
  },
  "coachTip": "Le conseil clé sur la posture pour cette question"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonOutput(response.text || '{}');
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error rewriting answer:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Erreur lors de la réécriture de la réponse',
    });
  }
});

// 3. Generate Final Comprehensive Session Report
app.post('/api/interview/generate-final-report', async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateProfile, answersAndEvaluations, language = 'fr' } = req.body;

    const langInstruction =
      language === 'ar'
        ? 'Generate the final report and interview cheat-sheet in clear Arabic/Darija with standard terminology.'
        : language === 'en'
        ? 'Generate the final report and interview day cheat-sheet in professional, empowering English.'
        : 'Génère le bilan global et la fiche mémo pour le jour J en français motivant et professionnel.';

    const prompt = `
Tu es le Lead Coach RH de InterviewMate AI.
Le candidat a terminé sa simulation d'entretien complète.

Profil:
- Entreprise: ${candidateProfile?.company}
- Poste: ${candidateProfile?.position} (${candidateProfile?.opportunityType})
- Niveau: ${candidateProfile?.level}

Historique des questions et évaluations de la session:
${JSON.stringify(answersAndEvaluations, null, 2)}

Consignes:
1. ${langInstruction}
2. Calcule un bilan d'ensemble cohérent avec les notes obtenues.
3. Évalue les 4 piliers: Motivation, Technique, Projets, et Soft Skills / Comportemental (0-100 pour chacun).
4. Formule une fiche mémo personnalisée ("interviewDayCheatSheet") avec 4 à 5 conseils exclusifs pour son entretien réel chez ${candidateProfile?.company || 'cette entreprise'} (notamment 2 excellentes questions intelligentes que le candidat pourra poser au recruteur à la fin de l'entretien !).

Réponds UNIQUEMENT en JSON valide:
{
  "overallScore": 84,
  "verdict": "Prêt(e) à briller pour l'entretien !" | "Très bonne préparation" | "Bonne dynamique, quelques ajustements",
  "summaryAnalysis": "Synthèse globale de la prestation en 3 phrases mettant en valeur son potentiel.",
  "categoryPerformance": {
    "motivation": 85,
    "technical": 80,
    "projects": 78,
    "behavioral": 90
  },
  "topStrengths": [
    "Force 1 observée lors de l'entretien...",
    "Force 2..."
  ],
  "priorityAreasToRevise": [
    "Point clé à réviser avant le jour J...",
    "Conseil pratique..."
  ],
  "interviewDayCheatSheet": [
    "Conseil pour les 5 premières minutes...",
    "Question pertinente à poser au recruteur chez ${candidateProfile?.company}: '...'",
    "Deuxième question à poser: '...'",
    "Rappel sur la posture et la communication..."
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonOutput(response.text || '{}');
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating final report:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Erreur lors de la génération du rapport final',
    });
  }
});

// 4. Parse CV text to extract profile and autofill configuration
app.post('/api/interview/parse-cv', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cvText, language = 'fr' } = req.body;
    if (!cvText || cvText.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Texte de CV manquant' });
      return;
    }

    const prompt = `
Tu es un expert RH tech. Analyse cet extrait ou contenu de CV et extrait les informations clés pour préremplir un simulateur d'entretien.

Contenu du CV:
"""
${cvText.slice(0, 4000)}
"""

Extrais les champs suivants en JSON strict:
{
  "suggestedPosition": "Intitulé du poste le plus adapté (ex: Développeur Full Stack, Data Analyst, Ingénieur DevOps)",
  "suggestedLevel": "etudiant" | "debutant" | "junior" | "experimente",
  "suggestedOpportunityType": "stage_pfe" | "stage_ete" | "alternance" | "emploi",
  "extractedSkills": "Liste des technologies et compétences clés séparées par des virgules (ex: React, Node.js, Python, Git)",
  "notableProjects": ["Projet 1 avec techno", "Projet 2 avec techno"],
  "briefSummary": "Résumé en 1-2 phrases du profil du candidat"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = cleanJsonOutput(response.text || '{}');
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error parsing CV:', error);
    res.status(500).json({
      success: false,
      error: error?.message || "Erreur lors de l'analyse du CV",
    });
  }
});

// Vite Middleware for Development or Static serving in Production
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn('Production build dist folder not found.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`InterviewMate AI server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
