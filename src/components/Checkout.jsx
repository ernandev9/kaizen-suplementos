import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { navigate } from '../hooks/useRoute';
import { createOrder, getPaymentMethods } from '../services/paymentService';
import { lookupCep } from '../services/shippingService';
import { brl, maskCep, maskPhone, onlyDigits } from '../utils/format';
import { Icon } from './Icons';
import ProductImage from './ProductImage';

const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
const EMPTY = { name: '', phone: '', email: '', cep: '', address: '', number: '', complement: '', district: '', city: '', state: '' };
const PAY_ICON = { pix: 'pix', card: 'card', cash: 'cash' };

function validate(f) {
  const e = {};
  if (f.name.trim().split(/\s+/).length < 2) e.name = 'Informe nome e sobrenome.';
  if (onlyDigits(f.phone).length < 10) e.phone = 'Informe o WhatsApp com DDD.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Informe um e-mail válido.';
  if (onlyDigits(f.cep).length !== 8) e.cep = 'O CEP tem 8 números.';
  if (!f.address.trim()) e.address = 'Informe o endereço.';
  if (!f.number.trim()) e.number = 'Informe o número (ou S/N).';
  if (!f.district.trim()) e.district = 'Informe o bairro.';
  if (!f.city.trim()) e.city = 'Informe a cidade.';
  if (!f.state) e.state = 'Selecione o estado.';
  return e;
}

function Field({ id, label, error, className = '', children }) {
  return (
    <label className={`field ${error ? 'has-error' : ''} ${className}`} htmlFor={id}>
      <span>{label}</span>
      {children}
      {error && <small className="field__error">{error}</small>}
    </label>
  );
}

export default function Checkout() {
  const { items, subtotal, shipping, total, completeOrder } = useStore();
  const methods = getPaymentMethods();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState(methods[0]?.id);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState('');

  if (!items.length) {
    return (
      <div className="container page empty">
        <p>Seu carrinho está vazio.</p>
        <button className="btn btn--primary" onClick={() => navigate('/produtos')}>Ver produtos</button>
      </div>
    );
  }

  const set = (k) => (e) => {
    let v = e.target.value;
    if (k === 'phone') v = maskPhone(v);
    if (k === 'cep') v = maskCep(v);
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    if (k === 'cep' && onlyDigits(v).length === 8) {
      lookupCep(v).then((addr) => addr && setForm((f) => ({ ...f, ...Object.fromEntries(Object.entries(addr).filter(([, x]) => x)) })));
    }
  };

  const input = (k, props = {}) => <input id={k} value={form[k]} onChange={set(k)} {...props} />;

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus();
      return;
    }
    setSending(true);
    setFailure('');
    try {
      const order = await createOrder({
        customer: form,
        items: items.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
        totals: { subtotal, shipping, total },
        paymentMethod: payment,
      });
      completeOrder(order);
      navigate('/pedido');
    } catch (err) {
      setFailure(err.message || 'Não foi possível concluir o pedido. Tente novamente ou chame no WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container page">
      <nav className="crumbs"><button onClick={() => navigate('/produtos')}><Icon name="arrowLeft" size={18} /> Continuar comprando</button></nav>
      <h1 className="page__title">Finalizar compra</h1>

      <form className="checkout" onSubmit={submit} noValidate>
        <div className="checkout__main">
          <section className="panel">
            <h2>Seus dados</h2>
            <div className="form-grid">
              <Field id="name" label="Nome completo" error={errors.name} className="span-2">{input('name', { autoComplete: 'name' })}</Field>
              <Field id="phone" label="Telefone / WhatsApp" error={errors.phone}>{input('phone', { inputMode: 'tel', autoComplete: 'tel', placeholder: '(00) 00000-0000' })}</Field>
              <Field id="email" label="E-mail" error={errors.email}>{input('email', { type: 'email', inputMode: 'email', autoComplete: 'email' })}</Field>
            </div>
          </section>

          <section className="panel">
            <h2>Entrega</h2>
            <div className="form-grid">
              <Field className="half" id="cep" label="CEP" error={errors.cep}>{input('cep', { inputMode: 'numeric', autoComplete: 'postal-code', placeholder: '00000-000' })}</Field>
              <div className="field-hint half">Digite o CEP e o endereço é preenchido automaticamente.</div>
              <Field id="address" label="Endereço" error={errors.address} className="span-2">{input('address', { autoComplete: 'address-line1' })}</Field>
              <Field className="half" id="number" label="Número" error={errors.number}>{input('number', { inputMode: 'numeric' })}</Field>
              <Field className="half" id="complement" label="Complemento">{input('complement', { autoComplete: 'address-line2', placeholder: 'Opcional' })}</Field>
              <Field id="district" label="Bairro" error={errors.district}>{input('district')}</Field>
              <Field className="half" id="city" label="Cidade" error={errors.city}>{input('city', { autoComplete: 'address-level2' })}</Field>
              <Field className="half" id="state" label="Estado" error={errors.state}>
                <select id="state" value={form.state} onChange={set('state')}>
                  <option value="">Selecione</option>
                  {UFS.map((uf) => <option key={uf}>{uf}</option>)}
                </select>
              </Field>
            </div>
          </section>

          <section className="panel">
            <h2>Pagamento</h2>
            <div className="pay" role="radiogroup" aria-label="Forma de pagamento">
              {methods.map((m) => (
                <label key={m.id} className={`pay__opt ${payment === m.id ? 'is-on' : ''}`}>
                  <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} />
                  <Icon name={PAY_ICON[m.id] || 'card'} size={22} />
                  <span><strong>{m.label}</strong><small>{m.hint}</small></span>
                  <Icon name="check" size={18} className="pay__check" />
                </label>
              ))}
            </div>
            <p className="muted small pay__note">
              {payment === 'pix' && 'Após confirmar, você recebe a chave PIX pelo WhatsApp para concluir o pagamento.'}
              {payment === 'card' && 'Após confirmar, você recebe um link de pagamento seguro pelo WhatsApp.'}
              {payment === 'cash' && 'Pague em dinheiro ao receber o pedido. Informe se precisa de troco pelo WhatsApp.'}
            </p>
          </section>
        </div>

        <aside className="checkout__side">
          <section className="panel summary">
            <h2>Resumo do pedido</h2>
            <ul className="summary__list">
              {items.map((i) => (
                <li key={i.id}>
                  <span className="summary__thumb"><ProductImage product={i} /><b>{i.qty}</b></span>
                  <span className="summary__name">{i.name}<small>{i.qty} × {brl(i.price)}</small></span>
                  <strong>{brl(i.price * i.qty)}</strong>
                </li>
              ))}
            </ul>
            <dl className="totals">
              <div><dt>Subtotal</dt><dd>{brl(subtotal)}</dd></div>
              <div><dt>Frete</dt><dd>{shipping ? brl(shipping) : 'Grátis'}</dd></div>
              <div className="totals__total"><dt>Total</dt><dd>{brl(total)}</dd></div>
            </dl>
            {failure && <p className="alert" role="alert">{failure}</p>}
            <button className="btn btn--primary btn--lg btn--block" disabled={sending}>
              {sending ? 'Confirmando…' : `Confirmar pedido · ${brl(total)}`}
            </button>
            <p className="muted small center"><Icon name="shield" size={16} /> Seus dados são usados só para a entrega.</p>
          </section>
        </aside>
      </form>
    </div>
  );
}
