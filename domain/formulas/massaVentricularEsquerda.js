export const massaVentricularEsquerda = {
  calcular({ ddve, septo, paredePosterior }) {
    if (
      [ddve, septo, paredePosterior].some(
        (v) => typeof v !== "number" || isNaN(v) || v <= 0
      )
    ) {
      return null;
    }

    // entradas em mm -> converter para cm
    const d = ddve / 10;
    const s = septo / 10;
    const p = paredePosterior / 10;

    const massa = 0.8 * (1.04 * ((d + s + p) ** 3 - d ** 3)) + 0.6;

    return Number(massa.toFixed(1));
  },
};