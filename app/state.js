const STATE_KEY = "eco_form_state";
const STATE_VERSION = 1;

export function salvarEstado(estado) {
  const payload = {
    version: STATE_VERSION,
    data: estado,
    savedAt: Date.now()
  };

  localStorage.setItem(STATE_KEY, JSON.stringify(payload));
}

export function carregarEstado() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (parsed.version !== STATE_VERSION) {
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

export function limparEstado() {
  localStorage.removeItem(STATE_KEY);
}
