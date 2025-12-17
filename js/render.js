import { cvData } from './state.js';
import { t } from './i18n.js';

// petite helper qui retourne des SVG inline (email, phone, map, linkedin, web)
function svgIcon(name) {
  const icons = {
    email: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11zM4.47 6 12 11 19.53 6H4.47z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 10.2a15.05 15.05 0 006.2 6.2l1.9-1.9a1 1 0 01.9-.27c1 .2 2 .3 2.9.3a1 1 0 011 1v3.1a1 1 0 01-1 1A19 19 0 015 4a1 1 0 011-1h3.1a1 1 0 011 1c0 .9.1 1.9.3 2.9a1 1 0 01-.27.9L6.6 10.2z"/></svg>`,
    address: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5A2.5 2.5 0 007.5 6 2.5 2.5 0 005 8.5 2.5 2.5 0 002.5 6 2.5 2.5 0 004.98 3.5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-.9 1.8-1.8 3.7-1.8 4 0 4.7 2.6 4.7 6v7h-4v-6.2c0-1.5 0-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V21H9z"/></svg>`,
    website: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 017.9 7H15v2h4.9A8 8 0 0112 4zm-4 0a8 8 0 00-7.9 7H9V9H4.1A8 8 0 008 4zM4 12a8 8 0 0016 0H15v-2h5a8 8 0 01-16 0H9v2H4z"/></svg>`
  };
  return icons[name] || '';
}

// helper pour formater les dates (input type date => YYYY-MM-DD)
function formatDate(dateStr, lang) {
  const s = t(lang);
  if (!dateStr) return '';
  if (dateStr === 'present') return s.present;
  try {
    // format: Month YYYY (internationalized)
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short' }).format(d);
  } catch (e) {
    return dateStr;
  }
}

// met à jour l'aperçu #cv-preview
export function renderCV() {
  const root = document.getElementById('cv-preview');
  if (!root) return;
  const s = t(cvData.language);
  const c = cvData.contact;
  const p = cvData.profile;
  const esc = v => (v || '').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const hasContact = [c.name, c.title, c.email, c.phone, c.address, c.linkedin, c.website, c.marital].some(Boolean);
  const hasSkills = (p.skills || []).length > 0;
  const hasLanguages = (p.languages || []).length > 0;
  const hasAptitudes = (cvData.aptitudes || []).length > 0;
  const hasSummary = (p.summary || '').trim().length > 0;
  const hasExperiences = (cvData.experiences || []).length > 0;
  const hasEducation = (cvData.education || []).length > 0;
  const hasReferences = (cvData.references || []).length > 0;

  root.innerHTML = `
    <div class="cv">
      <aside class="left">
        ${c.photo ? `<img class="photo" src="${c.photo}" alt="photo" />` : `<div class="photo placeholder"></div>`}

        ${hasContact ? `
        <div class="contact block">
          <h3>${s.contact}</h3>
          ${c.name ? `<p class="name">${esc(c.name)}</p>` : ''}
          ${c.title ? `<p class="title">${esc(c.title)}</p>` : ''}
          ${c.marital ? `<div class="contact-row"><span class="icon"></span><span>${esc(s.maritalOptions[c.marital] || c.marital)}</span></div>` : ''}
          ${c.email ? `<div class="contact-row"><span class="icon">${svgIcon('email')}</span><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>` : ''}
          ${c.phone ? `<div class="contact-row"><span class="icon">${svgIcon('phone')}</span><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></div>` : ''}
          ${c.address ? `<div class="contact-row"><span class="icon">${svgIcon('address')}</span><span>${esc(c.address)}</span></div>` : ''}
          ${c.linkedin ? `<div class="contact-row"><span class="icon">${svgIcon('linkedin')}</span><a href="${esc(c.linkedin)}" target="_blank" rel="noopener">${esc(c.linkedin)}</a></div>` : ''}
          ${c.website ? `<div class="contact-row"><span class="icon">${svgIcon('website')}</span><a href="${esc(c.website)}" target="_blank" rel="noopener">${esc(c.website)}</a></div>` : ''}
        </div>
        ` : ''}

        ${ (p.skills||[]).length ? `<div class="block"><h3>${s.skills}</h3><ul>${(p.skills||[]).map(item => `<li>${esc(item)}</li>`).join('')}</ul></div>` : '' }
        ${ (p.languages||[]).length ? `<div class="block"><h3>${s.languages}</h3><ul>${(p.languages||[]).map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>` : '' }
        ${ (cvData.aptitudes||[]).length ? `<div class="block"><h3>${s.aptitudes}</h3><ul>${(cvData.aptitudes||[]).map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>` : '' }
      </aside>

      <section class="right">
        ${c.name ? `<h1>${esc(c.name)}</h1>` : ''}
        ${c.title ? `<h2>${esc(c.title)}</h2>` : ''}

        ${p.summary ? `<div class="summary block"><h3>${s.summaryHeading}</h3><p>${esc(p.summary)}</p></div>` : ''}

        ${(cvData.experiences || []).length ? `<div class="block"><h3>${s.experienceHeading}</h3>${(cvData.experiences || []).map(exp => `
            <div class="experience">
              <strong>${esc(exp.title)}</strong> — <em>${esc(exp.company)}</em>
              <div class="dates">${formatDate(exp.start, cvData.language)} — ${formatDate(exp.end, cvData.language)}</div>
              <p>${esc(exp.desc)}</p>
            </div>
          `).join('')}</div>` : ''}

        ${(cvData.education || []).length ? `<div class="block"><h3>${s.educationHeading}</h3>${(cvData.education || []).map(ed => `
            <div class="education-item">
              <strong>${esc(ed.degree)}</strong> — <em>${esc(ed.school)}</em>
              <div class="dates">${formatDate(ed.start, cvData.language)} — ${formatDate(ed.end, cvData.language)}</div>
              <p>${esc(ed.desc)}</p>
            </div>
          `).join('')}</div>` : ''}

        ${(cvData.references || []).length ? `<div class="block"><h3>${s.referencesHeading}</h3>${(cvData.references || []).map(r => `
            <div class="ref-item">
              <strong>${esc(r.name)}</strong>
              <p>${esc(r.contact)}</p>
              <p>${esc(r.note)}</p>
            </div>
          `).join('')}</div>` : ''}
      </section>
    </div>
  `;
}
