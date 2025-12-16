import { cvData } from '../state.js';
import { renderCV } from '../render.js';

export function referencesForm() {
  return `
    <h2>Références</h2>
    <input id="ref-name" placeholder="Nom" />
    <input id="ref-contact" placeholder="Contact (tél, email)" />
    <input id="ref-note" placeholder="Note (relation, poste)" />
    <button id="ref-add">Ajouter</button>

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
      <button data-remove-ref="${idx}">Supprimer</button>
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
      cvData.references.push({ name, contact, note });
      renderCV();
      renderRefList();
      ['ref-name','ref-contact','ref-note'].forEach(id => document.getElementById(id).value = '');
    });
  }

  document.getElementById('form-area').addEventListener('click', e => {
    const rem = e.target.closest('button[data-remove-ref]');
    if (!rem) return;
    const idx = Number(rem.dataset.removeRef);
    cvData.references.splice(idx, 1);
    renderCV();
    renderRefList();
  });

  renderRefList();
}