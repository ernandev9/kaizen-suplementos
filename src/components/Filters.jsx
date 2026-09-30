import { useState } from 'react';
import { categories } from '../data/categories';
import { PRICE_RANGES } from '../utils/search';
import { Icon } from './Icons';

function FilterFields({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="filters__fields">
      <fieldset>
        <legend>Categoria</legend>
        <div className="chips">
          <button className={`chip ${!value.cat ? 'is-on' : ''}`} onClick={() => set('cat', '')}>Todas</button>
          {categories.map((c) => (
            <button key={c.id} className={`chip ${value.cat === c.id ? 'is-on' : ''}`} onClick={() => set('cat', value.cat === c.id ? '' : c.id)}>
              {c.short}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Faixa de preço</legend>
        <div className="chips">
          {PRICE_RANGES.map((r) => (
            <button key={r.id} className={`chip ${value.price === r.id ? 'is-on' : ''}`} onClick={() => set('price', value.price === r.id ? '' : r.id)}>
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Disponibilidade</legend>
        <label className="switch">
          <input type="checkbox" checked={!!value.disp} onChange={(e) => set('disp', e.target.checked ? '1' : '')} />
          <span>Somente em estoque</span>
        </label>
      </fieldset>
    </div>
  );
}

const countActive = (v) => ['cat', 'price', 'disp'].filter((k) => v[k]).length;
const cleared = (v) => ({ ...v, cat: '', price: '', disp: '' });

/** Coluna lateral de filtros (desktop). */
export function FilterSidebar({ value, onChange }) {
  return (
    <aside className="filters--side" aria-label="Filtros">
      <FilterFields value={value} onChange={onChange} />
      {countActive(value) > 0 && <button className="link" onClick={() => onChange(cleared(value))}>Limpar filtros</button>}
    </aside>
  );
}

/** Botão "Filtros" + painel inferior (mobile). */
export default function Filters({ value, onChange, resultCount }) {
  const [open, setOpen] = useState(false);
  const active = countActive(value);
  return (
    <>
      <button className="btn btn--outline filters__toggle" onClick={() => setOpen(true)}>
        <Icon name="filter" size={18} /> Filtros{active > 0 && <span className="badge badge--inline">{active}</span>}
      </button>
      <div className={`overlay ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
      <div className={`sheet ${open ? 'is-open' : ''}`} role="dialog" aria-label="Filtros" aria-hidden={!open}>
        <div className="drawer__head">
          <h2>Filtros</h2>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Fechar filtros"><Icon name="close" /></button>
        </div>
        <div className="sheet__body"><FilterFields value={value} onChange={onChange} /></div>
        <div className="sheet__foot">
          <button className="btn btn--ghost" onClick={() => onChange(cleared(value))}>Limpar</button>
          <button className="btn btn--primary" onClick={() => setOpen(false)}>Ver {resultCount} {resultCount === 1 ? 'produto' : 'produtos'}</button>
        </div>
      </div>
    </>
  );
}
