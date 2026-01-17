
export enum UserRole {
  PUBLIC = 'PUBLIC',
  CONTRIBUTOR = 'CONTRIBUTOR',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export interface TermRecord {
  id: string;
  // Vedette (VE)
  termeFr: string;
  termeNgiem: string;
  // Domaine (DOM)
  domaineFr: string;
  domaineNgiem: string;
  // Sous-domaine (SS DOM)
  sousDomaineFr: string;
  sousDomaineNgiem: string;
  // Définition (DF)
  definitionFr: string;
  definitionNgiem: string;
  // Source (SR)
  sourceFr: string;
  sourceNgiem: string;
  // Synonymes (SYN)
  synonymesFr: string;
  synonymesNgiem: string;
  // Contexte (CTX)
  contexteFr: string;
  contexteNgiem: string;
  // Identifiant (ID)
  idFiche: string;
  
  imageUrl: string;
  auteur: string;
  dateCreation: string;
  statut: 'en_attente' | 'valide' | 'rejete';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isQualified: boolean;
  score: number;
  cauris: number;
  level: number;
  completedStages: number[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  completed: boolean;
  villageName: string;
}
