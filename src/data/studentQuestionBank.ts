export interface BankQuestion {
  id: string;
  role: string;
  domain: 'software' | 'data' | 'devops' | 'industry' | 'finance' | 'marketing' | 'embedded';
  domainLabel: string;
  companyTarget: string;
  stageType: string;
  category: 'motivation' | 'technical' | 'projects' | 'behavioral';
  question: string;
  recruiterTrap: string;
  keyAdvice: string;
  modelAnswer: string;
}

export const STUDENT_QUESTION_BANK: BankQuestion[] = [
  // 1. GÉNIE LOGICIEL & DEV WEB
  {
    id: 'sw-1',
    role: 'Développeur Full Stack (React / Node.js)',
    domain: 'software',
    domainLabel: 'Développement Web & Mobile',
    companyTarget: 'Capgemini / ESN / Startups',
    stageType: 'Stage PFE / Junior',
    category: 'motivation',
    question: 'Pourquoi avez-vous choisi d\'effectuer votre PFE chez nous plutôt que dans une startup ou une autre ESN ?',
    recruiterTrap: 'Le piège est de donner une réponse générique ("vous êtes les meilleurs") ou de dire que vous cherchez juste un stage pour valider votre diplôme.',
    keyAdvice: 'Parlez de leurs projets récents, de la méthodologie Agile, et de l\'opportunité d\'avoir un mentor expérimenté pour accélérer votre montée en compétences.',
    modelAnswer: 'J\'ai choisi votre entreprise pour deux raisons précises : d\'abord, la qualité des architectures microservices et React que vous déployez sur des projets à fort trafic. Ensuite, la culture de mentorat : pour mon stage PFE, je cherche un cadre rigoureux où je pourrai confronter mes acquis académiques à des standards industriels de production.'
  },
  {
    id: 'sw-2',
    role: 'Développeur Full Stack (React / Node.js)',
    domain: 'software',
    domainLabel: 'Développement Web & Mobile',
    companyTarget: 'Capgemini / CGI / DXC',
    stageType: 'Stage PFE / Junior',
    category: 'technical',
    question: 'Quelle est la différence fondamentale entre du State local et un State global (Redux, Zustand) en React, et quand choisir l\'un ou l\'autre ?',
    recruiterTrap: 'Vérifier si vous ne sur-complexifiez pas vos applications en mettant tout dans Redux sans justification.',
    keyAdvice: 'Expliquez que le State local (useState) suffit pour les données propres à un composant (ex: ouverture d\'un modal), tandis que le State global s\'impose pour les données partagées par plusieurs branches de l\'arbre (ex: utilisateur connecté, panier, thème).',
    modelAnswer: 'Le State local est encapsulé dans un composant et ne concerne que son cycle de vie. Si la donnée doit être partagée entre des composants sans relation parent-enfant directe (évitant le Prop Drilling), on opte pour un store global comme Redux Toolkit ou Zustand. Dans mon dernier projet, j\'ai gardé les formulaires en local et mis l\'authentification JWT dans le store global.'
  },
  {
    id: 'sw-3',
    role: 'Développeur Web & Mobile',
    domain: 'software',
    domainLabel: 'Développement Web & Mobile',
    companyTarget: 'Toutes entreprises tech',
    stageType: 'Stage / Premier Emploi',
    category: 'projects',
    question: 'Parlez-moi d\'un bug complexe que vous avez rencontré dans un projet d\'école et comment vous l\'avez résolu.',
    recruiterTrap: 'Le recruteur teste votre méthode de raisonnement face à l\'inconnu et votre sang-froid, pas le bug lui-même.',
    keyAdvice: 'Utilisez la méthode STAR : Situation (projet et techno), Tâche (ce qui ne marchait pas), Action (votre démarche d\'investigation : logs, devtools, isolation) et Résultat (le fix et la leçon retenue).',
    modelAnswer: 'Dans mon projet de plateforme e-commerce en React et Node.js, certaines requêtes de commande échouaient de manière aléatoire en production locale. J\'ai analysé les requêtes réseau dans les DevTools et identifié un problème de race condition lors du rafraîchissement asynchrone du token JWT. J\'ai implémenté un intercepteur Axios avec file d\'attente, ce qui a éliminé 100% des erreurs 401.'
  },

  // 2. DATA SCIENCE & IA
  {
    id: 'data-1',
    role: 'Junior Data Analyst / Data Scientist',
    domain: 'data',
    domainLabel: 'Data & Intelligence Artificielle',
    companyTarget: 'Banques / Télécoms / E-commerce',
    stageType: 'Stage PFE / Emploi',
    category: 'technical',
    question: 'Comment gérez-vous un jeu de données avec 30% de valeurs manquantes (NaN) sur une variable clé ?',
    recruiterTrap: 'Le piège est de répondre automatiquement "je supprime les lignes" ou "je remplace par la moyenne" sans analyser la distribution.',
    keyAdvice: 'Montrez une démarche analytique : regarder si les données manquent de manière aléatoire (MCAR) ou biaisée, comparer médiane vs moyenne pour les distributions asymétriques, ou utiliser une imputation par KNN / modèle.',
    modelAnswer: 'Avant toute action, j\'analyse la cause de l\'absence : si la variable est numérique et asymétrique, je privilégie la médiane plutôt que la moyenne pour éviter l\'influence des valeurs extrêmes. Si la variable est fortement corrélée à d\'autres, j\'utilise une imputation par modèle (comme MICE ou KNN). Enfin, si les 30% sont non représentatifs ou corrompus, je documente l\'impact avant toute suppression.'
  },
  {
    id: 'data-2',
    role: 'Data Analyst & BI',
    domain: 'data',
    domainLabel: 'Data & Intelligence Artificielle',
    companyTarget: 'CIH / Attijariwafa / Inwi / Orange',
    stageType: 'Stage PFE / Alternance',
    category: 'behavioral',
    question: 'Comment expliquez-vous les résultats d\'une analyse complexe à un manager métier qui n\'a aucune compétence technique ?',
    recruiterTrap: 'Évaluer vos qualités de vulgarisation et votre capacité à traduire la data en décisions concrètes pour le business.',
    keyAdvice: 'Bannissez le jargon (pas de p-value, overfitting, ou régression logistique brute). Parlez d\'objectifs métier : chiffre d\'affaires, taux d\'attrition client, gains de temps.',
    modelAnswer: 'Je commence toujours par la conclusion opérationnelle : quel est le problème et quel est le gain financier ou stratégique. Ensuite, j\'utilise des visualisations claires (dashboards PowerBI avec 2 ou 3 indicateurs clés) sans formules mathématiques. Je réponds à la question "Qu\'est-ce qu\'on doit faire maintenant ?" plutôt que "Quelle formule j\'ai calculée".'
  },

  // 3. CLOUD, DEVOPS & INFRA
  {
    id: 'devops-1',
    role: 'Ingénieur Cloud & DevOps Junior',
    domain: 'devops',
    domainLabel: 'Cloud, DevOps & Systèmes',
    companyTarget: 'ESN / Infogérance / Grandes Entreprises',
    stageType: 'Stage PFE / Junior',
    category: 'technical',
    question: 'Pourquoi conteneuriser une application avec Docker plutôt que d\'utiliser une machine virtuelle classique ?',
    recruiterTrap: 'Vérifier la compréhension de l\'isolation au niveau noyau (kernel) vs hyperviseur.',
    keyAdvice: 'Soulignez la légèreté (partage du noyau de l\'hôte), le temps de démarrage en quelques millisecondes, et la reproductibilité parfaite entre l\'environnement de dev et de production.',
    modelAnswer: 'Une machine virtuelle virtualise le matériel complet et embarque son propre système d\'exploitation lourd. Docker, lui, partage le noyau de l\'OS hôte via des namespaces et cgroups. Cela rend les conteneurs infiniment plus légers (mégaoctets au lieu de gigaoctets), démarrables en quelques secondes, et garantit l\'adage "ça marchait sur ma machine, donc ça marche en production".'
  },

  // 4. GÉNIE INDUSTRIEL & SUPPLY CHAIN (OCP, Tanger Med, Auto)
  {
    id: 'ind-1',
    role: 'Ingénieur Génie Industriel / Amélioration Continue',
    domain: 'industry',
    domainLabel: 'Génie Industriel & Supply Chain',
    companyTarget: 'OCP Group / Renault Tanger / Stellantis / Tanger Med',
    stageType: 'Stage PFE / Premier Emploi',
    category: 'technical',
    question: 'Quelles étapes appliquez-vous pour mener un chantier 5S ou une démarche DMAIC sur une ligne de production ?',
    recruiterTrap: 'Vérifier si vous connaissez la théorie mais surtout comment vous impliquez les opérateurs sur le terrain.',
    keyAdvice: 'Insistez sur la conduite du changement : le 5S ne se fait pas depuis un bureau mais sur le Gemba (le terrain) avec les techniciens et chefs d\'équipe.',
    modelAnswer: 'Pour un chantier 5S, je passe d\'abord du temps sur le Gemba pour observer les flux avec les opérateurs. J\'applique la démarche méthodique : Seiri (Trier), Seiton (Ranger), Seiso (Nettoyer), Seiketsu (Standardiser) et Shitsuke (Pérenniser). La clé du succès n\'est pas les étiquettes rouges mais l\'adhésion de l\'équipe pour que les standards soient maintenus dans la durée.'
  },
  {
    id: 'ind-2',
    role: 'Supply Chain Coordinator / Gestionnaire de Flux',
    domain: 'industry',
    domainLabel: 'Génie Industriel & Supply Chain',
    companyTarget: 'Groupes Industriels & Logistique',
    stageType: 'Stage PFE / Emploi',
    category: 'behavioral',
    question: 'Un fournisseur stratégique vous annonce un retard de livraison critique qui bloque la ligne. Que faites-vous dans la première heure ?',
    recruiterTrap: 'Tester votre réactivité, votre gestion du stress et votre sens des priorités opérationnelles.',
    keyAdvice: '1. Évaluer le stock tampon (buffer). 2. Informer la production et le planning. 3. Chercher une solution de contournement (livraison partielle en express, fournisseur alternatif).',
    modelAnswer: 'Dans la première demi-heure, j\'évalue l\'impact immédiat : quel est notre stock de sécurité et combien de temps la ligne peut-elle continuer ? Ensuite, j\'alerte le responsable de production en proposant des alternatives (réorganisation du planning sur une autre référence ou livraison expresse par avion/taxi-colis). Enfin, je garde un canal de communication transparent avec le client final.'
  },

  // 5. FINANCE, AUDIT & BANQUES
  {
    id: 'fin-1',
    role: 'Auditeur Financier Junior / Analyste Risques',
    domain: 'finance',
    domainLabel: 'Finance, Audit & Banques',
    companyTarget: 'Attijariwafa / BCP / Bank of Africa / Big 4 (Deloitte, PwC...)',
    stageType: 'Stage PFE / Junior',
    category: 'technical',
    question: 'Comment analysez-vous la santé financière d\'une entreprise à travers son BFR (Besoin en Fonds de Roulement) et sa Trésorerie Nette ?',
    recruiterTrap: 'S\'assurer de la maîtrise de la formule fondamentale : Trésorerie Nette = Fonds de Roulement - BFR.',
    keyAdvice: 'Expliquez l\'équilibre financier : si le BFR augmente plus vite que le chiffre d\'affaires, cela crée une tension sur la trésorerie.',
    modelAnswer: 'Le BFR mesure le décalage de trésorerie entre les décaissements (stocks, créances clients) et les encaissements (dettes fournisseurs). Pour qu\'une entreprise soit saine, son Fonds de Roulement (ressources longues) doit financer son BFR. Une Trésorerie Nette positive signifie que l\'entreprise n\'est pas dépendante de crédits bancaires à court terme pour financer son cycle d\'exploitation.'
  },

  // 6. QUESTIONS PIÈGES TRANSVERSALES (POUR TOUS LES ÉTUDIANTS)
  {
    id: 'trap-1',
    role: 'Tous profils étudiants',
    domain: 'software',
    domainLabel: 'Questions Pièges Transversales',
    companyTarget: 'Tous recruteurs',
    stageType: 'Tous stages & emplois',
    category: 'behavioral',
    question: 'Vous n\'avez pas d\'expérience professionnelle en entreprise sur votre CV. Pourquoi devrions-nous vous choisir vous plutôt qu\'un autre candidat expérimenté ?',
    recruiterTrap: 'Voir si vous perdez confiance ou si vous savez valoriser vos projets académiques et votre motivation d\'apprentissage.',
    keyAdvice: 'Transformez le "manque d\'expérience" en atout : vous n\'avez pas de mauvaises habitudes, vous êtes très adaptable, motivé, et vos projets d\'études ont été menés avec les technos les plus récentes.',
    modelAnswer: 'C\'est vrai que je débute ma carrière, mais cela signifie aussi que je viens avec une motivation totale, une grande curiosité et aucune mauvaise habitude. Durant mes études et projets personnels, j\'ai appris à être autonome, à coder selon les standards modernes et à livrer dans les délais. Vous intégrez quelqu\'un de malléable, enthousiaste et 100% investi pour apporter de la valeur dès les premières semaines.'
  },
  {
    id: 'trap-2',
    role: 'Tous profils étudiants',
    domain: 'software',
    domainLabel: 'Questions Pièges Transversales',
    companyTarget: 'Tous recruteurs',
    stageType: 'Tous stages & emplois',
    category: 'behavioral',
    question: 'Avez-vous une question à nous poser avant de conclure l\'entretien ?',
    recruiterTrap: 'Dire "Non, tout est clair" est éliminatoire ! Cela montre un manque de curiosité ou de projection.',
    keyAdvice: 'Posez TOUJOURS au moins deux questions intelligentes sur les défis techniques de l\'équipe ou la suite du processus.',
    modelAnswer: 'Oui, absolument ! J\'aimerais savoir : quelles sont les priorités techniques ou les plus gros défis qui attendent la personne qui rejoindra votre équipe dans les 3 premiers mois ? Et deuxième question : comment se déroule l\'on-boarding d\'un nouveau stagiaire chez vous ?'
  }
];
