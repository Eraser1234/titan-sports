document.addEventListener('DOMContentLoaded', () => {
  const s = DB.getSettings();
  const whatsUrl = `https://wa.me/${s.whatsapp}`;

  // --- Hero ---
  document.getElementById('heroBadge').textContent = s.heroBadge;

  // Preserva a marcação <span class="highlight"> no título
  const titleEl = document.getElementById('heroTitle');
  if (titleEl) {
    const words = s.heroTitle.split(' ');
    const lastWord = words.pop();
    titleEl.innerHTML = words.join(' ') + (words.length ? ' ' : '') +
      `<span class="highlight">${lastWord}</span>`;
  }

  const subtitleEl = document.getElementById('heroSubtitle');
  if (subtitleEl) subtitleEl.textContent = s.heroSubtitle;

  const heroWhats = document.getElementById('heroWhats');
  if (heroWhats) heroWhats.href = whatsUrl;

  const contactWhats = document.getElementById('contactWhats');
  if (contactWhats) contactWhats.href = whatsUrl;

  // --- Estatísticas ---
  const stats = [
    { numId: 'stat1Num', lblId: 'stat1Lbl', data: s.stat1 },
    { numId: 'stat2Num', lblId: 'stat2Lbl', data: s.stat2 },
    { numId: 'stat3Num', lblId: 'stat3Lbl', data: s.stat3 }
  ];
  stats.forEach(({ numId, lblId, data }) => {
    const numEl = document.getElementById(numId);
    const lblEl = document.getElementById(lblId);
    if (numEl) numEl.textContent = data.num;
    if (lblEl) lblEl.textContent = data.lbl;
  });

  // --- Produtos em destaque ---
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    const featured = DB.getProducts().filter(p => p.destaque).slice(0, 4);
    featuredGrid.innerHTML = featured.length
      ? featured.map(cardHTML).join('')
      : '<p style="color:#555;text-align:center;grid-column:1/-1">Nenhum produto em destaque.</p>';
  }

  // --- Benefícios ---
  const BENEFIT_ICONS = [
    /* 0 — estrela / qualidade */
    `<svg viewBox="0 0 24 24" fill="none" width="30" height="30">
      <polygon class="bsvg-path" points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        stroke="#cc0000" stroke-width="1.8" stroke-linejoin="round" fill="rgba(204,0,0,.12)"/>
    </svg>`,
    /* 1 — raio / velocidade */
    `<svg viewBox="0 0 24 24" fill="none" width="30" height="30">
      <path class="bsvg-path" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke="#cc0000" stroke-width="1.8" stroke-linejoin="round" fill="rgba(204,0,0,.12)"/>
    </svg>`,
    /* 2 — escudo com check / produtos testados */
    `<svg viewBox="0 0 24 24" fill="none" width="30" height="30">
      <path class="bsvg-path" d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2z"
        stroke="#cc0000" stroke-width="1.8" stroke-linejoin="round" fill="rgba(204,0,0,.12)"/>
      <path class="bsvg-check" d="M9 12l2 2 4-4"
        stroke="#cc0000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    /* 3 — headset / suporte */
    `<svg viewBox="0 0 24 24" fill="none" width="30" height="30">
      <path class="bsvg-path" d="M3 11.5a9 9 0 1 1 18 0" stroke="#cc0000" stroke-width="1.8" stroke-linecap="round"/>
      <rect class="bsvg-path" x="2" y="11" width="4" height="7" rx="1" stroke="#cc0000" stroke-width="1.8" fill="rgba(204,0,0,.12)"/>
      <rect class="bsvg-path" x="18" y="11" width="4" height="7" rx="1" stroke="#cc0000" stroke-width="1.8" fill="rgba(204,0,0,.12)"/>
      <path class="bsvg-path" d="M22 18v1a2 2 0 0 1-2 2h-3" stroke="#cc0000" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`
  ];

  const benefitsGrid = document.getElementById('benefitsGrid');
  if (benefitsGrid) {
    benefitsGrid.innerHTML = DB.getBenefits().map((b, i) => `
      <div class="benefit">
        <div class="benefit-icon-wrap">
          <div class="benefit-pulse"></div>
          <div class="benefit-icon-box">${BENEFIT_ICONS[i % BENEFIT_ICONS.length]}</div>
        </div>
        <h3>${escHtml(b.titulo)}</h3>
        <p>${escHtml(b.texto)}</p>
      </div>`).join('');
  }

  // --- Depoimentos ---
  const testimonialsGrid = document.getElementById('testimonialsGrid');
  if (testimonialsGrid) {
    testimonialsGrid.innerHTML = DB.getTestimonials().map(t => `
      <div class="testimonial">
        <p>${escHtml(t.texto)}</p>
        <strong>${escHtml(t.nome)}</strong>
        <small>${escHtml(t.cargo)}</small>
      </div>`).join('');
  }
});

function cardHTML(p) {
  const media = p.mediaType === 'video'
    ? `<video src="${p.imagem}" autoplay muted loop playsinline></video>`
    : `<img src="${p.imagem}" alt="${escHtml(p.nome)}" loading="lazy" style="object-fit:${p.imageFit||'cover'}">`;
  return `
    <article class="card">
      ${media}
      <div class="card-body">
        <span class="tag">${escHtml(p.categoria)}</span>
        <h3>${escHtml(p.nome)}</h3>
        <p>${escHtml(p.descricao)}</p>
        <strong>R$ ${p.preco.toFixed(2).replace('.', ',')}</strong>
        <a href="${p.link}" target="_blank" rel="noopener" class="btn btn-primary">Comprar</a>
      </div>
    </article>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
