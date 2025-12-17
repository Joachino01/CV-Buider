import { cvData } from '../state.js';
import { renderCV } from '../render.js';
import { t } from '../i18n.js';

export function experienceForm() {
  const s = t(cvData.language);
  return `
    <h2>${s.experienceHeading}</h2>
    <input id="exp-title" placeholder="Titre (ex: Ingénieur)" />
    <input id="exp-company" placeholder="Entreprise" />
    <label>Début</label>
    <input id="exp-start" type="date" />
    <label>Fin</label>
    <input id="exp-end" type="date" />
    <label><input id="exp-present" type="checkbox" /> ${s.present}</label>
    <textarea id="exp-desc" placeholder="Description"></textarea>
    <button id="exp-add">${s.add}</button>

    <h3>Enregistré</h3>
    <div id="exp-list"></div>
  `;
}

function renderExpList() {
  const list = document.getElementById('exp-list');
  if (!list) return;
  list.innerHTML = (cvData.experiences || []).map((ed, idx) => `
    <div class="exp-item">
      <strong>${ed.title}</strong> — ${ed.company}
      <div class="dates">${ed.start || ''} — ${ed.end || ''}</div>
      <p>${ed.desc || ''}</p>
      <button data-remove-exp="${idx}">${t(cvData.language).remove}</button>
    </div>
  `).join('');
}

export function bindExperienceEvents() {
  const addBtn = document.getElementById('exp-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const title = document.getElementById('exp-title').value.trim();
      const company = document.getElementById('exp-company').value.trim();
      const start = document.getElementById('exp-start').value;
      const presentChecked = document.getElementById('exp-present').checked;
      const end = presentChecked ? 'present' : document.getElementById('exp-end').value;
      const desc = document.getElementById('exp-desc').value.trim();
      if (!title || !company || !start) return;
      cvData.experiences.push({ title, company, start, end, desc });
      renderCV();
      renderExpList();
      ['exp-title','exp-company','exp-start','exp-end','exp-desc'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      document.getElementById('exp-present').checked = false;
    });
  }

  // disable/enable end date when present is checked
  const presentChk = document.getElementById('exp-present');
  const endInput = document.getElementById('exp-end');
  if (presentChk && endInput) {
    presentChk.addEventListener('change', e => {
      endInput.disabled = e.target.checked;
      if (e.target.checked) endInput.value = '';
    });
  }

  document.getElementById('form-area').addEventListener('click', e => {
    const rem = e.target.closest('button[data-remove-exp]');
    if (!rem) return;
    const idx = Number(rem.dataset.removeExp);
    cvData.experiences.splice(idx, 1);
    renderCV();
    renderExpList();
  });

  renderExpList();
}
