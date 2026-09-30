import { STORE } from '../config/store';
import { brl } from './format';

export const whatsappLink = (message = STORE.whatsappDefaultMessage) =>
  `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;

export const productMessage = (product, qty = 1) =>
  `Olá! Tenho interesse no produto:\n${product.name}\n\nQuantidade: ${qty}`;

export function orderMessage(order) {
  const lines = order.items.map((i) => `• ${i.qty}x ${i.name} — ${brl(i.price * i.qty)}`);
  const c = order.customer;
  return [
    `Olá! Acabei de fazer o pedido ${order.id} no site.`,
    '',
    ...lines,
    '',
    `Subtotal: ${brl(order.totals.subtotal)}`,
    `Frete: ${order.totals.shipping ? brl(order.totals.shipping) : 'Grátis'}`,
    `Total: ${brl(order.totals.total)}`,
    `Pagamento: ${order.paymentLabel}`,
    '',
    `Nome: ${c.name}`,
    `Entrega: ${c.address}, ${c.number}${c.complement ? ` (${c.complement})` : ''} — ${c.district}, ${c.city}/${c.state} — CEP ${c.cep}`,
  ].join('\n');
}
