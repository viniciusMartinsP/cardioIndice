import { salvarEstado } from "../app/state.js";
import { referenciasClinicas } from "../domain/clinical/referenciasClinicas.js";

export function getMainForm() {
  const editadosManualmente = new Set();
  const listeners = [];

  function get(id) {
    return document.getElementById(id);
  }

  function getSexo() {
    const el = document.querySelector('input[name="sexo"]:checked');
    return el ? el.value : null;
  }

  function parseNumber(el) {
    if (!el || el.value === "") return null;
    const n = Number(el.value);
    return Number.isNaN(n) ? null : n;
  }

  function coletarDados() {
    return {
      medico_nome: get("medico_nome")?.value || "",
      medico_crm: get("medico_crm")?.value || "",
      medico_clinica: get("medico_clinica")?.value || "",

      paciente_nome: get("paciente_nome")?.value || "",
      sexo: getSexo(),
      peso: parseNumber(get("peso")),
      altura: parseNumber(get("altura")),
      imc: parseNumber(get("imc")),
      superficie_corporal: parseNumber(get("superficie_corporal")),
      data_nascimento: get("data_nascimento")?.value || null,

      aorta_raiz: parseNumber(get("aorta_raiz")),
      atrio_esquerdo: parseNumber(get("atrio_esquerdo")),
      vd_basal: parseNumber(get("vd_basal")),
      ddve: parseNumber(get("ddve")),
      dsve: parseNumber(get("dsve")),
      septo: parseNumber(get("septo")),
      paredePosterior: parseNumber(get("paredePosterior")),
      volume_ae_abs: parseNumber(get("volume_ae_abs")),
      volume_ad_abs: parseNumber(get("volume_ad_abs")),

      fe: get("fe")?.value || "",
      massaVE: get("massaVE")?.value || "",
      indiceMassaVE: get("indiceMassaVE")?.value || "",
      erpVE: get("erpVE")?.value || "",
      volume_ae_indexado: get("volume_ae_indexado")?.value || "",
      volume_ad_indexado: get("volume_ad_indexado")?.value || "",

      valvaMitral: get("valvaMitral")?.value || "",
      valvaAortica: get("valvaAortica")?.value || "",
      valvaTricuspide: get("valvaTricuspide")?.value || "",
      valvaPulmonar: get("valvaPulmonar")?.value || "",
      ventriculoEsquerdo: get("ventriculoEsquerdo")?.value || "",
      atrioEsquerdoDesc: get("atrioEsquerdoDesc")?.value || "",
      ventriculoDireito: get("ventriculoDireito")?.value || "",
      atrioDireito: get("atrioDireito")?.value || "",
      pericardio: get("pericardio")?.value || "",
      septoInteratrial: get("septoInteratrial")?.value || "",
      comentariosAdicionais: get("comentariosAdicionais")?.value || "",
      conclusao: get("conclusao")?.value || ""
    };
  }
  const btn = document.getElementById("btnNormalEstruturas");

  if (btn) {
    btn.addEventListener("estruturas:normalizadas", () => {
      salvarEstado(coletarDados());
    });
  }



  function atualizarReferencias(dados) {
    Object.keys(referenciasClinicas).forEach(id => {
      const ref = referenciasClinicas[id];
      const sexo = dados.sexo;
      const valor = dados[id];
      const small = get(`ref_${id}`);
      const input = get(id);

      if (!ref || !sexo || !small || !input) return;

      const { min, max } = ref[sexo];
      small.textContent = `Referência (${sexo}): ${min} – ${max}`;

      input.classList.remove("is-valid", "is-invalid");

      if (valor == null) return;

      if (valor < min || valor > max) {
        input.classList.add("is-invalid");
      } else {
        input.classList.add("is-valid");
      }
    });
  }

  function notificar() {
    const dados = coletarDados();
    atualizarReferencias(dados);
    listeners.forEach(cb => cb(dados));
  }

  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", () => {
      if (
        el.id === "volume_ae_indexado" ||
        el.id === "volume_ad_indexado"
      ) {
        editadosManualmente.add(el.id);
      }
      notificar();
    });
  });

  get("reset_ae")?.addEventListener("click", () => {
    editadosManualmente.delete("volume_ae_indexado");
    get("volume_ae_indexado").value = "";
    notificar();
  });

  get("reset_ad")?.addEventListener("click", () => {
    editadosManualmente.delete("volume_ad_indexado");
    get("volume_ad_indexado").value = "";
    notificar();
  });

  document
    .querySelectorAll('input[name="sexo"]')
    .forEach(el => el.addEventListener("change", notificar));

  /* ================= AUTO-AVANÇO ================= */

  function configurarAutoAvanco() {
    const campos = [
      { id: "peso", len: 3 },
      { id: "altura", len: 3 },

      { id: "aorta_raiz", len: 2 },
      { id: "atrio_esquerdo", len: 2 },
      { id: "vd_basal", len: 2 },
      { id: "ddve", len: 2 },
      { id: "dsve", len: 2 },
      { id: "septo", len: 2 },
      { id: "paredePosterior", len: 2 },

      { id: "volume_ae_abs", len: 3 },
      { id: "volume_ad_abs", len: 3 }
    ];

    for (let i = 0; i < campos.length; i++) {
      const atual = get(campos[i].id);
      const proximo = campos[i + 1] ? get(campos[i + 1].id) : null;

      if (!atual || !proximo) continue;

      atual.addEventListener("input", () => {
        if (atual.value.length >= campos[i].len) {
          proximo.focus();
        }
      });
    }
  }

  configurarAutoAvanco();

  /* ================= API ================= */

  return {
    onChange(cb) {
      listeners.push(cb);
    },
    foiEditado(id) {
      return editadosManualmente.has(id);
    },
    setResultado(id, valor) {
      const el = get(id);
      if (el && !editadosManualmente.has(id)) {
        el.value = valor ?? "";
      }
    },
    getDados() {
      return coletarDados();
    }
  };
}
