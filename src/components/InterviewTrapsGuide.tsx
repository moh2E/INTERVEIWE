import React from 'react';
import {
  ShieldAlert,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { InterviewLanguage } from '../types/interview';

interface InterviewTrapsGuideProps {
  currentLanguage: InterviewLanguage;
  onLaunchSimulator: () => void;
}

export const InterviewTrapsGuide: React.FC<InterviewTrapsGuideProps> = ({
  currentLanguage,
  onLaunchSimulator,
}) => {
  const traps = [
    {
      number: '01',
      question: 'Parlez-moi de vous (Pitch de 2 minutes)',
      trap: 'Réciter son CV de façon chronologique et monotone depuis le baccalauréat.',
      strategy: 'Utilisez la formule Présent - Passé - Futur : qui vous êtes aujourd\'hui, ce que vous avez accompli de pertinent, et pourquoi vous voulez ce poste précis.',
      formula: '1. Statut actuel & Passion tech → 2. Deux projets phares avec résultats → 3. Pourquoi CE stage/poste aujourd\'hui.',
      sampleSnippet: '"Étudiant en dernière année d\'ingénierie logicielle, je me suis spécialisé sur les architectures web React/Node. Dans mes projets, j\'ai notamment conçu une solution de gestion temps réel qui a réduit les temps de réponse de 40%. Ce qui m\'amène chez vous aujourd\'hui, c\'est votre expertise sur les projets cloud à fort trafic..."'
    },
    {
      number: '02',
      question: 'Vous n\'avez pas d\'expérience en entreprise, pourquoi vous choisir ?',
      trap: 'S\'excuser de son manque d\'expérience ou perdre ses moyens.',
      strategy: 'Transformez la jeunesse en atout : vous êtes 100% disponible, motivé, malléable, sans mauvaises habitudes, et formé aux outils les plus récents.',
      formula: 'Reconnaissance honnête → Valorisation de l\'énergie & adaptabilité → Preuve par les projets personnels.',
      sampleSnippet: '"C\'est vrai que je débute ma carrière professionnelle, mais cela signifie que je viens avec une énergie intacte, une immense envie d\'apprendre et aucune mauvaise habitude. Mes projets d\'école ont été gérés en conditions réelles avec Git, Docker et Agile. Vous aurez un collaborateur dévoué et opérationnel dès les premières semaines."'
    },
    {
      number: '03',
      question: 'Quel est votre principal défaut ?',
      trap: 'Donner un faux défaut ("Je suis trop perfectionniste") ou un défaut éliminatoire ("J\'arrive souvent en retard").',
      strategy: 'Donnez un vrai point d\'amélioration technique ou organisationnel, suivi immédiatement du plan d\'action que vous appliquez déjà pour le corriger.',
      formula: 'Vrai défaut non critique + Prise de conscience + Outil ou méthode mise en place.',
      sampleSnippet: '"Au début, j\'avais tendance à vouloir résoudre les bugs seul pendant des heures avant de demander de l\'aide. J\'ai compris que cela ralentissait l\'équipe. Aujourd\'hui, j\'applique la règle des 30 minutes : si je bloque plus d\'une demi-heure après avoir cherché dans la doc, je prépare une question claire et je sollicite un mentor."'
    },
    {
      number: '04',
      question: 'Pourquoi notre entreprise et pas un concurrent ?',
      trap: 'Répondre avec des éloges vagues : "Parce que vous êtes les leaders mondiaux".',
      strategy: 'Citez un fait précis, une actualité récente de l\'entreprise, une techno spécifique qu\'ils utilisent, ou leur programme d\'on-boarding des stagiaires.',
      formula: 'Fait précis sur l\'entreprise + Lien avec votre projet professionnel.',
      sampleSnippet: '"J\'ai suivi votre récent déploiement sur l\'architecture microservices pour le secteur bancaire. Chez Capgemini / OCP, la rigueur méthodologique et les formations certifiantes offertes aux stagiaires PFE font exactement écho à ce que je recherche pour mon tremplin professionnel."'
    },
    {
      number: '05',
      question: 'Racontez-moi un échec ou un conflit dans un projet d\'école',
      trap: 'Rejeter la faute sur les membres de son binôme ("Mes camarades ne travaillaient pas").',
      strategy: 'Assumez votre part de responsabilité collective, montrez votre maturité relationnelle et expliquez la leçon positive que vous en avez tirée.',
      formula: 'Situation objective → Action de conciliation → Résultat et leçon retenue.',
      sampleSnippet: '"Lors d\'un hackathon, nous avions deux visions opposées sur le choix de la base de données. Les tensions montaient. J\'ai proposé de faire un benchmark rapide de 2h sur nos deux solutions avec un jeu de test. Les chiffres ont parlé d\'eux-mêmes, nous avons choisi la plus rapide et terminé 2ème du hackathon."'
    },
    {
      number: '06',
      question: 'Avez-vous des questions pour nous ?',
      trap: 'Dire "Non, tout a été très clair, merci !" C\'est un signal de désintérêt.',
      strategy: 'Posez au minimum deux questions stratégiques montrant que vous vous projetez déjà dans le poste.',
      formula: 'Question sur les défis des 3 premiers mois + Question sur l\'on-boarding ou l\'équipe.',
      sampleSnippet: '"Oui ! Quels seront les plus gros défis techniques confiés au stagiaire/collaborateur retenu durant ses trois premiers mois ? Et comment décririez-vous la dynamique quotidienne au sein de votre équipe projet ?"'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Guide de Survie & Stratégie Recrutement Étudiants</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
          Les Questions Pièges des Entretiens Étudiants
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Décryptage des questions pièges les plus fréquentes posées aux stagiaires PFE et jeunes diplômés, avec la méthode exacte pour marquer des points.
        </p>
      </div>

      {/* Traps Grid */}
      <div className="space-y-6 mb-12">
        {traps.map((item) => (
          <div
            key={item.number}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-850">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  {item.number}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {item.question}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Le Piège */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Le piège classique à éviter</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {item.trap}
                </p>
              </div>

              {/* La Stratégie */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1.5">
                  <Lightbulb className="w-4 h-4 shrink-0" />
                  <span>La stratégie gagnante</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {item.strategy}
                </p>
              </div>
            </div>

            {/* Réponse Modèle */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exemple concret de réponse percutante (À adapter à votre profil) :</span>
              </div>
              <p className="text-slate-200 italic leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                {item.sampleSnippet}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-emerald-950/80 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 text-center">
        <h3 className="text-lg font-bold text-white mb-2">
          Prêt(e) à mettre en pratique ces conseils ?
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6">
          Lancez une simulation avec notre IA qui testera votre capacité à répondre à ces questions en temps réel.
        </p>
        <button
          onClick={onLaunchSimulator}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98 cursor-pointer"
        >
          <span>Lancer un entraînement personnalisé</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
