import { cvData } from '../state.js';
import { renderCV } from '../render.js';

// Un formulaire simple pour ajouter une expérience
export function experienceForm() {
  return `
    <h2>Expériences</h2>
    <input id="exp-title" placeholder="Titre (ex: Chef chantier)" />
    <input id="exp-company" placeholder="Entreprise / lieu" />
    <input id="exp-start" placeholder="Début (MM/YYYY)" />
    <input id="exp-end" placeholder="Fin (MM/YYYY ou Present)" />
    <textarea id="exp-desc" placeholder="Description (une ligne)"></textarea>
    <button id="exp-add">Ajouter</button>

    <h3>Expériences enregistrées</h3>
    <div id="exp-list"></div>
  `;
}

function renderExpList() {
  const list = document.getElementById('exp-list');
  if (!list) return;
  list.innerHTML = (cvData.experiences || []).map((exp, idx) => `
    <div class="exp-item">
      <strong>${exp.title}</strong> — ${exp.company} <em>${exp.start} — ${exp.end}</em>
      <p>${exp.desc}</p>
      <button data-remove="${idx}">Supprimer</button>
    </div>
  `).join('');
}

export function bindExperienceEvents() {
  // add
  const addBtn = document.getElementById('exp-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const title = document.getElementById('exp-title').value.trim();
      const company = document.getElementById('exp-company').value.trim();
      const start = document.getElementById('exp-start').value.trim();
      const end = document.getElementById('exp-end').value.trim();
      const desc = document.getElementById('exp-desc').value.trim();
      if (!title || !company) return;
      cvData.experiences.push({ title, company, start, end, desc });
      renderCV();
      renderExpList();
      // clear inputs
      ['exp-title','exp-company','exp-start','exp-end','exp-desc'].forEach(id => document.getElementById(id).value = '');
    });
  }

  // suppression via délégation
  document.getElementById('form-area').addEventListener('click', e => {
    const rem = e.target.closest('button[data-remove]');
    if (!rem) return;
    const idx = Number(rem.dataset.remove);
    cvData.experiences.splice(idx, 1);
    renderCV();
    renderExpList();
  });

  // initial render de la liste
  renderExpList();
}
