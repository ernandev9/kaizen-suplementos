import { Icon } from './Icons';

const STEPS = [
  { n: '01', title: 'Escolha', text: 'Navegue por categoria ou busque pelo nome e monte seu carrinho.' },
  { n: '02', title: 'Envie o pedido', text: 'Preencha o checkout. O pedido vai para o nosso WhatsApp já completo.' },
  { n: '03', title: 'Pague', text: 'Confirmamos o estoque e enviamos a chave PIX ou o link do cartão.' },
  { n: '04', title: 'Receba', text: 'Separamos no mesmo dia útil e você acompanha até a entrega.' },
];

const TRUST = [
  { icon: 'truck', title: 'Frete grátis', text: 'em compras acima de R$ 299' },
  { icon: 'pix', title: '5% OFF no PIX', text: 'desconto já no total do pedido' },
  { icon: 'card', title: 'Até 6x sem juros', text: 'parcela mínima de R$ 20' },
  { icon: 'shield', title: 'Troca garantida', text: '7 dias após o recebimento' },
];

export function Trust() {
  return (
    <section className="trust container" aria-label="Vantagens">
      {TRUST.map((t) => (
        <div className="trust__item" key={t.title}>
          <Icon name={t.icon} size={26} strokeWidth={1.5} />
          <div><strong>{t.title}</strong><span>{t.text}</span></div>
        </div>
      ))}
    </section>
  );
}

export default function Method() {
  return (
    <section className="method">
      <div className="container">
        <div className="section__head section__head--light">
          <div>
            <p className="eyebrow"><i /> Como funciona</p>
            <h2 className="h-display">Do carrinho<br />à sua porta</h2>
          </div>
        </div>
        <ol className="method__steps">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="method__n">{s.n}</span>
              <strong>{s.title}</strong>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
