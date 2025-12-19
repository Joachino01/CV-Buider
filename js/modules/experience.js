import { cvData } from '../state.js';
import { renderCV } from '../render.js';
import { t } from '../i18n.js';

let editIndex = -1;

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
      <div class="exp-actions">
        <button data-edit-exp="${idx}">${t(cvData.language).edit}</button>
        <button data-remove-exp="${idx}">${t(cvData.language).remove}</button>
      </div>
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
      if (editIndex >= 0) {
        cvData.experiences[editIndex] = { title, company, start, end, desc };
        editIndex = -1;
        addBtn.textContent = t(cvData.language).add;
      } else {
        cvData.experiences.push({ title, company, start, end, desc });
      }
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
    if (rem) {
      const idx = Number(rem.dataset.removeExp);
      cvData.experiences.splice(idx, 1);
      // if we were editing this item, cancel edit
      if (editIndex === idx) {
        editIndex = -1;
        const addBtn = document.getElementById('exp-add'); if (addBtn) addBtn.textContent = t(cvData.language).add;
      }
      renderCV();
      renderExpList();
      return;
    }

    const edt = e.target.closest('button[data-edit-exp]');
    if (edt) {
      const idx = Number(edt.dataset.editExp);
      const item = cvData.experiences[idx];
      if (!item) return;
      editIndex = idx;
      document.getElementById('exp-title').value = item.title || '';
      document.getElementById('exp-company').value = item.company || '';
      document.getElementById('exp-start').value = item.start || '';
      const present = item.end === 'present';
      document.getElementById('exp-present').checked = present;
      const endInput = document.getElementById('exp-end');
      if (endInput) {
        endInput.disabled = present;
        endInput.value = present ? '' : (item.end || '');
      }
      document.getElementById('exp-desc').value = item.desc || '';
      const addBtn = document.getElementById('exp-add'); if (addBtn) addBtn.textContent = t(cvData.language).edit;
      return;
    }
  });

  renderExpList();
}
