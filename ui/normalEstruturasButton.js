export function bindNormalEstruturasButton() {
  const btn = document.getElementById("btnNormalEstruturas");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const map = [
      { input: "valvaMitral", datalist: "valvaMitralOptions" },
      { input: "valvaAortica", datalist: "valvaAorticaOptions" },
      { input: "valvaTricuspide", datalist: "valvaTricuspideOptions" },
      { input: "valvaPulmonar", datalist: "valvaPulmonarOptions" },
      { input: "ventriculoEsquerdo", datalist: "ventriculoEsquerdoOptions" },
      { input: "atrioEsquerdoDesc", datalist: "atrioEsquerdoOptions" },
      { input: "ventriculoDireito", datalist: "ventriculoDireitoOptions" },
      { input: "atrioDireito", datalist: "atrioDireitoOptions" },
      { input: "pericardio", datalist: "pericardioOptions" },
      { input: "septoInteratrial", datalist: "septoInteratrialOptions" }
    ];

    map.forEach(({ input, datalist }) => {
      const inputEl = document.getElementById(input);
      const listEl = document.getElementById(datalist);
      if (!inputEl || !listEl) return;

      const firstOption = listEl.querySelector("option");
      if (firstOption) {
        inputEl.value = firstOption.value;
        // DISPARA O MESMO FLUXO DE DIGITAÇÃO MANUAL
        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    const conclusaoEl = document.getElementById("conclusao");
    if (conclusaoEl && conclusaoEl.value.trim() === "") {
      conclusaoEl.value =
        "Ventrículo esquerdo com dimensões, mobilidade segmentar e função sistólica global normais. "+ 
        "Função diastólica normal. Átrio esquerdo e câmaras direitas normais;"
      conclusaoEl.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
}
