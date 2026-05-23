// Atualizado automaticamente pelo bot de preços
const DATA_VERSION = '';

const DB = {
  KEY_SETTINGS:     'tita_settings',
  KEY_PRODUCTS:     'tita_products',
  KEY_TESTIMONIALS: 'tita_testimonials',
  KEY_BENEFITS:     'tita_benefits',

  defaultSettings: {
    whatsapp:    '5547984434584',
    heroTitle:   'SUPERE SEUS LIMITES',
    heroSubtitle:'Equipamentos de alta performance para guerreiros de verdade.',
    heroBadge:   'Equipamentos Profissionais',
    stat1: { num: '500+', lbl: 'Clientes Satisfeitos' },
    stat2: { num: '50+',  lbl: 'Produtos' },
    stat3: { num: '5★',   lbl: 'Avaliação' },
    adminUser: 'borrachamma@gmail.com',
    adminPass: 'Borracha123!'
  },

  defaultProducts: [
    {
      id: 1,
      nome: 'Luva de Boxe Maximum Branca',
      categoria: 'Luvas',
      descricao: 'Conforto e precisão para deixar seu boxe mais afiado. Couro sintético de alta durabilidade.',
      preco: 296.90,
      imagem: 'https://via.placeholder.com/400x300/1a1a1a/ff6b00?text=Luva+Branca',
      link: 'https://meli.la/12rwqoL',
      destaque: true
    },
    {
      id: 2,
      nome: 'Luva Maximum MXM Red',
      categoria: 'Luvas',
      descricao: 'Conforto e precisão para boxe e muay thai. Design ergonômico e enchimento premium.',
      preco: 280.99,
      imagem: 'https://via.placeholder.com/400x300/1a1a1a/ff6b00?text=Luva+Red',
      link: 'https://meli.la/1fffP5g',
      destaque: true
    },
    {
      id: 3,
      nome: 'Bandagem Elástica 5m',
      categoria: 'Acessórios',
      descricao: 'Proteção extra para punhos e articulações. Elástica, respirável e lavável.',
      preco: 39.90,
      imagem: 'https://via.placeholder.com/400x300/1a1a1a/ff6b00?text=Bandagem',
      link: 'https://meli.la/bandagem',
      destaque: false
    },
    {
      id: 4,
      nome: 'Caneleira MMA Pro',
      categoria: 'Proteções',
      descricao: 'Caneleira profissional para treinos de MMA e Muay Thai. Velcro duplo ajustável.',
      preco: 129.90,
      imagem: 'https://via.placeholder.com/400x300/1a1a1a/ff6b00?text=Caneleira',
      link: 'https://meli.la/caneleira',
      destaque: true
    }
  ],

  defaultTestimonials: [
    {
      id: 1,
      nome: 'Carlos Silva',
      cargo: 'Lutador de MMA',
      texto: 'Equipamentos de primeira qualidade! As luvas são incríveis, uso em todos os meus treinos e competições.'
    },
    {
      id: 2,
      nome: 'Amanda Costa',
      cargo: 'Praticante de Muay Thai',
      texto: 'Atendimento excelente e entrega super rápida. Os produtos superaram minhas expectativas!'
    },
    {
      id: 3,
      nome: 'Rafael Mendes',
      cargo: 'Instrutor de Boxe',
      texto: 'Recomendo para todos os meus alunos. Durabilidade e custo-benefício imbatíveis.'
    }
  ],

  defaultBenefits: [
    {
      id: 1,
      icone: '⭐',
      titulo: 'Qualidade Premium',
      texto: 'Materiais de alta durabilidade rigorosamente testados por atletas profissionais.'
    },
    {
      id: 2,
      icone: '🚚',
      titulo: 'Entrega Rápida',
      texto: 'Enviamos para todo o Brasil com rastreamento em tempo real.'
    },
    {
      id: 3,
      icone: '✅',
      titulo: 'Produtos Testados',
      texto: 'Cada produto passa por rigorosos testes antes de chegar até você.'
    },
    {
      id: 4,
      icone: '💬',
      titulo: 'Suporte Dedicado',
      texto: 'Atendimento humanizado e personalizado via WhatsApp.'
    }
  ],

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
  getProducts() {
    if (DATA_VERSION) {
      const savedVer = localStorage.getItem('tita_version');
      if (savedVer !== DATA_VERSION) {
        localStorage.removeItem(this.KEY_PRODUCTS);
        localStorage.setItem('tita_version', DATA_VERSION);
        return this.defaultProducts;
      }
    }
    return this.get(this.KEY_PRODUCTS, this.defaultProducts);
  },
  getTestimonials() { return this.get(this.KEY_TESTIMONIALS, this.defaultTestimonials); },
  getBenefits()     { return this.get(this.KEY_BENEFITS,     this.defaultBenefits);     },

  saveSettings(v)     { this.set(this.KEY_SETTINGS,     v); },
  saveProducts(v)     { this.set(this.KEY_PRODUCTS,     v); },
  saveTestimonials(v) { this.set(this.KEY_TESTIMONIALS, v); },
  saveBenefits(v)     { this.set(this.KEY_BENEFITS,     v); }
};
