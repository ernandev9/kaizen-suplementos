import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { navigate, scrollToId } from '../hooks/useRoute';
import { categories } from '../data/categories';
import { whatsappLink } from '../utils/whatsapp';
import { Icon, WhatsAppIcon } from './Icons';
import Logo from './Logo';
import Search from './Search';

export const NAV = [
  { label: 'Início', go: () => navigate('/') },
  { label: 'Produtos', go: () => navigate('/produtos') },
  { label: 'Categorias', go: () => navigate('/', { scrollTo: 'categorias' }), hasMenu: true },
  { label: 'Ofertas', go: () => navigate('/ofertas') },
  { label: 'Contato', go: () => scrollToId('contato') },
];

export default function Header({ route }) {
  const { count, setCartOpen, setMenuOpen } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);

  const isActive = (label) =>
    (label === 'Início' && route.path === '/') ||
    (label === 'Produtos' && route.path === '/produtos') ||
    (label === 'Ofertas' && route.path === '/ofertas');

  return (
    <header className="header">
      <div className="header__bar container">
        <button className="icon-btn header__menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
          <Icon name="menu" size={26} />
        </button>

        <a href="#/" className="header__logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <Logo />
        </a>

        <div className="header__search"><Search initial={route.query.q || ''} /></div>

        <div className="header__actions">
          <button className="icon-btn header__search-toggle" onClick={() => setSearchOpen((v) => !v)} aria-label="Buscar" aria-expanded={searchOpen}>
            <Icon name={searchOpen ? 'close' : 'search'} size={24} />
          </button>
          <a className="header__wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={20} /> <span>WhatsApp</span>
          </a>
          <button className="icon-btn header__cart" onClick={() => setCartOpen(true)} aria-label={`Carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}>
            <Icon name="cart" size={26} />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="header__mobile-search container">
          <Search initial={route.query.q || ''} autoFocus onDone={() => setSearchOpen(false)} />
        </div>
      )}

      <nav className="nav" aria-label="Principal">
        <div className="container nav__inner">
          {NAV.map((item) =>
            item.hasMenu ? (
              <div className="nav__drop" key={item.label} onMouseLeave={() => setCatsOpen(false)}>
                <button className="nav__link" aria-expanded={catsOpen} onClick={() => setCatsOpen((v) => !v)} onMouseEnter={() => setCatsOpen(true)}>
                  {item.label} <Icon name="chevronDown" size={16} />
                </button>
                {catsOpen && (
                  <div className="nav__menu">
                    {categories.map((c) => (
                      <button key={c.id} onClick={() => { setCatsOpen(false); navigate(`/produtos?cat=${c.id}`); }}>
                        <Icon name={c.icon} size={18} /> {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button key={item.label} className={`nav__link ${isActive(item.label) ? 'is-active' : ''}`} onClick={item.go}>
                {item.label}
              </button>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
