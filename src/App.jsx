import { useRoute } from './hooks/useRoute';
import { ANNOUNCE } from './config/store';
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import Cart from './components/Cart';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Toast from './components/Toast';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import Home from './pages/Home';
import Products from './pages/Products';

function Page({ route }) {
  const { path } = route;
  if (path === '/produtos') return <Products route={route} />;
  if (path === '/ofertas') return <Products route={route} offers />;
  if (path.startsWith('/produto/')) return <ProductDetail slug={decodeURIComponent(path.slice(9))} />;
  if (path === '/checkout') return <Checkout />;
  if (path === '/pedido') return <OrderSuccess />;
  return <Home />;
}

export default function App() {
  const route = useRoute();
  return (
    <>
      <button className="skip" onClick={() => document.getElementById('conteudo')?.focus()}>Pular para o conteúdo</button>
      <div className="announce"><div className="container">{ANNOUNCE.map((t) => <span key={t}>{t}</span>)}</div></div>
      <Header route={route} />
      <main id="conteudo" tabIndex={-1}>
        <Page route={route} />
      </main>
      <Footer />
      <MobileMenu />
      <Cart />
      <Toast />
      <WhatsAppButton />
    </>
  );
}
