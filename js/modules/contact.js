import { cvData } from '../state.js';
import { renderCV } from '../render.js';
import { t } from '../i18n.js';

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
