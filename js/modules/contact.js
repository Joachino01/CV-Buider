import { t } from '../i18n.js';
import { cvData } from '../state.js';
import { renderCV } from '../render.js';

// Retourne le HTML du formulaire Contact (injection dans #form-area)
export function contactForm() {
  const s = t(cvData.language);
  return `
    <h2>${s.contact}</h2>
    <input id="name" placeholder="${s.namePlaceholder}" value="${cvData.contact.name || ''}" />
    <input id="title" placeholder="${s.titlePlaceholder}" value="${cvData.contact.title || ''}" />
    <input id="email" type="email" inputmode="email" placeholder="${s.emailPlaceholder}" value="${cvData.contact.email || ''}" />
    <input id="phone" type="tel" inputmode="tel" placeholder="${s.phonePlaceholder}" value="${cvData.contact.phone || ''}" />
    <input id="address" placeholder="${s.addressPlaceholder}" value="${cvData.contact.address || ''}" />
    <label>${s.marital}</label>
    <select id="marital">
      <option value="">—</option>
      <option value="single" ${cvData.contact.marital === 'single' ? 'selected' : ''}>${s.maritalOptions.single}</option>
      <option value="married" ${cvData.contact.marital === 'married' ? 'selected' : ''}>${s.maritalOptions.married}</option>
      <option value="divorced" ${cvData.contact.marital === 'divorced' ? 'selected' : ''}>${s.maritalOptions.divorced}</option>
      <option value="widowed" ${cvData.contact.marital === 'widowed' ? 'selected' : ''}>${s.maritalOptions.widowed}</option>
      <option value="partnered" ${cvData.contact.marital === 'partnered' ? 'selected' : ''}>${s.maritalOptions.partnered}</option>
    </select>

    <input id="linkedin" placeholder="${s.linkedinPlaceholder}" value="${cvData.contact.linkedin || ''}" />
    <input id="website" placeholder="${s.websitePlaceholder}" value="${cvData.contact.website || ''}" />
    <label>${s.photoLabel}</label>
    <input type="file" id="photo" accept="image/*" />
  `;
}

// Attache des écouteurs aux inputs existants dans le DOM
export function bindContactEvents() {
  ['name', 'title', 'email', 'phone', 'address', 'linkedin', 'website'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', e => {
      cvData.contact[id] = e.target.value; // met à jour l'état
      renderCV(); // met à jour l'aperçu
    });
  });

  const marital = document.getElementById('marital');
  if (marital) {
    marital.addEventListener('change', (e) => {
      cvData.contact.marital = e.target.value;
      renderCV();
    });
  }

  // gestion de l'upload d'image : on lit en DataURL et on stocke dans l'état
  const photoInput = document.getElementById('photo');
  if (photoInput) {
    photoInput.addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        cvData.contact.photo = reader.result; // base64 dataURL
        renderCV();
      };
      reader.readAsDataURL(file);
    });
  }
}
