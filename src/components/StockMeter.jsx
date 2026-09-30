import { getStockStatus } from '../utils/stock';

/** Indicador de estoque em "degraus" (kaizen: evolução passo a passo). */
export default function StockMeter({ stock }) {
  const s = getStockStatus(stock);
  return (
    <div className={`stock stock--${s.level}`}>
      <span className="stock__steps" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <i key={i} className={i <= s.steps ? 'on' : ''} />
        ))}
      </span>
      <span className="stock__text">{s.level === 'out' ? s.label : s.detail}</span>
    </div>
  );
}
