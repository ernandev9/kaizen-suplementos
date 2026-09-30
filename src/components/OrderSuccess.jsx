import { useStore } from '../context/StoreContext';
import { navigate } from '../hooks/useRoute';
import { brl } from '../utils/format';
import { orderMessage, whatsappLink } from '../utils/whatsapp';
import { Icon, WhatsAppIcon } from './Icons';

export default function OrderSuccess() {
  const { lastOrder: order } = useStore();
  if (!order) {
    return (
      <div className="container page empty">
        <p>Nenhum pedido recente.</p>
        <button className="btn btn--primary" onClick={() => navigate('/produtos')}>Ver produtos</button>
      </div>
    );
  }
  const firstName = order.customer.name.split(' ')[0];
  return (
    <div className="container page success">
      <span className="success__icon"><Icon name="check" size={34} strokeWidth={2.4} /></span>
      <h1>Pedido {order.id} recebido</h1>
      <p>Obrigado, {firstName}! Para concluir, envie o pedido pelo WhatsApp. Respondemos com os dados de pagamento ({order.paymentLabel}) e o prazo de entrega.</p>
      <a className="btn btn--wa btn--lg" href={whatsappLink(orderMessage(order))} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon size={22} /> Enviar pedido pelo WhatsApp
      </a>
      <section className="panel success__summary">
        <ul className="summary__list">
          {order.items.map((i) => (
            <li key={i.id}><span className="summary__name">{i.qty}× {i.name}</span><strong>{brl(i.price * i.qty)}</strong></li>
          ))}
        </ul>
        <dl className="totals">
          <div><dt>Frete</dt><dd>{order.totals.shipping ? brl(order.totals.shipping) : 'Grátis'}</dd></div>
          <div className="totals__total"><dt>Total</dt><dd>{brl(order.totals.total)}</dd></div>
        </dl>
      </section>
      <button className="btn btn--ghost" onClick={() => navigate('/')}>Voltar à loja</button>
    </div>
  );
}
