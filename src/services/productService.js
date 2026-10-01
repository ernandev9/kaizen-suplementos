import bundled from '../data/products.json';
import { REPO } from '../config/store';

/**
 * Camada de acesso aos produtos.
 * Lê o arquivo publicado no GitHub (atualizado pelo painel em #/admin) e, se estiver
 * sem internet ou o GitHub falhar, usa a cópia que vem junto com o site.
 * Produtos com active === false não aparecem na loja.
 */
const LIVE = `https://api.github.com/repos/${REPO.owner}/${REPO.name}/contents/${REPO.file}?ref=${REPO.branch}`;

async function fetchLive() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(LIVE, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github.raw+json' } });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length ? data : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchProducts() {
  const list = (await fetchLive()) || bundled;
  return list.filter((p) => p.active !== false).map((p) => ({ ...p }));
}

/**
 * Baixa o estoque após um pedido.
 * Hoje a baixa vale só para a sessão do cliente; o estoque real é ajustado no painel #/admin.
 */
export async function reserveStock(items) {
  return { ok: true, items };
}
