// =====================================================
// REFERÊNCIAS CLÍNICAS — ECOCARDIOGRAFIA
// Base inicial: ASE / EACVI (ajustável)
// Unidades em milímetros (mm), salvo indicação contrária
// =====================================================

export const referenciasClinicas = {
  aorta_raiz: {
    label: "Aorta (Raiz)",
    unidade: "mm",
    M: { min: 29, max: 37 },
    F: { min: 27, max: 33 }
  },

  atrio_esquerdo: {
    label: "Átrio Esquerdo",
    unidade: "mm",
    M: { min: 30, max: 40 },
    F: { min: 27, max: 38 }
  },

  vd_basal: {
    label: "Diâmetro basal do VD",
    unidade: "mm",
    M: { min: 25, max: 41 },
    F: { min: 25, max: 41 }
  },

  ddve: {
    label: "Diâmetro Diastólico Final do VE",
    unidade: "mm",
    M: { min: 42, max: 59 },
    F: { min: 39, max: 53 }
  },

  dsve: {
    label: "Diâmetro Sistólico Final do VE",
    unidade: "mm",
    M: { min: 25, max: 40 },
    F: { min: 22, max: 35 }
  },

  septo: {
    label: "Espessura Diastólica do Septo",
    unidade: "mm",
    M: { min: 6, max: 10 },
    F: { min: 6, max: 9 }
  },

  paredePosterior: {
    label: "Parede Posterior do VE",
    unidade: "mm",
    M: { min: 6, max: 10 },
    F: { min: 6, max: 9 }
  },

  volume_ae_abs: {
    label: "Volume A.E. Absoluto",
    M: { min: 62, max: 150 },
    F: { min: 46, max: 106 }
  },
  volume_ad_abs: {
    label: "Volume A.D. Absoluto",
    M: { min: 62, max: 150 },
    F: { min: 46, max: 106 }
  },
  volume_ae_indexado: {
    label: "Volume A.E. Indexado",
    M: { min: 0, max: 48 },
    F: { min: 0, max: 48 }
  },
  volume_ad_indexado: {
    label: "Volume A.D. Indexado",
    M: { min: 1, max: 17 },
    F: { min: 0, max: 19 }
  },
};
  
