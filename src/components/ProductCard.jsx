import { useStore } from '../context/StoreContext';
import { navigate } from '../hooks/useRoute';
import { categoriesById } from '../data/categories';
import { discountPercent } from '../utils/format';
import { getStockStatus } from '../utils/stock';
import { Icon } from './Icons';
import ProductImage from './ProductImage';
import Price from './Price';

export default function ProductCard({ product, dark = false }) {
  const { addToCart, setCartOpen, showToast } = useStore();
  const soldOut = product.stock <= 0;
  const off = discountPercent(product);
  const status = getStockStatus(product.stock);
  const open = () => navigate(`/produto/${product.slug}`);

  const add = () => {
    if (addToCart(product.id, 1)) showToast('Adicionado ao carrinho', { label: 'Ver carrinho', onClick: () => setCartOpen(true) });
  };

  return (
    <article className={`card ${soldOut ? 'card--out' : ''} ${dark ? 'card--dark' : ''}`}>
      <a href={`#/produto/${product.slug}`} className="card__media" onClick={(e) => { e.preventDefault(); open(); }}>
        <span className="card__tags">
          {off > 0 && !soldOut && <span className="tag tag--off">-{off}%</span>}
          {status.level === 'low' && <span className="tag tag--low">Últimas {product.stock}</span>}
          {soldOut && <span className="tag tag--out">Esgotado</span>}
        </span>
        <ProductImage product={product} />
      </a>
      <div className="card__body">
        <span className="card__cat">{categoriesById[product.category]?.short} · {product.brand}</span>
        <a href={`#/produto/${product.slug}`} className="card__name" onClick={(e) => { e.preventDefault(); open(); }}>
          {product.name}
        </a>
        <Price product={product} />
        <button className="btn btn--primary btn--block card__buy" onClick={add} disabled={soldOut}>
          <Icon name="cartPlus" size={18} /> {soldOut ? 'Indisponível' : 'Adicionar'}
        </button>
      </div>
    </article>
  );
}
