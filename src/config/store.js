/**
 * CONFIGURAÇÕES DA LOJA
 * Tudo que costuma mudar (WhatsApp, frete, pagamento, textos do banner) fica aqui.
 */

export const STORE = {
  name: 'Kaizen Suplementos',
  tagline: 'Suplementação para evoluir.',
  // Número do WhatsApp: só dígitos, com DDI 55 + DDD. Ex.: 5586999998888
  whatsapp: '5500000000000',
  whatsappDefaultMessage:
    'Olá! Gostaria de saber mais sobre os produtos da Kaizen Suplementos.',
  instagramUrl: 'https://instagram.com/kaizensuplementos',
  instagramHandle: '@kaizensuplementos',
  email: 'contato@kaizensuplementos.com.br',
  // Dados legais (rodapé)
  legalName: 'Kaizen Suplementos',
  cnpj: '00.000.000/0000-00',
  city: 'Sua cidade – UF',
};

export const HERO = {
  title: 'Suplementação para evoluir',
  subtitle:
    'Qualidade, praticidade e os suplementos que você precisa para alcançar seus objetivos.',
  cta: 'Comprar agora',
  // Para usar uma foto no banner, importe a imagem e coloque aqui
  // (ex.: import banner from '../assets/banner.webp'; image: banner). null = banner gráfico padrão.
  image: null,
};

export const STOCK = {
  // > lowThreshold: "Em estoque" | 1..lowThreshold: "Últimas unidades" | 0: "Esgotado"
  lowThreshold: 10,
};

export const SHIPPING = {
  flatRate: 19.9, // frete fixo
  freeAbove: 299, // frete grátis a partir deste subtotal (0 = desativado)
};

export const PAYMENT = {
  // Quando integrar um gateway (Mercado Pago, Pagar.me, Stripe...), mude para true
  // e implemente as funções em src/services/paymentService.js
  gatewayEnabled: false,
  methods: [
    { id: 'pix', label: 'PIX', hint: 'Aprovação imediata', enabled: true },
    { id: 'card', label: 'Cartão de crédito', hint: 'Até 6x sem juros', enabled: true },
    { id: 'cash', label: 'Dinheiro na entrega', hint: 'Pague ao receber', enabled: false },
  ],
};

export const OFFER = {
  pixDiscount: 5, // % de desconto pagando no PIX (0 = esconder)
  installments: 6, // parcelas sem juros no cartão (0 = esconder)
  minInstallment: 20, // valor mínimo de cada parcela
};

// Faixa fina no topo do site e faixa rolante abaixo do banner
export const ANNOUNCE = [
  'Frete grátis acima de R$ 299',
  '5% OFF pagando no PIX',
  'Até 6x sem juros no cartão',
  'Pedido separado no mesmo dia útil',
];

export const FAQ = [
  { q: 'Como faço o pedido?', a: 'Monte o carrinho, preencha seus dados no checkout e envie o pedido pelo WhatsApp já com itens, total e endereço. Nós confirmamos o estoque e mandamos a chave PIX ou o link de pagamento.' },
  { q: 'Em quanto tempo meu pedido chega?', a: 'Separamos no mesmo dia útil após a confirmação do pagamento. O prazo de entrega depende da sua região e é informado no atendimento.' },
  { q: 'Os produtos têm validade longa?', a: 'Trabalhamos com lotes recentes e conferimos a validade de cada item antes de enviar.' },
  { q: 'Posso trocar ou devolver?', a: 'Sim. Produto com defeito, errado ou lacre violado é trocado. Fale com a gente pelo WhatsApp em até 7 dias após o recebimento.' },
  { q: 'Não sei qual suplemento escolher.', a: 'Chame no WhatsApp. Uma pessoa da equipe te ajuda a montar o pedido conforme seu objetivo e rotina de treino.' },
];
