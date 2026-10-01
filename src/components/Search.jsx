import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { navigate } from '../hooks/useRoute';
import { matchesQuery } from '../utils/search';
import { brl } from '../utils/format';
import { Icon } from './Icons';
import ProductImage from './ProductImage';

export default function Search({ initial = '', autoFocus = false, onDone }) {
  const { products } = useStore();
  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState(false);
  const wrap = useRef();

  useEffect(() => setQ(initial), [initial]);

  useEffect(() => {
    const close = (e) => wrap.current && !wrap.current.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const suggestions = useMemo(
    () => (q.trim().length >= 2 ? products.filter((p) => matchesQuery(p, q)).slice(0, 5) : []),
    [q, products]
  );

  const submit = (e) => {
    e.preventDefault();
    setOpen(false);
    navigate(`/produtos${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
    onDone?.();
  };

  const pick = (p) => {
    setOpen(false);
    navigate(`/produto/${p.slug}`);
    onDone?.();
  };

  return (
    <div className="search" ref={wrap}>
      <form onSubmit={submit} role="search">
        <input
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar whey, creatina, marca…"
          aria-label="Buscar produtos"
          autoFocus={autoFocus}
          enterKeyHint="search"
        />
        <button type="submit" aria-label="Buscar"><Icon name="search" size={20} /></button>
      </form>
      {open && q.trim().length >= 2 && (
        <div className="search__panel">
          {suggestions.length ? (
            <>
              {suggestions.map((p) => (
                <button key={p.id} className="search__item" onClick={() => pick(p)}>
                  <span className="search__thumb"><ProductImage product={p} /></span>
                  <span className="search__info">
                    <span>{p.name}</span>
                    <small>{p.brand || ''}</small>
                  </span>
                  <strong>{brl(p.price)}</strong>
                </button>
              ))}
              <button className="search__all" onClick={submit}>Ver todos os resultados</button>
            </>
          ) : (
            <p className="search__none">Nenhum produto encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
