import { getMainForm } from "../ui/mainForm.js";
import { salvarEstado } from "./state.js";

import { superficieCorporal } from "../domain/formulas/superficieCorporal.js";
import { fracaoEjecao } from "../domain/formulas/fracaoEjecao.js";
import { massaVentricularEsquerda } from "../domain/formulas/massaVentricularEsquerda.js";
import { indiceMassaVentricularEsquerda } from "../domain/formulas/indiceMassaVentricularEsquerda.js";
import { espessuraRelativaParedeVE } from "../domain/formulas/espessuraRelativaParedeVE.js";
import { imc } from "../domain/formulas/imc.js";
import { bindNormalEstruturasButton } from "../ui/normalEstruturasButton.js";


document.addEventListener("DOMContentLoaded", () => {
  bindNormalEstruturasButton();
  document.addEventListener("DOMContentLoaded", () => {
  const form = getMainForm();

  bindNormalEstruturasButton();

  form.onChange(calcular);

  document
    .getElementById("btnGerarLaudo")
    ?.addEventListener("click", () => {
      window.location.href = "./laudo.html";
    });
});

  const form = getMainForm();

  function calcular(dados) {
    const r = {};

    if (dados.peso && dados.altura) {
      r.superficie_corporal = superficieCorporal.calcular(dados);
      r.imc = imc.calcular(dados);
    }

    if (dados.ddve && dados.dsve) {
      r.fe = fracaoEjecao.calcular(dados);
    }

    if (dados.ddve && dados.septo && dados.paredePosterior) {
      r.massaVE = massaVentricularEsquerda.calcular(dados);
      r.erpVE = espessuraRelativaParedeVE.calcular(dados);
    }

    if (r.massaVE && r.superficie_corporal) {
      r.indiceMassaVE = indiceMassaVentricularEsquerda.calcular({
        massaVE: r.massaVE,
        sc: r.superficie_corporal
      });
    }

    if (
      dados.volume_ae_abs &&
      r.superficie_corporal &&
      !form.foiEditado("volume_ae_indexado")
    ) {
      r.volume_ae_indexado = Number(
        (dados.volume_ae_abs / r.superficie_corporal).toFixed(1)
      );
    }

    if (
      dados.volume_ad_abs &&
      r.superficie_corporal &&
      !form.foiEditado("volume_ad_indexado")
    ) {
      r.volume_ad_indexado = Number(
        (dados.volume_ad_abs / r.superficie_corporal).toFixed(1)
      );
    }

    Object.entries(r).forEach(([k, v]) => form.setResultado(k, v));
    salvarEstado({ ...dados, ...r });
  }

  form.onChange(calcular);

  document
    .getElementById("btnGerarLaudo")
    ?.addEventListener("click", () => {
      window.location.href = "./laudo.html";
    });
});
