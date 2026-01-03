// ============================================================
// 🔹 Módulo de Cálculos e Valores de Referência
// ============================================================

// ---- Tabelas de referência ----
export const valoresReferencia = Object.freeze({
  sc: { M: [20, 99], F: [15, 99] },
  aorta: { M: [20, 37], F: [20, 37] },
  atrioEsquerdo: { M: [30, 40], F: [27, 38] },
  diametroBasalVD: { M: [25, 41], F: [25, 41] },
  diametroDiastolicoFinalVE: { M: [42, 58], F: [37, 52] },
  diametroSistolicoFinalVE: { M: [25, 39], F: [21, 35] },
  paredePosteriorVE: { M: [6, 10], F: [6, 9] },
  espessuraDiastolicaSepto: { M: [6, 10], F: [6, 9] },
  espessuraRelativaParedeVE: { M: [0.32, 0.42], F: [0.32, 0.42] },
  fracaoEjecao: { M: [52, 72], F: [54, 74] },
  fracaoEncurtamento: { M: [30, 100], F: [30, 100] },
  indiceMassaVentricularEsquerda: { M: [49, 115], F: [43, 95] },
  massaVentricularEsquerda: { M: [88, 224], F: [67, 162] },
  volumeAEAbsoluto: { M: [62, 150], F: [46, 106] },
  volumeADAbsoluto: { M: [62, 150], F: [46, 106] },
  volumeDiastolicoFinalVE: { M: [62, 150], F: [46, 106] },
  volumeSistolicoFinalVE: { M: [21, 61], F: [14, 42] },
});

// ============================================================
// 🔹 Funções utilitárias
// ============================================================

/**
 * Lê um número de um input HTML, tratando vírgulas e campos vazios.
 * @param {string} id - ID do input.
 * @returns {number} Valor numérico ou NaN.
 */
export function getNumber(id) {
  const el = document.getElementById(id);
  if (!el) return NaN;

  const raw = el.value?.trim().replace(",", ".") ?? "";
  const num = Number(raw);
  return Number.isFinite(num) ? num : NaN;
}

/**
 * Função utilitária para validar se um número é finito e não zero.
 * @param {number} n
 * @returns {boolean}
 */
const isValid = (n) => Number.isFinite(n) && n !== 0;

// ============================================================
// 🔹 Fórmulas principais
// ============================================================

/**
 * Calcula a Superfície Corporal (SC) pela fórmula de Du Bois.
 */
export function calculoSC(peso, altura) {
  if (!isValid(altura) || !isValid(peso)) return NaN;
  return 0.007184 * Math.pow(altura, 0.725) * Math.pow(peso, 0.425);
}

/**
 * Calcula a Fração de Ejeção (FE).
 */
export function fracaoEjecao(volumeDiastolico, volumeSistolico) {
  if (!isValid(volumeDiastolico)) return NaN;
  return ((volumeDiastolico - volumeSistolico) / volumeDiastolico) * 100;
}

/**
 * Calcula a Massa Ventricular Esquerda (MVE) — fórmula de Devereux.
 */
export function massaVentricularEsquerda(septo, parede, diametro) {
  if (![septo, parede, diametro].every(isValid)) return NaN;

  const soma = (septo + parede + diametro) / 10;
  const diam = diametro / 10;
  const volume = Math.pow(soma, 3) - Math.pow(diam, 3);

  return 0.8 * (1.04 * volume) + 0.6;
}

/**
 * Calcula a Fração de Encurtamento (FEc).
 */
export function fracaoEncurtamento(diastolico, sistolico) {
  if (!isValid(diastolico)) return NaN;
  return ((diastolico - sistolico) / diastolico) * 100;
}

/**
 * Fórmula genérica para volume ventricular (método Teichholz).
 * @param {number} diametro
 * @returns {number}
 */
function volumeTeichholz(diametro) {
  if (!isValid(diametro)) return NaN;
  return (7 / (2.4 + diametro)) * Math.pow(diametro, 3);
}

export const volumeDiastolicoFinalVE = volumeTeichholz;
export const volumeSistolicoFinalVE = volumeTeichholz;

/**
 * Calcula volume indexado (AE ou AD) pela SC.
 */
export function calcularVolumeIndexado(volumeAbsoluto, superficieCorporal) {
  if (!isValid(volumeAbsoluto) || !isValid(superficieCorporal)) return NaN;
  return volumeAbsoluto / superficieCorporal;
}

// Aliases semânticos
export const volumeAEIndexado = calcularVolumeIndexado;
export const volumeADIndexado = calcularVolumeIndexado;

// ============================================================
// 🔹 Setup de listeners automáticos (opcional)
// ============================================================

import { atualizarCalculos, atualizarReferencias } from "./dom.js";

/**
 * Configura listeners para atualizar cálculos automaticamente
 * conforme o usuário digita ou muda o sexo.
 */
export function setupCalculos() {
  const inputs = document.querySelectorAll("#paciente input, #medicoes input");
  const radiosSexo = document.querySelectorAll("input[name='sexo']");

  inputs.forEach((input) => input.addEventListener("input", atualizarCalculos));

  radiosSexo.forEach((radio) =>
    radio.addEventListener("change", () => {
      atualizarCalculos();
      atualizarReferencias();
    })
  );

  // Inicializa ao carregar
  atualizarCalculos();
  atualizarReferencias();
}
