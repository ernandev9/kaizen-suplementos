import { STOCK } from '../config/store';

/**
 * Regras de estoque:
 *  > lowThreshold -> "Em estoque"
 *  1..lowThreshold -> "Últimas unidades"
 *  0 -> "Esgotado"
 */
export function getStockStatus(stock) {
  const n = Math.max(0, Number(stock) || 0);
  if (n === 0) return { level: 'out', label: 'Esgotado', detail: 'Sem estoque no momento', steps: 0 };
  if (n <= STOCK.lowThreshold) {
    return {
      level: 'low',
      label: 'Últimas unidades',
      detail: n === 1 ? 'Última unidade' : `Últimas ${n} unidades`,
      steps: n <= 3 ? 1 : n <= 6 ? 2 : 3,
    };
  }
  return { level: 'in', label: 'Em estoque', detail: `Estoque: ${n} unidades`, steps: 5 };
}

export const isAvailable = (p) => (p?.stock || 0) > 0;
