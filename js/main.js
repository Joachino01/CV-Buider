import { cvData } from './state.js';
import { renderCV } from './render.js';
import { contactForm, bindContactEvents } from './modules/contact.js';
import { profileForm, bindProfileEvents } from './modules/profile.js';
import { experienceForm, bindExperienceEvents } from './modules/experience.js';
import { educationForm, bindEducationEvents } from './modules/education.js';
import { referencesForm, bindReferencesEvents } from './modules/references.js';
import { aptitudesForm, bindAptitudesEvents } from './modules/aptitudes.js';
import { t } from './i18n.js';

const formArea = document.getElementById('form-area');
const nav = document.querySelector('nav');

let currentSection = 'contact'; // garde la section affichée

// Charge une section (injecte le formulaire et attache les écouteurs)
export function loadSection(section = 'contact') {
  currentSection = section; // on garde la section
  // met à jour le bouton actif visuellement
  nav.querySelectorAll('button[data-section]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });

  // injecte le formulaire correspondant et attache les binders
  if (section === 'contact') {
    formArea.innerHTML = contactForm();
    bindContactEvents();
  } else if (section === 'profile') {
    formArea.innerHTML = profileForm();
    bindProfileEvents();
  } else if (section === 'experience') {
    formArea.innerHTML = experienceForm();
    bindExperienceEvents();
  } else if (section === 'education') {
    formArea.innerHTML = educationForm();
    bindEducationEvents();
  } else if (section === 'references') {
    formArea.innerHTML = referencesForm();
    bindReferencesEvents();
  } else if (section === 'aptitudes') {
    formArea.innerHTML = aptitudesForm();
    bindAptitudesEvents();
  }
}

// Export PDF (utilise html2pdf.bundle)
export async function exportPDF() {
  console.log('exportPDF: start');
  const wrapper = document.getElementById('cv-preview');
  if (!wrapper) { console.error('exportPDF: #cv-preview not found'); alert('Aperçu introuvable'); return; }
  const cvEl = wrapper.querySelector('.cv');
  if (!cvEl) { console.error('exportPDF: .cv not found'); alert('CV introuvable'); return; }

  // vérifie présence des libs
  if (typeof html2canvas === 'undefined') { console.error('html2canvas missing'); alert('html2canvas non chargé'); return; }
  const jsPDFCtor = window.jspdf?.jsPDF || window.jsPDF || window.jspdf?.default?.jsPDF;
  if (!jsPDFCtor) { console.error('jsPDF missing'); alert('jsPDF non chargé'); return; }

  const filename = `${(cvData.contact.name || 'cv').replace(/[^\w\- ]+/g,'')}.pdf`;

  // sauvegarde styles
  const prev = { width: cvEl.style.width, padding: cvEl.style.padding, boxShadow: cvEl.style.boxShadow };

  cvEl.style.width = '210mm';
  cvEl.style.padding = '0';
  cvEl.style.boxShadow = 'none';
  cvEl.classList.add('for-pdf');

  try {
    console.log('exportPDF: rendering canvas...');
    const canvas = await html2canvas(cvEl, { scale: 2, useCORS: true, logging: false });
    const fullW = canvas.width;
    const pxPerMM = fullW / 210;
    const pageHpx = Math.round(pxPerMM * 297);
    const pages = Math.ceil(canvas.height / pageHpx);
    console.log(`exportPDF: canvas ${canvas.width}x${canvas.height}px -> ${pages} pages`);

    // couleur et largeur bande
    const leftVar = getComputedStyle(document.documentElement).getPropertyValue('--left-width') || '200px';
    const leftPx = parseFloat(leftVar);
    const leftMM = leftPx / pxPerMM;
    const leftEl = cvEl.querySelector('.left');
    const bg = leftEl ? getComputedStyle(leftEl).backgroundColor : 'rgb(53,95,90)';
    const rgbMatch = bg.match(/(\d+),\s*(\d+),\s*(\d+)/);
    const rgb = rgbMatch ? rgbMatch.slice(1,4).map(Number) : [53,95,90];

    const pdf = new jsPDFCtor('p', 'mm', 'a4');

    for (let i = 0; i < pages; i++) {
      const thisH = (i === pages - 1) ? (canvas.height - i * pageHpx) : pageHpx;
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = fullW;
      pageCanvas.height = thisH;
      const ctx = pageCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, i * pageHpx, fullW, thisH, 0, 0, fullW, thisH);
      const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
      const imgH_mm = thisH / pxPerMM;

      pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
      pdf.rect(0, 0, leftMM, 297, 'F');

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, imgH_mm, undefined, 'FAST');

      if (i < pages - 1) pdf.addPage();
    }

    pdf.save(filename);
    console.log('exportPDF: done');
  } catch (err) {
    console.error('exportPDF error', err);
    alert('Erreur lors de l\'export — regarde la console pour détails.');
  } finally {
    cvEl.classList.remove('for-pdf');
    cvEl.style.width = prev.width;
    cvEl.style.padding = prev.padding;
    cvEl.style.boxShadow = prev.boxShadow;
  }
}

// nouvelle fonction : prévisualisation avant export
export function previewPDF() {
  const el = document.getElementById('cv-preview');
  if (!el) return;
  const cvEl = el.querySelector('.cv');
  if (!cvEl) return;

  let overlay = document.getElementById('pdf-preview-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'pdf-preview-overlay';
    overlay.innerHTML = `
      <div class="pdf-preview-viewport">
        <div class="pdf-preview-page"></div>
        <div class="pdf-preview-toolbar">
          <button id="pdf-export">Exporter</button>
          <button id="pdf-close">Fermer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => { if (e.target === overlay) hidePreview(); });
    overlay.querySelector('#pdf-close').addEventListener('click', hidePreview);
    overlay.querySelector('#pdf-export').addEventListener('click', () => { hidePreview(); exportPDF(); });
  }

  const page = overlay.querySelector('.pdf-preview-page');
  page.innerHTML = '';
  const clone = cvEl.cloneNode(true);
  clone.classList.add('for-pdf');
  // for preview only: fix dimension and remove shadow/padding
  clone.style.width = '210mm';
  clone.style.height = '297mm';
  clone.style.padding = '0';
  clone.style.boxShadow = 'none';
  clone.style.transform = '';
  clone.style.transformOrigin = 'top left';
  page.appendChild(clone);

  // scale to fit the viewport if needed
  requestAnimationFrame(() => {
    const viewport = overlay.querySelector('.pdf-preview-viewport');
    const availW = viewport.clientWidth - 40; // account padding
    const availH = viewport.clientHeight - 40;
    const rect = clone.getBoundingClientRect();
    // cap the preview scale so the page is not shown too large — user-friendly default
    const MAX_PREVIEW_SCALE = 0.78;
    const scale = Math.min(availW / rect.width, availH / rect.height, MAX_PREVIEW_SCALE);
    clone.style.transform = `scale(${scale})`;
  });

  overlay.classList.add('open');
}

export function hidePreview() {
  const overlay = document.getElementById('pdf-preview-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  // small timeout to keep DOM tidy
  setTimeout(() => overlay.querySelector('.pdf-preview-page').innerHTML = '', 200);
}

// bind preview button
const previewBtn = document.getElementById('preview-pdf');
if (previewBtn) previewBtn.addEventListener('click', previewPDF);

// Délégation d'événements sur le <nav> pour changer de section
nav.addEventListener('click', e => {
  const btn = e.target.closest('button[data-section]');
  if (!btn) return;
  loadSection(btn.dataset.section);
});

// changement de langue
const exportBtn = document.getElementById('export-pdf');
function updateLanguage(lang) {
  cvData.language = lang;
  // met à jour le texte du bouton export selon la langue
  const s = t(lang);
  if (exportBtn) exportBtn.textContent = s.export;
  // re-render preview et re-charge le formulaire actif (pour traduire placeholders etc.)
  loadSection(currentSection);
  renderCV();
}
document.getElementById('lang-fr').onclick = () => updateLanguage('fr');
document.getElementById('lang-en').onclick = () => updateLanguage('en');

// bind export button
if (exportBtn) exportBtn.addEventListener('click', exportPDF);

// mobile toolbar
function createMobileToolbar() {
  if (document.getElementById('mobile-toolbar')) return;
  const bar = document.createElement('div');
  bar.id = 'mobile-toolbar';
  bar.className = 'mobile-toolbar';
  bar.innerHTML = `
    <button id="mobile-show-form">Formulaire</button>
    <button id="mobile-show-preview">Aperçu</button>
    <button id="mobile-export">Exporter</button>
  `;
  document.body.appendChild(bar);
  document.body.classList.add('with-mobile-toolbar');

  document.getElementById('mobile-show-form').addEventListener('click', () => {
    document.getElementById('form-area').style.display = 'block';
    document.getElementById('preview-area').style.display = 'none';
  });
  document.getElementById('mobile-show-preview').addEventListener('click', () => {
    document.getElementById('form-area').style.display = 'none';
    document.getElementById('preview-area').style.display = 'block';
  });
  document.getElementById('mobile-export').addEventListener('click', exportPDF);
}

function removeMobileToolbar() {
  const bar = document.getElementById('mobile-toolbar');
  if (bar) bar.remove();
  document.body.classList.remove('with-mobile-toolbar');
}

function updateMobileMode() {
  if (window.innerWidth <= 900) {
    createMobileToolbar();
    document.getElementById('form-area').style.display = 'block';
    document.getElementById('preview-area').style.display = 'none';
  } else {
    removeMobileToolbar();
    document.getElementById('form-area').style.display = '';
    document.getElementById('preview-area').style.display = '';
  }
}

window.addEventListener('resize', updateMobileMode);
updateMobileMode();

// initialisation : charge contact au démarrage et rend l'aperçu
loadSection('contact');
renderCV();
