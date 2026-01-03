// ============================================================
// 🔹 Controle de flags manuais e eventos de recálculo AE / AD
// ============================================================

let _manualAE = false;
let _manualAD = false;

export function isManualAE() {
  return !!_manualAE;
}
export function isManualAD() {
  return !!_manualAD;
}
export function setManualAE(flag) {
  _manualAE = !!flag;
}
export function setManualAD(flag) {
  _manualAD = !!flag;
}

// ============================================================
// 🔹 Avanço automático entre inputs de medidas
// ============================================================



function setupAutoAdvance(opts = { threshold: 2 }) {
  const container = document.querySelector("#medicoes");
  if (!container) return;

  const inputs = Array.from(
    container.querySelectorAll("input[type='number'], input[type='text']")
  ).filter((i) => !i.hasAttribute("readonly"));

  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      const val = input.value?.toString().trim();
      if (!val) return;

      const limite = parseInt(input.dataset.threshold) || opts.threshold;
      if (val.length >= limite) {
        const next = inputs[idx + 1];
        if (next) next.focus();
      }
    });
  });
}

// ============================================================
// 🔹 Botões de recálculo AE / AD
// ============================================================

function setupRecalcButtons() {
  const btnAE = document.getElementById("recalcularAEIndexado");
  const btnAD = document.getElementById("recalcularADIndexado");

  if (btnAE) {
    btnAE.addEventListener("click", (ev) => {
      ev.preventDefault();
      setManualAE(false);
      const aeInput = document.getElementById("volumeAEIndexado");
      if (aeInput?.dataset) delete aeInput.dataset.manual;
      document.dispatchEvent(new CustomEvent("recalcularAE"));
    });
  }

  if (btnAD) {
    btnAD.addEventListener("click", (ev) => {
      ev.preventDefault();
      setManualAD(false);
      const adInput = document.getElementById("volumeADIndexado");
      if (adInput?.dataset) delete adInput.dataset.manual;
      document.dispatchEvent(new CustomEvent("recalcularAD"));
    });
  }
}

// ============================================================
// 🔹 Inputs manuais AE / AD
// ============================================================

function setupManualInputs() {
  const aeInput = document.getElementById("volumeAEIndexado");
  const adInput = document.getElementById("volumeADIndexado");

  if (aeInput) {
    aeInput.addEventListener("input", () => {
      setManualAE(true);
      aeInput.dataset.manual = "true";
      document.dispatchEvent(new CustomEvent("manualAEChanged"));
    });
  }

  if (adInput) {
    adInput.addEventListener("input", () => {
      setManualAD(true);
      adInput.dataset.manual = "true";
      document.dispatchEvent(new CustomEvent("manualADChanged"));
    });
  }
}

// ============================================================
// 🔹 Botão "Normalizar Estruturas"
// ============================================================

function setupNormalButton() {
  const btn = document.getElementById("normalizarResultados");
  if (!btn) return;

  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    document.dispatchEvent(new CustomEvent("normalizarEstruturas"));
  });
}

// ============================================================
// 🔹 Limita campos AE/AD a 3 dígitos
// ============================================================

function setupInputLimit() {
  ["volumeAEAbsoluto", "volumeADAbsoluto"].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("input", () => {
      if (input.value.length > 3) input.value = input.value.slice(0, 3);
      if (parseInt(input.value) > 999) input.value = "999";
    });
  });
}

// ============================================================
// 🔹 Atualização dinâmica das cores de referência (<small>)
// ============================================================

import { atualizarReferencia } from "./dom.js";

export function setupEventosReferencia() {
  const inputs = document.querySelectorAll("#medicoes input[type='number']");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const sexoSelecionado = document.querySelector(
        "input[name='sexo']:checked"
      );
      if (!sexoSelecionado) return;
      atualizarReferencia(input, sexoSelecionado.value);
    });
  });
}

// ============================================================
// 🔹 Botão "Gerar Laudo" — Salva dados e abre laudo.html
// ============================================================

import {
  coletarDadosMedico,
  coletarDadosPaciente,
  coletarMedidas,
  coletarResultados,
  coletarEstruturas,
  coletarConclusao
} from "./dom.js";

// ============================================================
// 🔹 Inicialização principal de eventos
// ============================================================

export function setupEventos() {
  // 1️⃣ Avanço automático entre inputs
  setupAutoAdvance({ threshold: 2 });

  // 2️⃣ Botões de recálculo AE / AD
  setupRecalcButtons();

  // 3️⃣ Inputs manuais AE / AD
  setupManualInputs();

  // 4️⃣ Botão "Normalizar Estruturas"
  setupNormalButton();

  // 5️⃣ Limite de 3 dígitos nos campos AE/AD
  setupInputLimit();

  // 6️⃣ Botão "Gerar Laudo"
  const btnGerar = document.getElementById("btnGerarLaudo");
  const form = document.getElementById("calcForm");

  // Evita submissão tradicional do formulário
  if (form) {
    form.addEventListener("submit", (ev) => ev.preventDefault());
  }

  if (btnGerar) {
    btnGerar.type = "button"; // garante que não é "submit"

    btnGerar.addEventListener("click", (ev) => {
      ev.preventDefault();

      // Coleta os dados atuais
      const medico = coletarDadosMedico();
      const paciente = coletarDadosPaciente();
      const medidas = coletarMedidas();
      const resultados = coletarResultados();
      const estruturas = coletarEstruturas();
      const conclusao = coletarConclusao();

      // Salva de forma segura — apenas no navegador
      sessionStorage.setItem("medico", JSON.stringify(medico));
      sessionStorage.setItem("paciente", JSON.stringify(paciente));
      sessionStorage.setItem("medidas", JSON.stringify(medidas));
      sessionStorage.setItem("resultados", JSON.stringify(resultados));
      sessionStorage.setItem("estruturas", JSON.stringify(estruturas));
      sessionStorage.setItem("conclusao", JSON.stringify(conclusao));
      
      // Redireciona para laudo.html sem expor dados na URL
      window.location.assign("./laudo.html");
    });
  }
}

// ============================================================
// 🔹 Execução automática após carregamento do DOM
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  setupEventos();
});
