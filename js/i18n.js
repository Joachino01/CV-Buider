export const translations = {
    fr: {
        profile: 'Profil professionnel',
        experience: 'Expériences professionnelles',
        education: 'Formation',
        skills: 'Compétences'
    },
    en: {
        profile: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills'
    }
};

export const strings = {
  fr: {
    contact: 'CONTACT',
    namePlaceholder: 'Nom complet',
    titlePlaceholder: 'Titre professionnel',
    emailPlaceholder: 'Email',
    phonePlaceholder: 'Téléphone',
    addressPlaceholder: 'Adresse',
    linkedinPlaceholder: 'Profil LinkedIn (URL)',
    websitePlaceholder: 'Site web (URL)',
    photoLabel: 'Photo (facultatif)',
    marital: 'Situation matrimoniale',
    maritalOptions: {
      single: 'Célibataire',
      married: 'Marié(e)',
      divorced: 'Divorcé(e)',
      widowed: 'Veuf/Veuve',
      partnered: 'Pacsé'
    },
    present: 'Présent',
    profile: 'PROFIL',
    skills: 'COMPÉTENCES',
    languages: 'LANGUES',
    aptitudes: 'APTITUDES',
    summaryHeading: 'PROFIL',
    experienceHeading: 'EXPÉRIENCE',
    educationHeading: 'EDUCATION',
    referencesHeading: 'RÉFÉRENCES',
    add: 'Ajouter',
    remove: 'Supprimer',
    export: 'Exporter PDF'
  },
  en: {
    contact: 'CONTACT',
    namePlaceholder: 'Full name',
    titlePlaceholder: 'Job title',
    emailPlaceholder: 'Email',
    phonePlaceholder: 'Phone',
    addressPlaceholder: 'Address',
    linkedinPlaceholder: 'LinkedIn profile (URL)',
    websitePlaceholder: 'Website (URL)',
    photoLabel: 'Photo (optional)',
    marital: 'Marital status',
    maritalOptions: {
      single: 'Single',
      married: 'Married',
      divorced: 'Divorced',
      widowed: 'Widowed',
      partnered: 'Partnered'
    },
    present: 'Present',
    profile: 'PROFILE',
    skills: 'SKILLS',
    languages: 'LANGUAGES',
    aptitudes: 'APTITUDES',
    summaryHeading: 'SUMMARY',
    experienceHeading: 'EXPERIENCE',
    educationHeading: 'EDUCATION',
    referencesHeading: 'REFERENCES',
    add: 'Add',
    remove: 'Remove',
    export: 'Export PDF'
  }
};

export function setLanguage(lang) {
    cvData.language = lang;
    renderCV();
}

export function t(lang) { return strings[lang] || strings.fr; }