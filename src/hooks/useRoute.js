import { useEffect, useState } from 'react';

/**
 * Roteador simples por hash (#/produtos?cat=whey).
 * Funciona em qualquer hospedagem estática sem configuração de servidor.
 */
function parse() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, search = ''] = raw.split('?');
  return { path: path || '/', query: Object.fromEntries(new URLSearchParams(search)) };
}

export function navigate(to, { scrollTo } = {}) {
  const target = to.startsWith('#') ? to : `#${to}`;
  if (window.location.hash === target || (target === '#/' && !window.location.hash)) {
    if (scrollTo) scrollToId(scrollTo);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  pendingScroll = scrollTo || null;
  window.location.hash = target;
}

let pendingScroll = null;

export function scrollToId(id) {
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

export function buildQuery(params) {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null && v !== false));
  const s = new URLSearchParams(clean).toString();
  return s ? `?${s}` : '';
}

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      if (pendingScroll) {
        const id = pendingScroll;
        pendingScroll = null;
        setTimeout(() => scrollToId(id), 30);
      } else {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
