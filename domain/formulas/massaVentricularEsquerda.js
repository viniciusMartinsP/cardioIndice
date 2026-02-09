export const massaVentricularEsquerda = {
  calcular({ ddve, septo, paredePosterior }) {
    if (
      typeof ddve !== "number" ||
      typeof septo !== "number" ||
      typeof paredePosterior !== "number" ||
      isNaN(ddve) ||
      isNaN(septo) ||
      isNaN(paredePosterior)
    ) {
      return null;
    }

    if (
      ddve <= 0 ||
      septo <= 0 ||
      paredePosterior <= 0
    ) {
      return null;
    }

    const massa =
      0.8 *
        (1.04 *
          ((ddve + septo + paredePosterior) ** 3 - ddve ** 3)) +
      0.6;

    return Number(massa.toFixed(1));
  }
};
