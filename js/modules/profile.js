import { cvData } from '../state.js';
import { renderCV } from '../render.js';
import { t } from '../i18n.js';

// Formulaire Profil: résumé + compétences (une par ligne) + langues
export function profileForm() {
  const s = t(cvData.language);
  return `
    <h2>${s.profile}</h2>
    <textarea id="summary" placeholder="${s.summaryHeading}">${cvData.profile.summary || ''}</textarea>
    <label>${s.skills}</label>
    <textarea id="skills" placeholder="Ex: JavaScript\nGestion de projet">${(cvData.profile.skills || []).join('\n')}</textarea>
    <label>${s.languages}</label>
    <textarea id="languages" placeholder="Ex: Français\nAnglais">${(cvData.profile.languages || []).join('\n')}</textarea>
  `;
}

export function bindProfileEvents() {
  const summary = document.getElementById('summary');
  const skills = document.getElementById('skills');
  const languages = document.getElementById('languages');

  if (summary) summary.addEventListener('input', e => {
    cvData.profile.summary = e.target.value;
    renderCV();
  });
  if (skills) skills.addEventListener('input', e => {
    cvData.profile.skills = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
    renderCV();
  });
  if (languages) languages.addEventListener('input', e => {
    cvData.profile.languages = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
    renderCV();
  });
}
