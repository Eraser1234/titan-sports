// Auth guard
if (sessionStorage.getItem('tita_logged') !== '1') {
  location.href = 'admin.html';
}

// Logout
document.getElementById('logout').addEventListener('click', e => {
  e.preventDefault();
  sessionStorage.removeItem('tita_logged');
  location.href = 'admin.html';
});

// ---- Tab switching ----
document.querySelectorAll('[data-tab]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    document.getElementById('tab-' + link.dataset.tab).classList.add('active');
  });
});

// ---- Escape HTML helper ----
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ================================================================
// PRODUTOS
// ================================================================
function renderProducts() {
  const list = DB.getProducts();
  document.getElementById('tblProducts').innerHTML = `
    <tr>
      <th>Imagem</th><th>Nome</th><th>Categoria</th>
      <th>Preço</th><th>Destaque</th><th>Ações</th>
    </tr>
    ${list.map(p => `
      <tr>
        <td><img src="${esc(p.imagem)}" width="60" height="45" style="object-fit:cover;border-radius:6px"></td>
        <td>${esc(p.nome)}</td>
        <td>${esc(p.categoria)}</td>
        <td>R$ ${p.preco.toFixed(2).replace('.', ',')}</td>
        <td style="font-size:18px">${p.destaque ? '✅' : '—'}</td>
        <td>
          <button onclick="openProduct(${p.id})" title="Editar">✏️</button>
          <button onclick="delProduct(${p.id})" title="Excluir">🗑️</button>
        </td>
      </tr>`).join('')}`;
}

function openProduct(id) {
  const list = DB.getProducts();
  const p = id
    ? list.find(x => x.id === id)
    : { nome: '', categoria: '', descricao: '', preco: 0, imagem: '', link: '', destaque: false, mediaType: 'image' };

  document.getElementById('modalTitle').textContent = id ? 'Editar Produto' : 'Novo Produto';
  document.getElementById('modalForm').innerHTML = `
    <label>Nome
      <input name="nome" value="${esc(p.nome)}" required placeholder="Ex: Luva de Boxe Pro">
    </label>
    <label>Categoria
      <input name="categoria" value="${esc(p.categoria)}" placeholder="Ex: Luvas">
    </label>
    <label>Descrição
      <textarea name="descricao" placeholder="Descreva o produto...">${esc(p.descricao)}</textarea>
    </label>
    <label>Preço (R$)
      <input type="number" step="0.01" min="0" name="preco" value="${p.preco}" placeholder="0.00">
    </label>

    <label style="gap:6px">Imagem / Vídeo do Produto
      <div class="media-tabs">
        <button type="button" class="media-tab active" data-panel="url">🔗 URL externa</button>
        <button type="button" class="media-tab" data-panel="upload">📁 Upload de arquivo</button>
      </div>
      <div id="panelUrl" class="media-panel">
        <input name="imagem" id="imagemUrl" value="${esc(p.mediaType === 'image' && !p.imagem.startsWith('data:') ? p.imagem : '')}" placeholder="https://exemplo.com/foto.jpg">
      </div>
      <div id="panelUpload" class="media-panel" style="display:none">
        <div class="upload-area" id="uploadArea">
          <input type="file" id="fileUpload" accept="image/*,video/mp4,video/webm,video/quicktime">
          <p id="uploadPrompt">
            📁 Clique aqui ou arraste o arquivo<br>
            <small>Imagem (JPG, PNG, WebP) ou vídeo curto (MP4, WebM) · máx. 8 MB</small>
          </p>
        </div>
        <div id="uploadPreview"></div>
      </div>
    </label>

    <input type="hidden" name="mediaBase64" id="mediaBase64" value="">
    <input type="hidden" name="mediaType" id="mediaType" value="${esc(p.mediaType || 'image')}">

    <label>Link de Compra
      <input name="link" value="${esc(p.link)}" placeholder="https://meli.la/...">
    </label>
    <label>
      <input type="checkbox" name="destaque" ${p.destaque ? 'checked' : ''}> Exibir em destaque na página inicial
    </label>
    <div class="modal-actions">
      <button type="button" onclick="closeModal()">Cancelar</button>
      <button type="submit" class="btn-primary">Salvar</button>
    </div>`;

  document.getElementById('modalForm').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const base64 = fd.get('mediaBase64');
    const obj = {
      id:        id || Date.now(),
      nome:      fd.get('nome').trim(),
      categoria: fd.get('categoria').trim(),
      descricao: fd.get('descricao').trim(),
      preco:     parseFloat(fd.get('preco')) || 0,
      imagem:    base64 || fd.get('imagem').trim(),
      link:      fd.get('link').trim(),
      destaque:  fd.get('destaque') === 'on',
      mediaType: fd.get('mediaType') || 'image'
    };
    const arr = DB.getProducts();
    if (id) {
      const i = arr.findIndex(x => x.id === id);
      arr[i] = obj;
    } else {
      arr.push(obj);
    }
    DB.saveProducts(arr);
    closeModal();
    renderProducts();
  };

  showModal();
  setupMediaUpload(p);
}

function delProduct(id) {
  if (!confirm('Excluir este produto?')) return;
  DB.saveProducts(DB.getProducts().filter(p => p.id !== id));
  renderProducts();
}

// ================================================================
// DEPOIMENTOS
// ================================================================
function renderTesti() {
  const list = DB.getTestimonials();
  document.getElementById('tblTesti').innerHTML = `
    <tr>
      <th>Nome</th><th>Cargo</th><th>Depoimento</th><th>Ações</th>
    </tr>
    ${list.map(t => `
      <tr>
        <td>${esc(t.nome)}</td>
        <td>${esc(t.cargo)}</td>
        <td>${esc(t.texto).substring(0, 70)}${t.texto.length > 70 ? '…' : ''}</td>
        <td>
          <button onclick="openTesti(${t.id})" title="Editar">✏️</button>
          <button onclick="delTesti(${t.id})" title="Excluir">🗑️</button>
        </td>
      </tr>`).join('')}`;
}

function openTesti(id) {
  const list = DB.getTestimonials();
  const t = id ? list.find(x => x.id === id) : { nome: '', cargo: '', texto: '' };

  document.getElementById('modalTitle').textContent = id ? 'Editar Depoimento' : 'Novo Depoimento';
  document.getElementById('modalForm').innerHTML = `
    <label>Nome
      <input name="nome" value="${esc(t.nome)}" required placeholder="Nome do cliente">
    </label>
    <label>Cargo / Modalidade
      <input name="cargo" value="${esc(t.cargo)}" placeholder="Ex: Lutador de MMA">
    </label>
    <label>Depoimento
      <textarea name="texto" required placeholder="O que o cliente disse...">${esc(t.texto)}</textarea>
    </label>
    <div class="modal-actions">
      <button type="button" onclick="closeModal()">Cancelar</button>
      <button type="submit" class="btn-primary">Salvar</button>
    </div>`;

  document.getElementById('modalForm').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const obj = {
      id:    id || Date.now(),
      nome:  fd.get('nome').trim(),
      cargo: fd.get('cargo').trim(),
      texto: fd.get('texto').trim()
    };
    const arr = DB.getTestimonials();
    if (id) { const i = arr.findIndex(x => x.id === id); arr[i] = obj; }
    else arr.push(obj);
    DB.saveTestimonials(arr);
    closeModal();
    renderTesti();
  };
  showModal();
}

function delTesti(id) {
  if (!confirm('Excluir este depoimento?')) return;
  DB.saveTestimonials(DB.getTestimonials().filter(t => t.id !== id));
  renderTesti();
}

// ================================================================
// BENEFÍCIOS
// ================================================================
function renderBenef() {
  const list = DB.getBenefits();
  document.getElementById('tblBenef').innerHTML = `
    <tr>
      <th>Ícone</th><th>Título</th><th>Texto</th><th>Ações</th>
    </tr>
    ${list.map(b => `
      <tr>
        <td style="font-size:24px">${b.icone}</td>
        <td>${esc(b.titulo)}</td>
        <td>${esc(b.texto)}</td>
        <td>
          <button onclick="openBenef(${b.id})" title="Editar">✏️</button>
          <button onclick="delBenef(${b.id})" title="Excluir">🗑️</button>
        </td>
      </tr>`).join('')}`;
}

function openBenef(id) {
  const list = DB.getBenefits();
  const b = id ? list.find(x => x.id === id) : { icone: '', titulo: '', texto: '' };

  document.getElementById('modalTitle').textContent = id ? 'Editar Benefício' : 'Novo Benefício';
  document.getElementById('modalForm').innerHTML = `
    <label>Emoji / Ícone
      <input name="icone" value="${esc(b.icone)}" placeholder="Ex: 🚚" maxlength="4">
    </label>
    <label>Título
      <input name="titulo" value="${esc(b.titulo)}" required placeholder="Ex: Entrega Rápida">
    </label>
    <label>Texto
      <textarea name="texto" placeholder="Descrição do benefício...">${esc(b.texto)}</textarea>
    </label>
    <div class="modal-actions">
      <button type="button" onclick="closeModal()">Cancelar</button>
      <button type="submit" class="btn-primary">Salvar</button>
    </div>`;

  document.getElementById('modalForm').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const obj = {
      id:     id || Date.now(),
      icone:  fd.get('icone').trim(),
      titulo: fd.get('titulo').trim(),
      texto:  fd.get('texto').trim()
    };
    const arr = DB.getBenefits();
    if (id) { const i = arr.findIndex(x => x.id === id); arr[i] = obj; }
    else arr.push(obj);
    DB.saveBenefits(arr);
    closeModal();
    renderBenef();
  };
  showModal();
}

function delBenef(id) {
  if (!confirm('Excluir este benefício?')) return;
  DB.saveBenefits(DB.getBenefits().filter(b => b.id !== id));
  renderBenef();
}

// ================================================================
// CONFIGURAÇÕES
// ================================================================
function renderConfig() {
  const s = DB.getSettings();
  document.getElementById('formConfig').innerHTML = `
    <label>WhatsApp (com DDI, sem +)
      <input name="whatsapp" value="${esc(s.whatsapp)}" placeholder="5547999999999">
    </label>
    <label>Badge do Hero
      <input name="heroBadge" value="${esc(s.heroBadge)}" placeholder="Equipamentos Profissionais">
    </label>
    <label>Título do Hero
      <input name="heroTitle" value="${esc(s.heroTitle)}" placeholder="SUPERE SEUS LIMITES">
    </label>
    <label>Subtítulo
      <textarea name="heroSubtitle">${esc(s.heroSubtitle)}</textarea>
    </label>
    <h3>Estatísticas do Hero</h3>
    <label>Stat 1 — Número
      <input name="stat1num" value="${esc(s.stat1.num)}" placeholder="500+">
    </label>
    <label>Stat 1 — Rótulo
      <input name="stat1lbl" value="${esc(s.stat1.lbl)}" placeholder="Clientes Satisfeitos">
    </label>
    <label>Stat 2 — Número
      <input name="stat2num" value="${esc(s.stat2.num)}" placeholder="50+">
    </label>
    <label>Stat 2 — Rótulo
      <input name="stat2lbl" value="${esc(s.stat2.lbl)}" placeholder="Produtos">
    </label>
    <label>Stat 3 — Número
      <input name="stat3num" value="${esc(s.stat3.num)}" placeholder="5★">
    </label>
    <label>Stat 3 — Rótulo
      <input name="stat3lbl" value="${esc(s.stat3.lbl)}" placeholder="Avaliação">
    </label>
    <h3>Acesso ao Painel</h3>
    <label>Usuário Admin
      <input name="adminUser" value="${esc(s.adminUser)}" placeholder="admin">
    </label>
    <label>Senha Admin
      <input type="password" name="adminPass" value="${esc(s.adminPass)}" placeholder="••••••••">
    </label>
    <button type="submit" class="btn btn-primary">Salvar Configurações</button>`;

  document.getElementById('formConfig').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    DB.saveSettings({
      whatsapp:    fd.get('whatsapp').trim(),
      heroBadge:   fd.get('heroBadge').trim(),
      heroTitle:   fd.get('heroTitle').trim(),
      heroSubtitle:fd.get('heroSubtitle').trim(),
      stat1: { num: fd.get('stat1num').trim(), lbl: fd.get('stat1lbl').trim() },
      stat2: { num: fd.get('stat2num').trim(), lbl: fd.get('stat2lbl').trim() },
      stat3: { num: fd.get('stat3num').trim(), lbl: fd.get('stat3lbl').trim() },
      adminUser: fd.get('adminUser').trim(),
      adminPass: fd.get('adminPass')
    });
    showToast('Configurações salvas com sucesso!');
  };
}

// ================================================================
// UPLOAD DE MÍDIA
// ================================================================
function setupMediaUpload(p) {
  const tabs       = document.querySelectorAll('.media-tab');
  const panelUrl   = document.getElementById('panelUrl');
  const panelUp    = document.getElementById('panelUpload');
  const uploadArea = document.getElementById('uploadArea');
  const fileInput  = document.getElementById('fileUpload');
  const preview    = document.getElementById('uploadPreview');
  const b64Input   = document.getElementById('mediaBase64');
  const typeInput  = document.getElementById('mediaType');
  const prompt     = document.getElementById('uploadPrompt');

  // Troca de abas (URL ↔ Upload)
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const panel = tab.dataset.panel;
      panelUrl.style.display = panel === 'url'    ? '' : 'none';
      panelUp.style.display  = panel === 'upload' ? '' : 'none';
    });
  });

  // Se já tem base64 ou vídeo salvo, abre aba de upload automaticamente
  if (p.imagem && (p.imagem.startsWith('data:') || p.mediaType === 'video')) {
    tabs[1].click();
    showExistingPreview(p);
  }

  // Clique na área abre o seletor de arquivo
  uploadArea.addEventListener('click', e => {
    if (e.target !== fileInput) fileInput.click();
  });

  // Drag & drop
  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) processFile(file);
  });

  function processFile(file) {
    const maxBytes = 8 * 1024 * 1024;
    if (file.size > maxBytes) {
      preview.innerHTML = `<p class="upload-warning">⚠️ Arquivo muito grande (${(file.size / 1048576).toFixed(1)} MB). Máximo: 8 MB.</p>`;
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      preview.innerHTML = `<p class="upload-warning">⚠️ Formato não suportado. Use imagens (JPG, PNG, WebP) ou vídeos (MP4, WebM).</p>`;
      return;
    }

    typeInput.value = isVideo ? 'video' : 'image';
    prompt.style.display = 'none';

    if (isImage) {
      // Comprime via canvas (máx 800px, qualidade 82%)
      const img = new Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else       { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const b64 = canvas.toDataURL('image/jpeg', 0.82);
        b64Input.value = b64;
        URL.revokeObjectURL(objUrl);
        preview.innerHTML = `
          <div class="upload-preview">
            <img src="${b64}" alt="Preview">
            <p class="file-info">✅ ${esc(file.name)} · ${(file.size / 1024).toFixed(0)} KB → comprimida para exibição</p>
          </div>`;
      };
      img.src = objUrl;

    } else {
      // Vídeo: lê como base64
      const sizeMB = (file.size / 1048576).toFixed(1);
      preview.innerHTML = `<p class="upload-warning">⏳ Carregando vídeo (${sizeMB} MB)…</p>`;
      const reader = new FileReader();
      reader.onload = ev => {
        const b64 = ev.target.result;
        b64Input.value = b64;
        preview.innerHTML = `
          <div class="upload-preview">
            <video src="${b64}" controls muted playsinline></video>
            <p class="file-info">✅ ${esc(file.name)} · ${sizeMB} MB</p>
            ${file.size > 3 * 1024 * 1024
              ? '<p class="upload-warning">⚠️ Vídeos grandes consomem muito espaço no browser. Para vídeos maiores, prefira usar uma URL externa.</p>'
              : ''}
          </div>`;
      };
      reader.readAsDataURL(file);
    }
  }

  function showExistingPreview(prod) {
    if (!prod.imagem) return;
    b64Input.value = prod.imagem;
    prompt.style.display = 'none';
    if (prod.mediaType === 'video') {
      preview.innerHTML = `
        <div class="upload-preview">
          <video src="${prod.imagem}" controls muted playsinline></video>
          <p class="file-info">Vídeo atual</p>
        </div>`;
    } else {
      preview.innerHTML = `
        <div class="upload-preview">
          <img src="${prod.imagem}" alt="Imagem atual">
          <p class="file-info">Imagem atual (carregada via upload)</p>
        </div>`;
    }
  }
}

// ================================================================
// MODAL helpers
// ================================================================
function showModal() {
  document.getElementById('modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// Fecha o modal clicando no overlay
document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) closeModal();
});

// ================================================================
// TOAST (substitui alert)
// ================================================================
function showToast(msg) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.style.cssText = `
      position:fixed;bottom:28px;right:28px;background:#ff6b00;color:#fff;
      padding:14px 24px;border-radius:10px;font-weight:700;font-size:15px;
      box-shadow:0 6px 24px rgba(0,0,0,.5);z-index:9999;
      transition:opacity .4s;opacity:0;pointer-events:none;`;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ================================================================
// EXPORTAR DATA.JS
// ================================================================
document.getElementById('exportBtn').addEventListener('click', e => {
  e.preventDefault();
  exportData();
});

function exportData() {
  const products     = DB.getProducts();
  const testimonials = DB.getTestimonials();
  const benefits     = DB.getBenefits();
  const settings     = DB.getSettings();

  const hasBase64 = products.some(p => p.imagem && p.imagem.startsWith('data:'));
  if (hasBase64) {
    if (!confirm('Alguns produtos usam imagens em base64 (upload direto), o que deixa o arquivo data.js muito grande.\n\nRecomendado: use URLs externas para imagens antes de exportar.\n\nDeseja exportar mesmo assim?')) return;
  }

  const content =
`const DB = {
  KEY_SETTINGS:     'tita_settings',
  KEY_PRODUCTS:     'tita_products',
  KEY_TESTIMONIALS: 'tita_testimonials',
  KEY_BENEFITS:     'tita_benefits',

  defaultSettings: ${JSON.stringify(settings, null, 2)},

  defaultProducts: ${JSON.stringify(products, null, 2)},

  defaultTestimonials: ${JSON.stringify(testimonials, null, 2)},

  defaultBenefits: ${JSON.stringify(benefits, null, 2)},

  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getSettings()     { return this.get(this.KEY_SETTINGS,     this.defaultSettings);     },
  getProducts()     { return this.get(this.KEY_PRODUCTS,     this.defaultProducts);     },
  getTestimonials() { return this.get(this.KEY_TESTIMONIALS, this.defaultTestimonials); },
  getBenefits()     { return this.get(this.KEY_BENEFITS,     this.defaultBenefits);     },

  saveSettings(v)     { this.set(this.KEY_SETTINGS,     v); },
  saveProducts(v)     { this.set(this.KEY_PRODUCTS,     v); },
  saveTestimonials(v) { this.set(this.KEY_TESTIMONIALS, v); },
  saveBenefits(v)     { this.set(this.KEY_BENEFITS,     v); }
};`;

  const blob = new Blob([content], { type: 'application/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'data.js';
  a.click();
  URL.revokeObjectURL(url);
  showToast('data.js exportado! Substitua o arquivo e re-suba no Netlify.');
}

// ================================================================
// INICIALIZAÇÃO
// ================================================================
renderProducts();
renderTesti();
renderBenef();
renderConfig();
