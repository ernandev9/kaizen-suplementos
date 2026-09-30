import { brl, discountPercent, hasDiscount, installment, pixPrice } from '../utils/format';
import { OFFER } from '../config/store';

export default function Price({ product, large = false, compact = false }) {
  const off = discountPercent(product);
  const pix = pixPrice(product);
  const inst = installment(product);
  return (
    <div className={`price ${large ? 'price--lg' : ''}`}>
      {hasDiscount(product) && <s className="price__old">{brl(product.oldPrice)}</s>}
      <div className="price__row">
        <strong className="price__now">{brl(product.price)}</strong>
        {off > 0 && large && <span className="price__off">-{off}%</span>}
      </div>
      {!compact && pix && (
        <span className="price__pix"><b>{brl(pix)}</b> no PIX <em>{OFFER.pixDiscount}% off</em></span>
      )}
      {!compact && inst && <span className="price__inst">ou {inst.n}x de {brl(inst.value)} sem juros</span>}
    </div>
  );
}
