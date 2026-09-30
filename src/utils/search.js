import { normalize } from './format';
import { categoriesById } from '../data/categories';

/** Busca por nome, marca ou categoria (ignora acentos e maiúsculas). */
export function matchesQuery(product, query) {
  const q = normalize(query);
  if (!q) return true;
  const cat = categoriesById[product.category];
  const haystack = normalize(
    [product.name, product.brand, product.category, cat?.name, cat?.short].join(' ')
  );
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

export const PRICE_RANGES = [
  { id: 'ate-50', label: 'Até R$ 50', min: 0, max: 50 },
  { id: '50-100', label: 'R$ 50 a R$ 100', min: 50, max: 100 },
  { id: '100-200', label: 'R$ 100 a R$ 200', min: 100, max: 200 },
  { id: '200+', label: 'Acima de R$ 200', min: 200, max: Infinity },
];

export function filterProducts(list, { q, category, price, available, offers }) {
  const range = PRICE_RANGES.find((r) => r.id === price);
  return list.filter(
    (p) =>
      matchesQuery(p, q) &&
      (!category || p.category === category) &&
      (!range || (p.price >= range.min && p.price < range.max)) &&
      (!available || p.stock > 0) &&
      (!offers || (p.oldPrice && p.oldPrice > p.price))
  );
}
