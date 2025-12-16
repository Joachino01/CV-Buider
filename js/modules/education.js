import { cvData } from '../state.js';
import { renderCV } from '../render.js';

export function educationForm() {
  return `
    <h2>Éducation</h2>
    <input id="edu-degree" placeholder="Diplôme (ex: BTS)" />
    <input id="edu-school" placeholder="Établissement" />
    <input id="edu-start" placeholder="Début (MM/YYYY)" />
    <input id="edu-end" placeholder="Fin (MM/YYYY)" />
    <textarea id="edu-desc" placeholder="Description / détails"></textarea>
    <button id="edu-add">Ajouter</button>

    <h3>Enregistré</h3>
    <div id="edu-list"></div>
  `;
}

function renderEduList() {
  const list = document.getElementById('edu-list');
  if (!list) return;
  list.innerHTML = (cvData.education || []).map((ed, idx) => `
    <div class="edu-item">
      <strong>${ed.degree}</strong> — ${ed.school} <em>${ed.start} — ${ed.end}</em>
      <p>${ed.desc}</p>
      <button data-remove-edu="${idx}">Supprimer</button>
    </div>
  `).join('');
}

export function bindEducationEvents() {
  const addBtn = document.getElementById('edu-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const degree = document.getElementById('edu-degree').value.trim();
      const school = document.getElementById('edu-school').value.trim();
      const start = document.getElementById('edu-start').value.trim();
      const end = document.getElementById('edu-end').value.trim();
      const desc = document.getElementById('edu-desc').value.trim();
      if (!degree || !school) return;
      cvData.education.push({ degree, school, start, end, desc });
      renderCV();
      renderEduList();
      ['edu-degree','edu-school','edu-start','edu-end','edu-desc'].forEach(id => document.getElementById(id).value = '');
    });
  }

  document.getElementById('form-area').addEventListener('click', e => {
    const rem = e.target.closest('button[data-remove-edu]');
    if (!rem) return;
    const idx = Number(rem.dataset.removeEdu);
    cvData.education.splice(idx, 1);
    renderCV();
    renderEduList();
  });

  renderEduList();
}