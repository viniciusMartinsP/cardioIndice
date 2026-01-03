// ============================================================
// 🔹 main.js — Inicialização do sistema de cálculos médicos
// ============================================================

import {
  atualizarReferencias,
  atualizarCalculos,
  recalcularAEIndexado,
  recalcularADIndexado,
} from "./dom.js";

import { setupEventos, setupEventosReferencia } from "./eventos.js";

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------
  // 1️⃣ Inicializações principais
  // ------------------------------------------------------------
  setupEventos(); // auto-advance, botões, normalizar, manual, gerar laudo, etc.
  setupEventosReferencia(); // cores dinâmicas de referência (<small>)

  // ------------------------------------------------------------
  // 2️⃣ Eventos de atualização automática
  // ------------------------------------------------------------

  // Ao alterar o sexo, atualiza referências e cálculos
  document.querySelectorAll('input[name="sexo"]').forEach((input) => {
    input.addEventListener("change", () => {
      atualizarReferencias();
      atualizarCalculos();
    });
  });

  // Atualiza cálculos em tempo real conforme digitação
  document
    .querySelectorAll("#paciente input, #medicoes input")
    .forEach((input) => {
      input.addEventListener("input", atualizarCalculos);
    });

  // ------------------------------------------------------------
  // 3️⃣ Eventos customizados (emitidos em eventos.js)
  // ------------------------------------------------------------
  document.addEventListener("recalcularAE", recalcularAEIndexado);
  document.addEventListener("recalcularAD", recalcularADIndexado);

  // ------------------------------------------------------------
  // 4️⃣ Execução inicial
  // ------------------------------------------------------------
  atualizarReferencias();
  atualizarCalculos();
});
