import ProductCard from './ProductCard';

export default function ProductGrid({ products, dark = false, emptyMessage = 'Nenhum produto encontrado.', emptyAction }) {
  if (!products.length) {
    return (
      <div className="empty">
        <p>{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} dark={dark} />
      ))}
    </div>
  );
}
