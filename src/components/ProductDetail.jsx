import { useEffect, useState } from 'react';
import { brl, sizeOf } from '../utils/format';
import { useStore } from '../context/StoreContext';
import { navigate } from '../hooks/useRoute';
import { categoriesById } from '../data/categories';
import { productMessage, whatsappLink } from '../utils/whatsapp';
import { Icon, WhatsAppIcon } from './Icons';
import ProductImage from './ProductImage';
import Price from './Price';
import StockMeter from './StockMeter';
import QuantityStepper from './QuantityStepper';
import ProductGrid from './ProductGrid';

export default function ProductDetail({ slug }) {
  const { products, loading, addToCart, qtyInCart, showToast, setCartOpen } = useStore();
  const product = products.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');

  useEffect(() => { setQty(1); setTab('desc'); }, [slug]);

  if (loading) return <div className="container page"><p className="muted">Carregando…</p></div>;
  if (!product) {
    return (
      <div className="container page empty">
        <p>Produto não encontrado.</p>
        <button className="btn btn--primary" onClick={() => navigate('/produtos')}>Ver todos os produtos</button>
      </div>
    );
  }

  const inCart = qtyInCart(product.id);
  const available = Math.max(0, product.stock - inCart);
  const soldOut = product.stock <= 0;
  const max = Math.max(1, available);
  const cat = categoriesById[product.category];
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const add = () => {
    const added = addToCart(product.id, qty);
    if (added) showToast(`${added} ${added === 1 ? 'unidade adicionada' : 'unidades adicionadas'} ao carrinho`, { label: 'Ver carrinho', onClick: () => setCartOpen(true) });
    setQty(1);
  };
  const buyNow = () => {
    if (inCart >= product.stock || addToCart(product.id, qty)) navigate('/checkout');
  };

  return (
    <div className="container page pd">
      <nav className="crumbs" aria-label="Você está em">
        <button onClick={() => navigate('/produtos')}><Icon name="arrowLeft" size={18} /> Produtos</button>
        {cat && <><span>/</span><button onClick={() => navigate(`/produtos?cat=${cat.id}`)}>{cat.name}</button></>}
      </nav>

      <div className="pd__grid">
        <div className="pd__media">
          <ProductImage product={product} />
          {soldOut && <span className="card__soldout">Esgotado</span>}
        </div>

        <div className="pd__info">
          <span className="pd__brand">{[cat?.name, product.brand].filter(Boolean).join(' · ')}{sizeOf(product) && <em>{sizeOf(product)}</em>}</span>
          <h1 className="pd__name">{product.name}</h1>
          <Price product={product} large />
          <StockMeter stock={product.stock} />

          {!soldOut && (
            <div className="pd__qty">
              <span>Quantidade</span>
              <QuantityStepper value={Math.min(qty, max)} max={max} onChange={(n) => setQty(Math.max(1, Math.min(n, max)))} />
              {inCart > 0 && <span className="muted small">{inCart} no carrinho</span>}
            </div>
          )}

          <div className="pd__actions">
            <button className="btn btn--primary btn--lg btn--block" onClick={buyNow} disabled={soldOut}>
              {soldOut ? 'Esgotado' : 'Comprar agora'}
            </button>
            <button className="btn btn--outline btn--lg btn--block" onClick={add} disabled={soldOut || available === 0}>
              <Icon name="cartPlus" size={20} /> {available === 0 && !soldOut ? 'Estoque todo no carrinho' : 'Adicionar ao carrinho'}
            </button>
            <a className="btn btn--wa btn--lg btn--block" href={whatsappLink(productMessage(product, soldOut ? 1 : Math.min(qty, max)))} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={20} /> {soldOut ? 'Avise-me pelo WhatsApp' : 'Comprar pelo WhatsApp'}
            </a>
          </div>
          <ul className="pd__perks">
            <li><Icon name="truck" size={20} /> Frete grátis acima de R$ 299</li>
            <li><Icon name="shield" size={20} /> Troca em até 7 dias</li>
            <li><Icon name="chat" size={20} /> Atendimento humano no WhatsApp</li>
          </ul>
        </div>
      </div>

      <section className="pd__tabs">
        <div className="tabs" role="tablist">
          {[['desc', 'Descrição'], ['uso', 'Como usar'], ['info', 'Informações']].map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'is-on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        <div className="tabs__panel" role="tabpanel">
          {tab === 'desc' && <p>{product.description}</p>}
          {tab === 'uso' && <p>{cat?.usage}</p>}
          {tab === 'info' && (
            <dl>
              {product.brand && <div><dt>Marca</dt><dd>{product.brand}</dd></div>}
              <div><dt>Categoria</dt><dd>{cat?.name}</dd></div>
              {sizeOf(product) && <div><dt>Conteúdo</dt><dd>{sizeOf(product)}</dd></div>}
              <div><dt>Disponibilidade</dt><dd>{soldOut ? 'Esgotado' : product.stock <= 10 ? 'Últimas unidades' : 'Em estoque'}</dd></div>
            </dl>
          )}
        </div>
      </section>

      {!soldOut && (
        <div className="buybar">
          <div><span>{product.name}</span><strong>{brl(product.price)}</strong></div>
          <button className="btn btn--primary" onClick={buyNow}>Comprar</button>
        </div>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="section__head"><h2>Você também pode gostar</h2></div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
