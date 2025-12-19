import { cvData } from '../state.js';
import { renderCV } from '../render.js';
import { t } from '../i18n.js';
let editIndex = -1;
export function educationForm() {
  const s = t(cvData.language);
  return `
    <h2>${s.educationHeading}</h2>
    <input id="edu-degree" placeholder="Diplôme (ex: BTS)" />
    <input id="edu-school" placeholder="Établissement" />
    <label>Début</label>
    <input id="edu-start" type="date" />
    <label>Fin</label>
    <input id="edu-end" type="date" />
    <label><input id="edu-present" type="checkbox" /> ${s.present}</label>
    <textarea id="edu-desc" placeholder="Description / détails"></textarea>
    <button id="edu-add">${s.add}</button>

    <h3>Enregistré</h3>
    <div id="edu-list"></div>
  `;
}

function renderEduList() {
  const list = document.getElementById('edu-list');
  if (!list) return;
  list.innerHTML = (cvData.education || []).map((ed, idx) => `
    <div class="edu-item">
      <strong>${ed.degree}</strong> — ${ed.school}
      <div class="dates">${ed.start || ''} — ${ed.end || ''}</div>
      <p>${ed.desc || ''}</p>
      <div class="edu-actions">
        <button data-edit-edu="${idx}">${t(cvData.language).edit}</button>
        <button data-remove-edu="${idx}">${t(cvData.language).remove}</button>
      </div>
    </div>
  `).join('');
}

export function bindEducationEvents() {
  const addBtn = document.getElementById('edu-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const degree = document.getElementById('edu-degree').value.trim();
      const school = document.getElementById('edu-school').value.trim();
      const start = document.getElementById('edu-start').value;
      const presentChecked = document.getElementById('edu-present').checked;
      const end = presentChecked ? 'present' : document.getElementById('edu-end').value;
      const desc = document.getElementById('edu-desc').value.trim();
      if (!degree || !school || !start) return;
      if (editIndex >= 0) {
        cvData.education[editIndex] = { degree, school, start, end, desc };
        editIndex = -1;
        addBtn.textContent = t(cvData.language).add;
      } else {
        cvData.education.push({ degree, school, start, end, desc });
      }
      renderCV();
      renderEduList();
      ['edu-degree','edu-school','edu-start','edu-end','edu-desc'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      document.getElementById('edu-present').checked = false;
    });
  }

  const presentChk = document.getElementById('edu-present');
  const endInput = document.getElementById('edu-end');
  if (presentChk && endInput) {
    presentChk.addEventListener('change', e => {
      endInput.disabled = e.target.checked;
      if (e.target.checked) endInput.value = '';
    });
  }

  document.getElementById('form-area').addEventListener('click', e => {
    const rem = e.target.closest('button[data-remove-edu]');
    if (rem) {
      const idx = Number(rem.dataset.removeEdu);
      cvData.education.splice(idx, 1);
      if (editIndex === idx) { editIndex = -1; const addBtn = document.getElementById('edu-add'); if (addBtn) addBtn.textContent = t(cvData.language).add; }
      renderCV();
      renderEduList();
      return;
    }

    const edt = e.target.closest('button[data-edit-edu]');
    if (edt) {
      const idx = Number(edt.dataset.editEdu);
      const item = cvData.education[idx];
      if (!item) return;
      editIndex = idx;
      document.getElementById('edu-degree').value = item.degree || '';
      document.getElementById('edu-school').value = item.school || '';
      document.getElementById('edu-start').value = item.start || '';
      const present = item.end === 'present';
      document.getElementById('edu-present').checked = present;
      const endInput = document.getElementById('edu-end');
      if (endInput) { endInput.disabled = present; endInput.value = present ? '' : (item.end || ''); }
      document.getElementById('edu-desc').value = item.desc || '';
      const addBtn = document.getElementById('edu-add'); if (addBtn) addBtn.textContent = t(cvData.language).edit;
      return;
    }
  });

  renderEduList();
}