import { cvData } from '../state.js';
import { renderCV } from '../render.js';
import { t } from '../i18n.js';

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
      <button data-remove-edu="${idx}">${t(cvData.language).remove}</button>
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
      cvData.education.push({ degree, school, start, end, desc });
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
    if (!rem) return;
    const idx = Number(rem.dataset.removeEdu);
    cvData.education.splice(idx, 1);
    renderCV();
    renderEduList();
  });

  renderEduList();
}