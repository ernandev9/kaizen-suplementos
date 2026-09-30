import { OFFER } from '../config/store';
const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const brl = (value) => brlFormatter.format(value || 0);

export const hasDiscount = (p) => Boolean(p.oldPrice && p.oldPrice > p.price);

export const discountPercent = (p) =>
  hasDiscount(p) ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

export const onlyDigits = (v = '') => String(v).replace(/\D/g, '');

export const maskPhone = (v) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const maskCep = (v) => {
  const d = onlyDigits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

/** remove acentos e deixa minúsculo, para a busca */
export const normalize = (s = '') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const pixPrice = (p) => (OFFER.pixDiscount ? Math.round(p.price * (100 - OFFER.pixDiscount)) / 100 : null);

/** { n, value } da maior parcela sem juros respeitando o valor mínimo; null se não couber */
export const installment = (p) => {
  if (!OFFER.installments) return null;
  const n = Math.min(OFFER.installments, Math.floor(p.price / OFFER.minInstallment));
  return n >= 2 ? { n, value: p.price / n } : null;
};

/** extrai "900g", "1kg", "60 cápsulas" do nome */
export const sizeOf = (p) => (p.name.match(/\d+([.,]\d+)?\s?(kg|g|ml|cápsulas)/i) || [''])[0];
