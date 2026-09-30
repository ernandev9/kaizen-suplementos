import { Icon } from './Icons';

export default function QuantityStepper({ value, max, onChange, size = 'md', label = 'Quantidade' }) {
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Diminuir quantidade">
        <Icon name="minus" size={18} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Aumentar quantidade">
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}
