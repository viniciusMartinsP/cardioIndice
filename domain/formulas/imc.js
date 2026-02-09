export const imc = {
  id: "indice_massa_corporal",
  nome: "Índice de Massa Corporal",
  metodo: "IMC",

  entradas: {
    peso: { unidade: "kg", obrigatorio: true },
    altura: { unidade: "cm", obrigatorio: true }
  },

  saida: {
    unidade: "kg/m²",
    precisao: 2
  },

  referencia: "OMS – World Health Organization",

  validar(dados) {
    const { peso, altura } = dados;

    if (peso == null || altura == null) {
      throw new Error("Peso e altura são obrigatórios");
    }

    if (typeof peso !== "number" || typeof altura !== "number") {
      throw new Error("Peso e altura devem ser numéricos");
    }

    if (isNaN(peso) || isNaN(altura)) {
      throw new Error("Peso ou altura inválidos");
    }

    if (peso <= 0 || altura <= 0) {
      throw new Error("Peso e altura devem ser maiores que zero");
    }
  },

  calcular(dados) {
    this.validar(dados);

    const { peso, altura } = dados;

    const alturaMetros = altura / 100;

    const resultado = peso / (alturaMetros * alturaMetros);

    return Number(resultado.toFixed(this.saida.precisao));
  }
};
