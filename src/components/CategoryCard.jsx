import { Icon } from './Icons';
import ProductImage from './ProductImage';

export default function CategoryCard({ category, count, sample, onClick, index }) {
  return (
    <button className="cat" onClick={onClick}>
      <span className="cat__num">{String(index + 1).padStart(2, '0')}</span>
      <span className="cat__art" aria-hidden="true">{sample && <ProductImage product={sample} />}</span>
      <span className="cat__text">
        <span className="cat__name">{category.name}</span>
        <span className="cat__blurb">{category.blurb}</span>
        <span className="cat__go">
          {count != null && <>{count} {count === 1 ? 'produto' : 'produtos'}</>}
          <Icon name="arrowRight" size={18} />
        </span>
      </span>
    </button>
  );
}
