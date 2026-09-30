import { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { buildQuery, navigate } from '../hooks/useRoute';
import { categoriesById } from '../data/categories';
import { filterProducts } from '../utils/search';
import ProductGrid from '../components/ProductGrid';
import Filters, { FilterSidebar } from '../components/Filters';

const SORTS = {
  relevancia: { label: 'Relevância', fn: (a, b) => (b.stock > 0) - (a.stock > 0) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0) },
  'menor-preco': { label: 'Menor preço', fn: (a, b) => a.price - b.price },
  'maior-preco': { label: 'Maior preço', fn: (a, b) => b.price - a.price },
};

export default function Products({ route, offers = false }) {
  const { products, loading } = useStore();
  const { q = '', cat = '', price = '', disp = '', ordem = 'relevancia' } = route.query;
  const base = offers ? '/ofertas' : '/produtos';

  const update = (next) => {
    const merged = { q, cat, price, disp, ordem: ordem === 'relevancia' ? '' : ordem, ...next };
    if (merged.ordem === 'relevancia') merged.ordem = '';
    history.replaceState(null, '', `#${base}${buildQuery(merged)}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  const list = useMemo(() => {
    const result = filterProducts(products, { q, category: cat, price, available: !!disp, offers });
    return [...result].sort((SORTS[ordem] || SORTS.relevancia).fn);
  }, [products, q, cat, price, disp, offers, ordem]);

  const title = offers ? 'Ofertas' : cat ? categoriesById[cat]?.name || 'Produtos' : 'Produtos';

  return (
    <div className="container page">
      <div className="listing__head">
        <div>
          <h1 className="page__title">{title}</h1>
          <p className="muted">
            {q ? <>Resultados para “{q}” · </> : null}
            {loading ? 'Carregando…' : `${list.length} ${list.length === 1 ? 'produto' : 'produtos'}`}
            {q && <> · <button className="link" onClick={() => update({ q: '' })}>limpar busca</button></>}
          </p>
        </div>
        <div className="listing__tools">
          <Filters value={{ cat, price, disp }} onChange={(v) => update(v)} resultCount={list.length} />
          <label className="sort">
            <span className="sr-only">Ordenar</span>
            <select value={ordem} onChange={(e) => update({ ordem: e.target.value })}>
              {Object.entries(SORTS).map(([id, s]) => <option key={id} value={id}>{s.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="listing">
        <FilterSidebar value={{ cat, price, disp }} onChange={(v) => update(v)} />
        <div className="listing__main">
          {!loading && (
            <ProductGrid
              products={list}
              emptyAction={<button className="btn btn--primary" onClick={() => navigate(base)}>Ver todos os produtos</button>}
            />
          )}
        </div>
      </div>
    </div>
  );
}
