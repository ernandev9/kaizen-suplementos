import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { navigate } from '../hooks/useRoute';
import { missingForFreeShipping } from '../services/shippingService';
import { SHIPPING } from '../config/store';
import { brl } from '../utils/format';
import { Icon } from './Icons';
import ProductImage from './ProductImage';
import QuantityStepper from './QuantityStepper';

export default function Cart() {
  const { cartOpen, setCartOpen, items, count, subtotal, shipping, total, setQty, removeFromCart } = useStore();
  const missing = missingForFreeShipping(subtotal);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('no-scroll'); };
  }, [cartOpen, setCartOpen]);

  const close = () => setCartOpen(false);
  const checkout = () => { close(); navigate('/checkout'); };

  return (
    <>
      <div className={`overlay ${cartOpen ? 'is-open' : ''}`} onClick={close} />
      <aside className={`drawer drawer--right cart ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen} aria-label="Carrinho">
        <div className="drawer__head">
          <h2>Carrinho {count > 0 && <span className="muted">({count})</span>}</h2>
          <button className="icon-btn" onClick={close} aria-label="Fechar carrinho"><Icon name="close" /></button>
        </div>

        {!items.length ? (
          <div className="cart__empty">
            <Icon name="cart" size={40} strokeWidth={1.4} />
            <p>Seu carrinho está vazio.</p>
            <button className="btn btn--primary" onClick={() => { close(); navigate('/produtos'); }}>Ver produtos</button>
          </div>
        ) : (
          <>
            {missing !== null && (
              <div className="freebar">
                <p>{missing > 0 ? <>Faltam <strong>{brl(missing)}</strong> para frete grátis</> : <strong>Você ganhou frete grátis</strong>}</p>
                <span className="freebar__track"><span style={{ width: `${Math.min(100, (subtotal / SHIPPING.freeAbove) * 100)}%` }} /></span>
              </div>
            )}
            <ul className="cart__list">
              {items.map((i) => (
                <li key={i.id} className="cart__item">
                  <button className="cart__thumb" onClick={() => { close(); navigate(`/produto/${i.slug}`); }} aria-label={i.name}>
                    <ProductImage product={i} />
                  </button>
                  <div className="cart__info">
                    <span className="cart__name">{i.name}</span>
                    <span className="muted small">{brl(i.price)} cada{i.qty >= i.stock ? ' · máximo em estoque' : ''}</span>
                    <div className="cart__row">
                      <QuantityStepper size="sm" value={i.qty} max={i.stock} onChange={(n) => setQty(i.id, n)} />
                      <strong>{brl(i.price * i.qty)}</strong>
                    </div>
                  </div>
                  <button className="icon-btn cart__remove" onClick={() => removeFromCart(i.id)} aria-label={`Remover ${i.name}`}>
                    <Icon name="trash" size={19} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart__foot">
              <dl className="totals">
                <div><dt>Subtotal</dt><dd>{brl(subtotal)}</dd></div>
                <div><dt>Frete</dt><dd>{shipping ? brl(shipping) : 'Grátis'}</dd></div>
                <div className="totals__total"><dt>Total</dt><dd>{brl(total)}</dd></div>
              </dl>
              <button className="btn btn--primary btn--block btn--lg" onClick={checkout}>Finalizar compra</button>
              <button className="btn btn--ghost btn--block" onClick={close}>Continuar comprando</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
