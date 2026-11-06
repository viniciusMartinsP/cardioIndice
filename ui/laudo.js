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

function hojeLocalISO() {
  const d = new Date();
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
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
  const idade = calcularIdade(d.data_nascimento);
  document.getElementById("idade").textContent = idade === "" ? "" : `${idade} anos`;
  document.getElementById("data_exame").textContent = formatarDataISO(hojeLocalISO());
}

function preencherTabela(dados) {
  Object.keys(referenciasClinicas).forEach(id => {
    const def = referenciasClinicas[id];
    const valor = dados[id];

    const label = document.querySelector(`[data-label="${id}"]`);
    const value = document.querySelector(`[data-value="${id}"]`);
    const ref = document.querySelector(`[data-ref="${id}"]`);

    if (!label || valor == null || valor === "") return; // só deixa as células vazias

    label.textContent = def.label;
    value.textContent = def.unidade ? `${valor} ${def.unidade}` : valor;

    const r = def[dados.sexo];
    if (!r) {
      ref.textContent = "—";
    } else if (r.max == null || r.max >= 999) {
      ref.textContent = `≥ ${r.min} ${def.unidade ?? ""}`.trim();
    } else {
      ref.textContent = `${r.min} – ${r.max} ${def.unidade ?? ""}`.trim();
    }
  });

  // esconde apenas as linhas em que os DOIS lados estão vazios
  document.querySelectorAll("table tbody tr").forEach(tr => {
    const vazia = [...tr.querySelectorAll("td")].every(td => !td.textContent.trim());
    if (vazia) tr.style.display = "none";
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

// ===== Copiar laudo para a área de transferência =====

// Converte a <table> em texto com colunas alinhadas por espaços
function tabelaParaTexto(table) {
  const linhas = [...table.querySelectorAll("tr")]
    .filter(tr => tr.style.display !== "none")
    .map(tr => {
      const c = [...tr.querySelectorAll("th, td")].map(td => td.innerText.trim());
      while (c.length < 6) c.push("");   // última linha tem só 3 células
      return c;
    });

  // largura de cada coluna = maior conteúdo da coluna
  const larg = [0, 1, 2, 3, 4, 5].map(i => Math.max(...linhas.map(l => l[i].length)));

  const fmt = l => {
    const esq = l.slice(0, 3).map((v, i) => v.padEnd(larg[i])).join("   ");
    const dir = l.slice(3).map((v, i) => v.padEnd(larg[i + 3])).join("   ");
    return (esq + "      " + dir).trimEnd();   // 6 espaços entre os dois blocos
  };

  const out = linhas.map(fmt);
  out.splice(1, 0, "-".repeat(out[0].length)); // linha separadora abaixo do cabeçalho
  return out.join("\n");
}

document.getElementById("btn_copiar")?.addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const partes = [...document.body.children].filter(el => !el.matches("button, script"));

  // ← a única mudança em relação à versão anterior: tabela vira texto alinhado
  const texto = partes
    .map(el => el.tagName === "TABLE" ? tabelaParaTexto(el) : el.innerText.trim())
    .join("\n\n");
  const html = partes.map(el => el.outerHTML).join("");

  try {
    await navigator.clipboard.write([new ClipboardItem({
      "text/plain": new Blob([texto], { type: "text/plain" }),
      "text/html": new Blob([html], { type: "text/html" }),
    })]);
  } catch {
    await navigator.clipboard.writeText(texto);
  }

  const original = btn.textContent;
  btn.textContent = "COPIADO!";
  setTimeout(() => (btn.textContent = original), 1500);
});