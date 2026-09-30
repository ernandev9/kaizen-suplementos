import { ANNOUNCE } from '../config/store';

export default function Ticker() {
  const items = [...ANNOUNCE, ...ANNOUNCE, ...ANNOUNCE, ...ANNOUNCE];
  return (
    <div className="ticker" aria-label="Condições da loja">
      <div className="ticker__track">
        {items.map((t, i) => (
          <span key={i} aria-hidden={i >= ANNOUNCE.length}>{t}<i>改善</i></span>
        ))}
      </div>
    </div>
  );
}
