import { useStore } from '../context/StoreContext';
import { navigate } from '../hooks/useRoute';
import { categories } from '../data/categories';
import { whatsappLink } from '../utils/whatsapp';
import { hasDiscount, discountPercent } from '../utils/format';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import Method, { Trust } from '../components/Benefits';
import Faq from '../components/Faq';
import { Icon, WhatsAppIcon } from '../components/Icons';

export default function Home() {
  const { products, loading } = useStore();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const offers = products
    .filter((p) => hasDiscount(p) && p.stock > 0 && !p.featured)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 4);
  const sampleOf = (id) => products.find((p) => p.category === id && p.stock > 0) || products.find((p) => p.category === id);

  return (
    <>
      <Hero />
      <Ticker />
      <Trust />

      <section className="section container" id="categorias">
        <div className="section__head">
          <div>
            <p className="eyebrow eyebrow--dark"><i /> Explore</p>
            <h2 className="h-display">Compre por categoria</h2>
          </div>
        </div>
        <div className="cats">
          {categories.map((c, i) => (
            <CategoryCard
              key={c.id}
              index={i}
              category={c}
              sample={sampleOf(c.id)}
              count={loading ? null : products.filter((p) => p.category === c.id).length}
              onClick={() => navigate(`/produtos?cat=${c.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <div>
            <p className="eyebrow eyebrow--dark"><i /> Seleção da casa</p>
            <h2 className="h-display">Destaques</h2>
          </div>
          <button className="link-arrow" onClick={() => navigate('/produtos')}>Ver todos <Icon name="arrowRight" size={18} /></button>
        </div>
        {loading ? <p className="muted">Carregando produtos…</p> : <ProductGrid products={featured} />}
      </section>

      {offers.length > 0 && (
        <section className="offers">
          <div className="container">
            <div className="section__head section__head--light">
              <div>
                <p className="eyebrow"><i /> Preço baixo</p>
                <h2 className="h-display">Ofertas</h2>
              </div>
              <button className="link-arrow link-arrow--light" onClick={() => navigate('/ofertas')}>Ver todas <Icon name="arrowRight" size={18} /></button>
            </div>
            <ProductGrid products={offers} dark />
          </div>
        </section>
      )}

      <Method />
      <Faq />

      <section className="container">
        <div className="wa-band">
          <div>
            <p className="eyebrow"><i /> Atendimento humano</p>
            <h2 className="h-display">Não sabe qual<br />suplemento escolher?</h2>
            <p>Conte seu objetivo e sua rotina de treino. A gente indica e monta o pedido com você.</p>
          </div>
          <a className="btn btn--wa btn--lg" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={22} /> Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
