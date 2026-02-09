export const indiceMassaVentricularEsquerda = {
  calcular({ massaVE, sc }) {
    if (
      typeof massaVE !== "number" ||
      typeof sc !== "number" ||
      isNaN(massaVE) ||
      isNaN(sc)
    ) {
      return null;
    }

    if (
      massaVE <= 0 ||
      sc <= 0
    ) {
      return null;
    }

    const indice = massaVE / sc;
    return Number(indice.toFixed(1));
  }
};
