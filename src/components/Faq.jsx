import { FAQ } from '../config/store';
import { Icon } from './Icons';

export default function Faq() {
  return (
    <section className="section container faq" id="duvidas">
      <div className="faq__intro">
        <p className="eyebrow eyebrow--dark"><i /> Dúvidas</p>
        <h2 className="h-display">Perguntas<br />frequentes</h2>
        <p className="muted">Não achou a resposta? Chame no WhatsApp.</p>
      </div>
      <div className="faq__list">
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}<Icon name="plus" size={20} /></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
