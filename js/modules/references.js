import { cvData } from '../state.js';
import { renderCV } from '../render.js';
import { t } from '../i18n.js';

let editIndex = -1;

export function referencesForm() {
  const s = t(cvData.language);
  return `
    <h2>${s.referencesHeading}</h2>
    <input id="ref-name" placeholder="${s.namePlaceholder || 'Nom'}" />
    <input id="ref-contact" placeholder="Contact (tél, email)" />
    <input id="ref-note" placeholder="Note (relation, poste)" />
    <button id="ref-add">${s.add}</button>

    <div id="ref-list"></div>
  `;
}

function renderRefList() {
  const list = document.getElementById('ref-list');
  if (!list) return;
  list.innerHTML = (cvData.references || []).map((r, idx) => `
    <div class="ref-item">
      <strong>${r.name}</strong>
      <p>${r.contact}</p>
      <p>${r.note}</p>
      <div class="ref-actions">
        <button data-edit-ref="${idx}">${t(cvData.language).edit}</button>
        <button data-remove-ref="${idx}">${t(cvData.language).remove}</button>
      </div>
    </div>
  `).join('');
}

export function bindReferencesEvents() {
  const addBtn = document.getElementById('ref-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = document.getElementById('ref-name').value.trim();
      const contact = document.getElementById('ref-contact').value.trim();
      const note = document.getElementById('ref-note').value.trim();
      if (!name || !contact) return;
      if (editIndex >= 0) {
        cvData.references[editIndex] = { name, contact, note };
        editIndex = -1;
        addBtn.textContent = t(cvData.language).add;
      } else {
        cvData.references.push({ name, contact, note });
      }
      renderCV();
      renderRefList();
      ['ref-name','ref-contact','ref-note'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    });
  }

  document.getElementById('form-area').addEventListener('click', e => {
    const rem = e.target.closest('button[data-remove-ref]');
    if (rem) {
      const idx = Number(rem.dataset.removeRef);
      cvData.references.splice(idx, 1);
      if (editIndex === idx) { editIndex = -1; const addBtn = document.getElementById('ref-add'); if (addBtn) addBtn.textContent = t(cvData.language).add; }
      renderCV();
      renderRefList();
      return;
    }

    const edt = e.target.closest('button[data-edit-ref]');
    if (edt) {
      const idx = Number(edt.dataset.editRef);
      const item = cvData.references[idx];
      if (!item) return;
      editIndex = idx;
      document.getElementById('ref-name').value = item.name || '';
      document.getElementById('ref-contact').value = item.contact || '';
      document.getElementById('ref-note').value = item.note || '';
      const addBtn = document.getElementById('ref-add'); if (addBtn) addBtn.textContent = t(cvData.language).edit;
      return;
    }
  });

  renderRefList();
}