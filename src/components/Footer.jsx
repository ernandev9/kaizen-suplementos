import { STORE, OFFER } from '../config/store';
import { navigate } from '../hooks/useRoute';
import { categories } from '../data/categories';
import { whatsappLink } from '../utils/whatsapp';
import { Icon, WhatsAppIcon } from './Icons';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" id="contato">
      <div className="footer__top container">
        <div>
          <h2 className="h-display">Evolua um<br />passo por vez.</h2>
        </div>
        <a className="btn btn--lime btn--lg" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={22} /> Chamar no WhatsApp
        </a>
      </div>

      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo full />
          <p>{STORE.tagline}</p>
          <a href={STORE.instagramUrl} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={18} /> {STORE.instagramHandle}</a>
        </div>
        <nav aria-label="Categorias">
          <h3>Categorias</h3>
          {categories.map((c) => (
            <button key={c.id} onClick={() => navigate(`/produtos?cat=${c.id}`)}>{c.name}</button>
          ))}
        </nav>
        <nav aria-label="Loja">
          <h3>Loja</h3>
          <button onClick={() => navigate('/produtos')}>Todos os produtos</button>
          <button onClick={() => navigate('/ofertas')}>Ofertas</button>
          <button onClick={() => navigate('/', { scrollTo: 'duvidas' })}>Dúvidas frequentes</button>
        </nav>
        <div>
          <h3>Contato</h3>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18} /> WhatsApp</a>
          <a href={`mailto:${STORE.email}`}><Icon name="mail" size={18} /> {STORE.email}</a>
          <h3 className="footer__pay-title">Pagamento</h3>
          <div className="footer__pay">
            <span><Icon name="pix" size={16} /> PIX</span>
            <span><Icon name="card" size={16} /> Cartão {OFFER.installments ? `${OFFER.installments}x` : ''}</span>
          </div>
        </div>
      </div>

      <div className="container footer__legal">
        <p>© {year} {STORE.legalName} · CNPJ {STORE.cnpj} · {STORE.city}</p>
        <p>Suplementos alimentares não substituem uma alimentação equilibrada. Consulte um nutricionista ou médico antes de usar. Preços e estoque sujeitos a alteração sem aviso.</p>
      </div>
    </footer>
  );
}
