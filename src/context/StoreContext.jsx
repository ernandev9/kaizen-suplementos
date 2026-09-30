import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchProducts } from '../services/productService';
import { calcShipping } from '../services/shippingService';

const StoreContext = createContext(null);
const CART_KEY = 'kaizen:cart';

const readCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(readCart); // [{ id, qty }]
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const toastTimer = useRef();

  useEffect(() => {
    fetchProducts().then((list) => {
      setProducts(list);
      setLoading(false);
    });
  }, []);

  // fecha avisos e o carrinho ao trocar de página
  useEffect(() => {
    const onNav = () => { setToast(null); setCartOpen(false); setMenuOpen(false); };
    window.addEventListener('hashchange', onNav);
    return () => window.removeEventListener('hashchange', onNav);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* armazenamento indisponível: o carrinho segue em memória */
    }
  }, [cart]);

  const byId = useMemo(() => Object.fromEntries(products.map((p) => [String(p.id), p])), [products]);
  const getProduct = useCallback((id) => byId[String(id)], [byId]);

  const showToast = useCallback((message, action) => {
    clearTimeout(toastTimer.current);
    setToast({ message, action, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const qtyInCart = useCallback((id) => cart.find((i) => String(i.id) === String(id))?.qty || 0, [cart]);

  /** Adiciona respeitando o estoque. Retorna quantas unidades entraram de fato. */
  const addToCart = useCallback(
    (id, qty = 1) => {
      const p = byId[String(id)];
      if (!p || p.stock <= 0) return 0;
      const current = qtyInCart(id);
      const allowed = Math.max(0, Math.min(qty, p.stock - current));
      if (allowed === 0) {
        showToast(`Você já tem todo o estoque de ${p.name} no carrinho.`);
        return 0;
      }
      setCart((c) =>
        current ? c.map((i) => (String(i.id) === String(id) ? { ...i, qty: i.qty + allowed } : i)) : [...c, { id: p.id, qty: allowed }]
      );
      return allowed;
    },
    [byId, qtyInCart, showToast]
  );

  const setQty = useCallback(
    (id, qty) => {
      const p = byId[String(id)];
      if (!p) return;
      const n = Math.max(1, Math.min(qty, p.stock));
      setCart((c) => c.map((i) => (String(i.id) === String(id) ? { ...i, qty: n } : i)));
    },
    [byId]
  );

  const removeFromCart = useCallback((id) => setCart((c) => c.filter((i) => String(i.id) !== String(id))), []);
  const clearCart = useCallback(() => setCart([]), []);

  // Itens do carrinho com dados do produto (e ajustados caso o estoque tenha mudado)
  const items = useMemo(
    () =>
      cart
        .map((i) => {
          const p = byId[String(i.id)];
          if (!p || p.stock <= 0) return null;
          return { ...p, qty: Math.min(i.qty, p.stock) };
        })
        .filter(Boolean),
    [cart, byId]
  );

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  /** Chamado quando um pedido é concluído: baixa o estoque local e limpa o carrinho. */
  const completeOrder = useCallback((order) => {
    setProducts((list) =>
      list.map((p) => {
        const item = order.items.find((i) => String(i.id) === String(p.id));
        return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
      })
    );
    setLastOrder(order);
    setCart([]);
  }, []);

  const value = {
    products, loading, getProduct,
    items, count, subtotal, shipping, total, qtyInCart,
    addToCart, setQty, removeFromCart, clearCart,
    cartOpen, setCartOpen, menuOpen, setMenuOpen,
    toast, showToast, lastOrder, completeOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
