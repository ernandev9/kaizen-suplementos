import { SHIPPING } from '../config/store';
import { onlyDigits } from '../utils/format';

/** Frete fixo com frete grátis acima de um valor. Troque por cálculo dos Correios/Melhor Envio quando quiser. */
export function calcShipping(subtotal) {
  if (subtotal <= 0) return 0;
  if (SHIPPING.freeAbove && subtotal >= SHIPPING.freeAbove) return 0;
  return SHIPPING.flatRate;
}

export function missingForFreeShipping(subtotal) {
  if (!SHIPPING.freeAbove) return null;
  return Math.max(0, SHIPPING.freeAbove - subtotal);
}

/** Preenche o endereço pelo CEP (ViaCEP). Se falhar, o cliente digita manualmente. */
export async function lookupCep(cep) {
  const d = onlyDigits(cep);
  if (d.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return { address: data.logradouro, district: data.bairro, city: data.localidade, state: data.uf };
  } catch {
    return null;
  }
}
