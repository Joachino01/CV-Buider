// état central du CV — toutes les parties lisent/écrivent ici
export const cvData = {
  language: 'fr',
  contact: {
    name: 'Kossi Gnim ABALO',
    title: 'Title example',
    email: 'jean@example.com',
    phone: '+228 90 00 00 00',
    address: 'Lomé, Togo',
    linkedin: '',
    website: '',
    photo: '',

    marital: ''   // <-- nouvel attribut
  },
  profile: {
    summary: 'Professional summary goes here...',
    skills: ['Skill 1', 'Skill 2'],
    languages: ['Français - natif', 'Anglais - courant']
  },
  experiences: [
    // { title, company, start, end, desc }
  ],

  // Ajouts pour les nouvelles sections
  education: [
    // { degree, school, start, end, desc }
  ],
  references: [
    // { name, contact, note }
  ],
  aptitudes: [
    // 'Travail en équipe', 'Rigueur', ...
  ]
};
