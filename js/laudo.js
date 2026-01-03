// ============================================================
// 🔹 laudo.js — Preenche automaticamente o laudo a partir do sessionStorage
// ============================================================

import { valoresReferencia } from "./calculos.js";

// ------------------------------------------------------------
// 🧭 Utilitários
// ------------------------------------------------------------

function getItem(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function preencherTexto(id, valor, sufixo = "") {
  const el = document.getElementById(id);
  if (el) el.textContent = valor ? `${valor}${sufixo}` : "";
}


function preencherMedico() {
  const medico = getItem("medico");

  const campos = {
    medico: "nomeMedico",
    CRM: "crmMedico",
    clinica: "clinicaMedico",
  };

  Object.entries(campos).forEach(([campoOriginal, idDestino]) => {
    preencherTexto(idDestino, medico[campoOriginal]);
  });
}



// ------------------------------------------------------------
// 🧩 Cabeçalho (identificação e dados básicos)
// ------------------------------------------------------------

function preencherCabecalho() {
  const paciente = getItem("paciente");
  if (!paciente || Object.keys(paciente).length === 0) {
    alert(
      "Nenhum dado encontrado. Retorne à página inicial para gerar o laudo."
    );
    window.location.href = "./index.html";
    return;
  }


  preencherTexto("nome", paciente.nome);
  preencherTexto("peso", paciente.peso,);
  preencherTexto("altura", paciente.altura);
  preencherTexto("superficieCorporal", paciente.superficieCorporal);

  // Sexo
  const sexoLabel = paciente.sexo === "F" ? "Feminino" : "Masculino";
  preencherTexto("sexo", sexoLabel);

  // Data de nascimento
  if (paciente.dataNascimento) {
    const dataNascimento = new Date(paciente.dataNascimento);
    preencherTexto(
      "dataNascimento",
      dataNascimento.toLocaleDateString("pt-BR", { timeZone: "UTC" })
    );
  }

  // Data do exame
  const hoje = new Date();
  preencherTexto("data", hoje.toLocaleDateString("pt-BR"));

  // IMC
  if (paciente.peso && paciente.altura) {
    const alturaM = paciente.altura / 100;
    const imc = (paciente.peso / (alturaM * alturaM)).toFixed(1);
    preencherTexto("imcValue", imc);
  }
}

function preencherConclusao() {
  const conclusao = getItem("conclusao");
  preencherTexto("conclusao", conclusao.conclusao);
}


// ------------------------------------------------------------
// 📊 Tabela de resultados e medidas
// ------------------------------------------------------------

function preencherTabela() {
  const medico = getItem("medico");
  const medidas = getItem("medidas");
  const resultados = getItem("resultados");
  const paciente = getItem("paciente");
  const sexo = paciente.sexo || "M";

  // Campos de dados → id no HTML
  const campos = {
    aorta: medidas.aorta,
    atrioEsquerdo: medidas.atrioEsquerdo,
    diametroBasalVD: medidas.diametroBasalVD,
    diametroDiastolicoFinalVE: medidas.diametroDiastolicoFinalVE,
    diametroSistolicoFinalVE: medidas.diametroSistolicoFinalVE,
    espessuraDiastolicaSepto: medidas.espessuraDiastolicaSepto,
    paredePosteriorVE:
      medidas.paredePosteriorVE,
    fracaoEjecao: resultados.fracaoEjecao,
    massaVentricularEsquerda: resultados.massaVentricularEsquerda,
    indiceMassaVentricularEsquerda: resultados.indiceMassaVentricularEsquerda,
    espessuraRelativaParedeVE: resultados.espessuraRelativaParedeVE,
  };

  Object.entries(campos).forEach(([campo, valor]) => {
    const valorEl = document.getElementById(`${campo}Value`);
    const refEl = document.getElementById(`${campo}Reference`);

    if (valorEl) valorEl.textContent = valor ?? "";

    if (refEl && valoresReferencia[campo]?.[sexo]) {
      const ref = valoresReferencia[campo][sexo];
      refEl.textContent = `${ref[0]} - ${ref[1]}`;
    }
  });
}

// ------------------------------------------------------------
// 🫀 Observações de estruturas cardíacas
// ------------------------------------------------------------

function preencherObservacoes() {
  const estruturas = getItem("estruturas");

  const camposObs = {
    valvaMitral: "valvaMitralObs",
    valvaAortica: "valvaAorticaObs",
    valvaTricuspide: "valvaTricuspideObs",
    valvaPulmonar: "valvaPulmonarObs",
    ventriculoEsquerdo: "ventriculoEsquerdoObs",
    atrioEsquerdoDesc : "atrioEsquerdoObs",
    ventriculoDireito: "ventriculoDireitoObs",
    atrioDireito: "atrioDireitoObs",
    septoInterAtrial: "septoInterAtrialObs",
  };

  Object.entries(camposObs).forEach(([campo, id]) => {
    preencherTexto(id, estruturas[campo]);
  });
}

// ------------------------------------------------------------
// 🔙 Função opcional de voltar mantendo dados
// ------------------------------------------------------------

function setupBotaoVoltar() {
  const voltar = document.createElement("button");
  voltar.textContent = "← Voltar ao formulário";
  voltar.classList.add("btn", "btn-outline-primary", "mt-3");
  voltar.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  document.querySelector(".container")?.appendChild(voltar);
}

// ------------------------------------------------------------
// 🚀 Inicialização
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  preencherCabecalho();
  preencherTabela();
  preencherObservacoes();
  preencherMedico();
  preencherConclusao();
  setupBotaoVoltar();
});
