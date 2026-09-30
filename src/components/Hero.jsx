import { HERO } from '../config/store';
import { useStore } from '../context/StoreContext';
import { navigate } from '../hooks/useRoute';
import { brl } from '../utils/format';
import ProductImage from './ProductImage';

export default function Hero() {
  const { products } = useStore();
  const stage = ['whey-protein-concentrado-900g', 'creatina-monohidratada-300g', 'pre-treino-ignite-300g']
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean);
  const from = products.filter((p) => p.stock > 0).reduce((m, p) => Math.min(m, p.price), Infinity);

  return (
    <section className="hero" style={HERO.image ? { '--hero-img': `url(${HERO.image})` } : undefined}>
      <span className="hero__kanji" aria-hidden="true">改善</span>
      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="eyebrow"><i /> Kaizen · melhoria contínua</p>
          <h1 className="hero__title">
            {HERO.title.split(' ').map((w, i) => <span key={i}>{w}</span>)}
          </h1>
          <p className="hero__sub">{HERO.subtitle}</p>
          <div className="hero__cta">
            <button className="btn btn--lime btn--lg" onClick={() => navigate('/produtos')}>{HERO.cta}</button>
            <button className="btn btn--line btn--lg" onClick={() => navigate('/ofertas')}>Ver ofertas</button>
          </div>
          {Number.isFinite(from) && <p className="hero__from">Produtos a partir de <b>{brl(from)}</b></p>}
        </div>

        {stage.length > 0 && (
          <div className="hero__stage" aria-hidden="true">
            <span className="hero__slab" />
            {stage.map((p, i) => (
              <button key={p.id} tabIndex={-1} className={`hero__pack hero__pack--${i + 1}`} onClick={() => navigate(`/produto/${p.slug}`)}>
                <ProductImage product={p} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
