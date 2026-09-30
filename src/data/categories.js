/**
 * CATEGORIAS
 * Para criar/renomear uma categoria, edite esta lista.
 * `id` é usado no campo `category` dos produtos. `icon` usa os ícones de src/components/Icons.jsx
 * `blurb` aparece no tile da página inicial; `usage` na aba "Como usar" do produto.
 */
export const categories = [
  { id: 'whey', name: 'Whey Protein', short: 'Whey', icon: 'whey', blurb: 'Proteína para recuperar e crescer', usage: 'Misture uma dose em 200–300 ml de água ou leite, após o treino ou entre as refeições. Siga a porção indicada no rótulo.' },
  { id: 'creatina', name: 'Creatina', short: 'Creatina', icon: 'creatina', blurb: 'Força e desempenho todo dia', usage: 'Consumo diário de 3 g, com água ou suco, em qualquer horário. Mantenha a regularidade, inclusive nos dias sem treino.' },
  { id: 'pre-treino', name: 'Pré-Treino', short: 'Pré-treino', icon: 'bolt', blurb: 'Energia e foco para o treino', usage: 'Misture uma dose em água cerca de 20–30 minutos antes do treino. Não recomendado para menores de 18 anos, gestantes e pessoas sensíveis à cafeína.' },
  { id: 'vitaminas', name: 'Vitaminas', short: 'Vitaminas', icon: 'pill', blurb: 'Base da rotina de saúde', usage: 'Consuma conforme a porção indicada no rótulo, de preferência junto a uma refeição, com água.' },
  { id: 'aminoacidos', name: 'Aminoácidos', short: 'Aminoácidos', icon: 'amino', blurb: 'Apoio na recuperação muscular', usage: 'Consuma conforme a porção indicada no rótulo, antes ou depois do treino, com água.' },
  { id: 'outros', name: 'Outros', short: 'Outros', icon: 'shaker', blurb: 'Acessórios e alimentos', usage: 'Consulte as orientações no rótulo ou na embalagem do produto.' },
];

export const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]));
