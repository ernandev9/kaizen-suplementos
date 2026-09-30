import { products as localProducts } from '../data/products';

/**
 * Camada de acesso aos produtos.
 * Hoje lê de src/data/products.js. Para usar um banco (Supabase, Firebase, API própria),
 * troque apenas o conteúdo destas funções — o resto do site não precisa mudar.
 *
 * Exemplo com Supabase:
 *   const { data } = await supabase.from('products').select('*').eq('active', true);
 *   return data;
 */
export async function fetchProducts() {
  return localProducts.map((p) => ({ ...p }));
}

/**
 * Baixa o estoque após um pedido.
 * Com banco de dados, faça isso no servidor (função/RPC) para evitar vender além do estoque.
 */
export async function reserveStock(items) {
  return { ok: true, items };
}
