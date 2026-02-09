export const superficieCorporal = {
  calcular({ peso, altura }) {
    if (
      peso == null ||
      altura == null ||
      peso <= 0 ||
      altura <= 0
    ) {
      return null;
    }

    // Altura em cm
    const sc = Math.sqrt((peso * altura) / 3600);
    return Number(sc.toFixed(2));
  }
};
