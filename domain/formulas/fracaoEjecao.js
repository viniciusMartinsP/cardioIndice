export const fracaoEjecao = {
  calcular({ ddve, dsve }) {
    if (
      typeof ddve !== "number" ||
      typeof dsve !== "number" ||
      isNaN(ddve) ||
      isNaN(dsve)
    ) {
      return null;
    }

    if (ddve <= 0 || dsve <= 0) {
      return null;
    }

    if (dsve >= ddve) {
      return null;
    }

    const fe = ((ddve ** 3 - dsve ** 3) / ddve ** 3) * 100;
    return Number(fe.toFixed(1));
  }
};
