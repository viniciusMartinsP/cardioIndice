import { carregarEstado } from "../app/state.js";
import { referenciasClinicas } from "../domain/clinical/referenciasClinicas.js";

document.addEventListener("DOMContentLoaded", () => {
  const dados = carregarEstado();
  if (!dados) return;

  preencherIdentificacao(dados);
  preencherTabela(dados);
  preencherObservacoes(dados);
});

function formatarDataISO(data) {
  if (!data) return "";
  const [y, m, d] = data.split("-");
  return `${d}/${m}/${y}`;
}

function calcularIdade(dataISO) {
  if (!dataISO) return "";
  const nasc = new Date(dataISO);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

function preencherIdentificacao(d) {
  const mapa = {
    paciente_nome: d.paciente_nome,
    sexo: d.sexo,
    peso: d.peso,
    altura: d.altura,
    imc: d.imc,
    superficie_corporal: d.superficie_corporal,
    medico_nome: d.medico_nome,
    medico_crm: d.medico_crm,
    medico_clinica: d.medico_clinica,

  };

  Object.entries(mapa).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val != null) el.textContent = val;
  });

  const sexoEl = document.getElementById("sexo");
  if (sexoEl) {
    if (d.sexo === "M") sexoEl.textContent = "Masculino";
    else if (d.sexo === "F") sexoEl.textContent = "Feminino";
    else sexoEl.textContent = "";
  }

  document.getElementById("data_nascimento").textContent = formatarDataISO(d.data_nascimento);
  document.getElementById("idade").textContent = calcularIdade(d.data_nascimento)+" anos";
  document.getElementById("data_exame").textContent = formatarDataISO(new Date().toISOString().slice(0,10));
}

function preencherTabela(dados) {
  Object.keys(referenciasClinicas).forEach(id => {
    const def = referenciasClinicas[id];
    const valor = dados[id];

    const label = document.querySelector(`[data-label="${id}"]`);
    const value = document.querySelector(`[data-value="${id}"]`);
    const ref = document.querySelector(`[data-ref="${id}"]`);
    const row = label?.closest("tr");

    if (!label || valor == null || valor === "") {
      if (row) row.style.display = "none";
      return;
    }

    label.textContent = def.label;
    value.textContent = def.unidade ? `${valor} ${def.unidade}` : valor;

    const r = def[dados.sexo];
    ref.textContent = r ? `${r.min} – ${r.max} ${def.unidade ?? ""}` : "—";
  });
}

function preencherObservacoes(d) {
  const campos = [
    "ventriculoEsquerdo",
    "atrioEsquerdoDesc",
    "ventriculoDireito",
    "atrioDireito",
    "valvaMitral",
    "valvaTricuspide",
    "valvaAortica",
    "valvaPulmonar",
    "pericardio",
    "septoInteratrial",
    "comentariosAdicionais",
    "conclusao"
  ];

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el && d[id]) el.textContent = d[id];
  });
}
