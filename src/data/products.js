/**
 * PRODUTOS
 * Único lugar onde os produtos são cadastrados.
 *
 * Campos:
 *  id          identificador único (número ou texto)
 *  slug        usado na URL da página do produto
 *  name, brand, category (id de src/data/categories.js)
 *  price       preço de venda atual
 *  oldPrice    preço "de" (opcional). Se maior que price, o produto aparece em Ofertas
 *  stock       quantidade disponível
 *  image       URL/arquivo da foto (opcional). Sem foto, uma embalagem ilustrada é gerada com `visual`
 *  visual      { shape: 'pote' | 'refil' | 'frasco' | 'coqueteleira', color, label }
 *  featured    true = aparece em "Destaques" na página inicial
 *  description texto da página do produto
 *
 * Para usar foto real: coloque o arquivo em src/assets/produtos/ e importe,
 * ou use a URL da imagem hospedada: image: 'https://.../whey.webp'
 *
 * Futuramente estes dados podem vir de um banco (ver src/services/productService.js).
 */
export const products = [
  {
    id: 1,
    slug: 'whey-protein-concentrado-900g',
    name: 'Whey Protein Concentrado 900g',
    brand: 'Atlas Nutrition',
    category: 'whey',
    price: 119.9,
    oldPrice: 149.9,
    stock: 8,
    featured: true,
    visual: { shape: 'pote', color: '#5B3A29', label: 'WHEY' },
    description:
      'Proteína concentrada do soro do leite com 24 g de proteína por dose. Sabor chocolate, boa solubilidade e fácil de misturar só com água ou leite.',
  },
  {
    id: 2,
    slug: 'whey-isolado-900g',
    name: 'Whey Isolado 900g',
    brand: 'Forja Labs',
    category: 'whey',
    price: 189.9,
    oldPrice: 219.9,
    stock: 15,
    featured: true,
    visual: { shape: 'refil', color: '#E8E4DA', label: 'ISO' },
    description:
      'Whey isolado com baixo teor de lactose e gordura. 27 g de proteína por dose, sabor baunilha.',
  },
  {
    id: 3,
    slug: 'whey-concentrado-refil-1kg',
    name: 'Whey Concentrado Refil 1kg',
    brand: 'Ápice',
    category: 'whey',
    price: 129.9,
    stock: 22,
    visual: { shape: 'refil', color: '#A23A2C', label: 'WHEY' },
    description:
      'Embalagem refil econômica de 1 kg. Sabor morango, 22 g de proteína por dose.',
  },
  {
    id: 4,
    slug: 'creatina-monohidratada-300g',
    name: 'Creatina Monohidratada 300g',
    brand: 'Atlas Nutrition',
    category: 'creatina',
    price: 89.9,
    oldPrice: 109.9,
    stock: 12,
    featured: true,
    visual: { shape: 'pote', color: '#1E2A36', label: 'CREATINA' },
    description:
      'Creatina monohidratada pura, sem sabor. Rende 100 doses de 3 g. Pode ser misturada a qualquer bebida.',
  },
  {
    id: 5,
    slug: 'creatina-monohidratada-500g',
    name: 'Creatina Monohidratada 500g',
    brand: 'Forja Labs',
    category: 'creatina',
    price: 129.9,
    stock: 3,
    visual: { shape: 'pote', color: '#2E3B2F', label: 'CREATINA' },
    description:
      'Creatina monohidratada micronizada, sem sabor. Rende 166 doses de 3 g.',
  },
  {
    id: 6,
    slug: 'creatina-1kg',
    name: 'Creatina Monohidratada 1kg',
    brand: 'Ápice',
    category: 'creatina',
    price: 219.9,
    oldPrice: 259.9,
    stock: 0,
    visual: { shape: 'refil', color: '#39424C', label: 'CREATINA' },
    description:
      'Refil de 1 kg de creatina monohidratada, sem sabor. A opção mais econômica por dose.',
  },
  {
    id: 7,
    slug: 'pre-treino-ignite-300g',
    name: 'Pré-Treino Ignite 300g',
    brand: 'Forja Labs',
    category: 'pre-treino',
    price: 99.9,
    oldPrice: 124.9,
    stock: 6,
    featured: true,
    visual: { shape: 'pote', color: '#B3261E', label: 'PRÉ' },
    description:
      'Pré-treino com cafeína, beta-alanina e citrulina. Sabor frutas vermelhas, 30 doses.',
  },
  {
    id: 8,
    slug: 'pre-treino-focus-250g',
    name: 'Pré-Treino Focus 250g',
    brand: 'Ápice',
    category: 'pre-treino',
    price: 89.9,
    stock: 18,
    visual: { shape: 'pote', color: '#3D2C6B', label: 'FOCUS' },
    description:
      'Pré-treino sem cafeína, com citrulina e taurina. Para quem treina à noite. Sabor limão, 25 doses.',
  },
  {
    id: 9,
    slug: 'multivitaminico-a-z-60-capsulas',
    name: 'Multivitamínico A-Z 60 cápsulas',
    brand: 'Vitta Pro',
    category: 'vitaminas',
    price: 39.9,
    oldPrice: 49.9,
    stock: 25,
    visual: { shape: 'frasco', color: '#E8A33A', label: 'A-Z' },
    description:
      'Complexo de vitaminas e minerais em cápsulas. Uma cápsula ao dia, 60 dias de uso.',
  },
  {
    id: 10,
    slug: 'omega-3-120-capsulas',
    name: 'Ômega 3 120 cápsulas',
    brand: 'Vitta Pro',
    category: 'vitaminas',
    price: 54.9,
    stock: 9,
    visual: { shape: 'frasco', color: '#2F6B8F', label: 'ÔMEGA 3' },
    description: 'Óleo de peixe concentrado com EPA e DHA. 120 cápsulas de 1 g.',
  },
  {
    id: 11,
    slug: 'vitamina-d3-2000ui',
    name: 'Vitamina D3 2000 UI 60 cápsulas',
    brand: 'Vitta Pro',
    category: 'vitaminas',
    price: 29.9,
    oldPrice: 34.9,
    stock: 40,
    visual: { shape: 'frasco', color: '#D9C23E', label: 'D3' },
    description: 'Vitamina D3 2000 UI em cápsulas softgel. Uma cápsula ao dia.',
  },
  {
    id: 12,
    slug: 'bcaa-211-120-capsulas',
    name: 'BCAA 2:1:1 120 cápsulas',
    brand: 'Atlas Nutrition',
    category: 'aminoacidos',
    price: 49.9,
    oldPrice: 59.9,
    stock: 14,
    visual: { shape: 'frasco', color: '#1F7A6B', label: 'BCAA' },
    description: 'Leucina, isoleucina e valina na proporção 2:1:1. 120 cápsulas.',
  },
  {
    id: 13,
    slug: 'glutamina-300g',
    name: 'Glutamina 300g',
    brand: 'Ápice',
    category: 'aminoacidos',
    price: 69.9,
    oldPrice: 84.9,
    stock: 2,
    visual: { shape: 'pote', color: '#6E7B86', label: 'GLUTAMINA' },
    description: 'L-glutamina pura, sem sabor. 60 doses de 5 g.',
  },
  {
    id: 14,
    slug: 'coqueteleira-kaizen-700ml',
    name: 'Coqueteleira Kaizen 700ml',
    brand: 'Kaizen',
    category: 'outros',
    price: 24.9,
    stock: 30,
    visual: { shape: 'coqueteleira', color: '#121714', label: 'KAIZEN' },
    description: 'Coqueteleira com tampa rosqueável e mola misturadora. Livre de BPA.',
  },
  {
    id: 15,
    slug: 'pasta-de-amendoim-1kg',
    name: 'Pasta de Amendoim Integral 1kg',
    brand: 'Atlas Nutrition',
    category: 'outros',
    price: 34.9,
    oldPrice: 39.9,
    stock: 0,
    visual: { shape: 'pote', color: '#A8743A', label: 'AMENDOIM' },
    description: '100% amendoim torrado, sem açúcar e sem sal adicionados.',
  },
];
