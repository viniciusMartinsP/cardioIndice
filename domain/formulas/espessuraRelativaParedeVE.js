export const espessuraRelativaParedeVE = {
  calcular({ ddve, paredePosterior }) {
    if (
      typeof ddve !== "number" ||
      typeof paredePosterior !== "number" ||
      isNaN(ddve) ||
      isNaN(paredePosterior)
    ) {
      return null;
    }

    if (
      ddve <= 0 ||
      paredePosterior <= 0
    ) {
      return null;
    }

    const erp = (2 * paredePosterior) / ddve;
    return Number(erp.toFixed(2));
  }
};
