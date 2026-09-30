import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { navigate } from '../hooks/useRoute';
import { categories } from '../data/categories';
import { whatsappLink } from '../utils/whatsapp';
import { Icon, WhatsAppIcon } from './Icons';
import { NAV } from './Header';
import Logo from './Logo';

export default function MobileMenu() {
  const { menuOpen, setMenuOpen } = useStore();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, setMenuOpen]);

  const go = (fn) => { setMenuOpen(false); setTimeout(fn, 10); };

  return (
    <>
      <div className={`overlay ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`drawer drawer--left ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen} aria-label="Menu">
        <div className="drawer__head drawer__head--dark">
          <Logo />
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><Icon name="close" /></button>
        </div>
        <nav className="menu">
          {NAV.map((item) => (
            <button key={item.label} className="menu__link" onClick={() => go(item.go)}>
              {item.label}
              <Icon name="chevronRight" size={18} />
            </button>
          ))}
          <div className="menu__cats">
            {categories.map((c) => (
              <button key={c.id} onClick={() => go(() => navigate(`/produtos?cat=${c.id}`))}>
                <Icon name={c.icon} size={18} /> {c.name}
              </button>
            ))}
          </div>
        </nav>
        <a className="btn btn--wa btn--block menu__wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={20} /> Falar no WhatsApp
        </a>
      </aside>
    </>
  );
}
