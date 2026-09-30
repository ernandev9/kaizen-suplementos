import { PAYMENT } from '../config/store';
import { reserveStock } from './productService';

/**
 * PAGAMENTO
 * Ponto único de integração com gateway (Mercado Pago, Pagar.me, Stripe, Asaas...).
 *
 * Com PAYMENT.gatewayEnabled = false (padrão), o pedido é registrado e o cliente
 * confirma o pagamento pelo WhatsApp (a loja envia a chave PIX ou link de pagamento).
 *
 * Para integrar:
 *  1. Crie uma rota no seu backend que gere a cobrança (nunca coloque a chave secreta do gateway no front).
 *  2. Em createPayment, chame essa rota e devolva { status, pixQrCode, pixCopyPaste, checkoutUrl }.
 *  3. Mude PAYMENT.gatewayEnabled para true em src/config/store.js.
 *  Dados de cartão devem ser capturados pelo componente/SDK do próprio gateway, não por campos do site.
 */

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const getPaymentMethods = () => PAYMENT.methods.filter((m) => m.enabled);

export async function createOrder({ customer, items, totals, paymentMethod }) {
  await reserveStock(items);
  const method = PAYMENT.methods.find((m) => m.id === paymentMethod);
  const order = {
    id: `KZ${Date.now().toString(36).toUpperCase().slice(-6)}`,
    createdAt: new Date().toISOString(),
    customer,
    items,
    totals,
    paymentMethod,
    paymentLabel: method?.label || paymentMethod,
  };
  order.payment = await createPayment(order);
  return order;
}

export async function createPayment(order) {
  await wait(600);
  if (!PAYMENT.gatewayEnabled) {
    return { status: 'awaiting_whatsapp', provider: 'manual' };
  }
  // TODO: integração real
  // const res = await fetch('/api/payments', { method: 'POST', body: JSON.stringify(order) });
  // return await res.json();
  throw new Error('Gateway de pagamento ainda não configurado.');
}
