// dom.js
import {
  valoresReferencia,
  getNumber,
  calculoSC,
  fracaoEjecao,
  massaVentricularEsquerda,
  fracaoEncurtamento,
  volumeDiastolicoFinalVE,
  volumeSistolicoFinalVE,
  volumeAEIndexado,
  volumeADIndexado,
} from "./calculos.js";

import { isManualAE, isManualAD } from "./eventos.js";

// ============================================================
// Atualiza valores de referência conforme o sexo selecionado
// ============================================================
export function atualizarReferencias() {
  const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
  if (!sexo) return;

  Object.keys(valoresReferencia).forEach((campo) => {
    const ref = valoresReferencia[campo][sexo];
    const small = document.getElementById(`ref-${campo}`);
    if (small) small.textContent = ref ? `Ref: ${ref[0]} - ${ref[1]}` : "";
  });
}

// ============================================================
// Função auxiliar: tenta calcular a SC nas duas ordens possíveis
// ============================================================
function calcularSCAuto(peso, altura) {
  try {
    const sc1 = calculoSC(peso, altura);
    if (Number.isFinite(sc1)) return sc1;
  } catch {}
  try {
    const sc2 = calculoSC(altura, peso);
    if (Number.isFinite(sc2)) return sc2;
  } catch {}
  return NaN;
}

// ============================================================
// Atualiza cálculos automáticos principais
// ============================================================
export function atualizarCalculos() {
  const peso = getNumber("peso");
  const altura = getNumber("altura");
  const ddve = getNumber("diametroDiastolicoFinalVE");
  const dsve = getNumber("diametroSistolicoFinalVE");
  const septo = getNumber("espessuraDiastolicaSepto");
  const parede = getNumber("paredePosteriorVE");
  const vd = getNumber("diametroBasalVD");
  const aeAbs = getNumber("volumeAEAbsoluto");
  const adAbs = getNumber("volumeADAbsoluto");

  const sc = calcularSCAuto(peso, altura);

  const fe = fracaoEjecao(ddve, dsve);
  const massa = massaVentricularEsquerda(septo, parede, ddve);
  const feEnc = fracaoEncurtamento(ddve, dsve);
  const volDiast = volumeDiastolicoFinalVE(ddve);
  const volSist = volumeSistolicoFinalVE(dsve);
  const volAE = volumeAEIndexado(aeAbs, sc);
  const volAD = volumeADIndexado(adAbs, sc);
  const indiceMassa = Number.isFinite(sc) && sc !== 0 ? massa / sc : NaN;
  const espessuraRelativa = ddve ? (2 * parede) / ddve : NaN;

  atualizarCampo("superficieCorporal", sc);
  atualizarCampo("fracaoEjecao", fe, "%");
  atualizarCampo("massaVentricularEsquerda", massa);
  atualizarCampo("indiceMassaVentricularEsquerda", indiceMassa);
  atualizarCampo("espessuraRelativaParedeVE", espessuraRelativa);

  if (!isManualAE()) atualizarCampo("volumeAEIndexado", volAE);
  if (!isManualAD()) atualizarCampo("volumeADIndexado", volAD);

  aplicarCoresReferencia();
}

// ============================================================
// Atualiza um campo (com formatação opcional)
// ============================================================
function atualizarCampo(id, valor, sufixo = "") {
  const el = document.getElementById(id);
  if (!el) return;
  if (!Number.isFinite(valor)) {
    el.value = "";
  } else {
    el.value = valor.toFixed(2) + (sufixo ? ` ${sufixo}` : "");
  }
}

export function aplicarCoresReferencia() {
  // Seleciona o sexo
  const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
  if (!sexo) return; // nada a fazer sem sexo selecionado

  // Seleciona todos os smalls dentro do fieldset de medidas
  const fieldsetMedidas = document.querySelector("#medicoes");
  if (!fieldsetMedidas) return;

  const smalls = fieldsetMedidas.querySelectorAll("small");

  smalls.forEach((small) => {
    const campo = small.id.replace("ref-", "");
    const input = document.getElementById(campo);
    if (!input) return;

    const valor = Number(input.value);
    if (!Number.isFinite(valor)) {
      small.style.color = ""; // reseta se vazio ou inválido
      return;
    }

    // Obtém o intervalo de referência
    const ref = valoresReferencia[campo]?.[sexo];
    if (!ref) return; // pula se não houver referência definida

    const [min, max] = ref;

    // Aplica cor
    if (valor < min || valor > max) {
      small.style.color = "red";
    } else {
      small.style.color = ""; // cor padrão
    }
  });
}

// ============================================================
// Recalcular individualmente AE / AD indexado
// ============================================================
export function recalcularAEIndexado() {
  const peso = getNumber("peso");
  const altura = getNumber("altura");
  const aeAbs = getNumber("volumeAEAbsoluto");
  const sc = calcularSCAuto(peso, altura);
  const volAE = volumeAEIndexado(aeAbs, sc);
  atualizarCampo("volumeAEIndexado", volAE);
}

export function recalcularADIndexado() {
  const peso = getNumber("peso");
  const altura = getNumber("altura");
  const adAbs = getNumber("volumeADAbsoluto");
  const sc = calcularSCAuto(peso, altura);
  const volAD = volumeADIndexado(adAbs, sc);
  atualizarCampo("volumeADIndexado", volAD);
}

// ============================================================
// 🔹 Atualização visual das referências (cores de <small>)
// ============================================================

/**
 * Atualiza a cor e o texto de referência de acordo com o valor digitado.
 * @param {HTMLInputElement} input - Campo de entrada numérica.
 * @param {string} sexo - Sexo do paciente ('M' ou 'F').
 */
export function atualizarReferencia(input, sexo) {
  const id = input.id;
  const small = document.querySelector(`#ref-${id}`);

  if (!small || !valoresReferencia[id] || !sexo) return;

  const valor = parseFloat(input.value);
  if (isNaN(valor)) {
    small.className = "text-muted d-block";
    small.textContent = `Ref: ${valoresReferencia[id][sexo].join(" - ")} mm`;
    return;
  }

  const [min, max] = valoresReferencia[id][sexo];
  const dentro = valor >= min && valor <= max;

  // Atualiza classe Bootstrap e texto
  small.className = `${
    dentro ? "text-success" : "text-danger"
  } d-block fw-semibold`;
  small.textContent = `Ref: ${min} - ${max} mm (${
    dentro ? "Normal" : "Fora dos limites"
  })`;
}

// ============================================================
// Eventos customizados
// ============================================================
document.addEventListener("normalizarEstruturas", () => {
  const defaults = {
    valvaMitral: "Abertura normal, com refluxo mínimo.",
    valvaAortica: "Com abertura adequada e refluxo mínimo.",
    valvaTricuspide: "Abertura normal.",
    valvaPulmonar: "Abertura adequada.",
    ventriculoEsquerdo: "Contratilidade preservada, cavidade normal.",
    atrioEsquerdoDesc: "Tamanho normal.",
    ventriculoDireito: "Tamanho e função normais.",
    atrioDireito: "Tamanho normal.",
    septoInterAtrial: "Integridade preservada.",
  };

  Object.entries(defaults).forEach(([id, texto]) => {
    const el = document.getElementById(id);
    if (el) el.value = texto;
  });

  atualizarCalculos();
});

document.addEventListener("recalcularAE", recalcularAEIndexado);
document.addEventListener("recalcularAD", recalcularADIndexado);

// ============================================================
// 🔹 Funções de Coleta de Dados para o Laudo
// ============================================================

export function coletarDadosMedico() {
  return {
    medico: document.getElementById("nomeMedico")?.value || "",
    CRM: document.getElementById("CRM")?.value || "",
    clinica: document.getElementById("clinica")?.value || "",
  };
}

export function coletarDadosPaciente() {
  return {
    exame: document.getElementById("exameTipo")?.value || "Ecocardiograma",
    nome: document.getElementById("nome")?.value || "",
    sexo: document.querySelector("input[name='sexo']:checked")?.value || "M",
    peso: parseFloat(document.getElementById("peso")?.value) || "",
    altura: parseFloat(document.getElementById("altura")?.value) || "",
    superficieCorporal:
      parseFloat(document.getElementById("superficieCorporal")?.value) || "",
    dataNascimento: document.getElementById("dataNascimento")?.value || "",
  };
}

export function coletarMedidas() {
  const campos = [
    "aorta",
    "atrioEsquerdo",
    "diametroBasalVD",
    "diametroDiastolicoFinalVE",
    "diametroSistolicoFinalVE",
    "espessuraDiastolicaSepto",
    "paredePosteriorVE",
    "paredePosteriorVE",
  ];

  const medidas = {};
  campos.forEach((id) => {
    const el = document.getElementById(id);
    medidas[id] = el ? el.value : "";
  });

  return medidas;
}

export function coletarResultados() {
  const campos = [
    "fracaoEjecao",
    "massaVentricularEsquerda",
    "indiceMassaVentricularEsquerda",
    "espessuraRelativaParedeVE",
    "volumeDiastolicoFinalVE",
    "volumeSistolicoFinalVE",
    "fracaoEncurtamento",
    
  ];

  const resultados = {};
  campos.forEach((id) => {
    const el = document.getElementById(id);
    resultados[id] = el ? el.value : "";
  });

  return resultados;
}

export function coletarEstruturas() {
  const campos = [
    "valvaMitral",
    "valvaAortica",
    "valvaTricuspide",
    "valvaPulmonar",
    "ventriculoEsquerdo",
    "atrioEsquerdoDesc",
    "ventriculoDireito",
    "atrioDireito",
    "septoInterAtrial",
  ];

  const estruturas = {};
  campos.forEach((id) => {
    const el = document.getElementById(id);
    estruturas[id] = el ? el.value : "";
  });

  return estruturas;
}

export function coletarConclusao(){
  return{ 
  conclusao: document.getElementById("conclusaoTextArea")?.value || "",
  };
}