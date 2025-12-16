import { cvData } from '../state.js';
import { renderCV } from '../render.js';

export function aptitudesForm() {
  return `
    <h2>Aptitudes</h2>
    <textarea id="apt-input" placeholder="Une par ligne">${(cvData.aptitudes||[]).join('\n')}</textarea>
  `;
}

export function bindAptitudesEvents() {
  const ta = document.getElementById('apt-input');
  if (!ta) return;
  ta.addEventListener('input', e => {
    cvData.aptitudes = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
    renderCV();
  });
}