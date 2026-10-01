/**
 * CATEGORIAS
 * Para criar/renomear uma categoria, edite esta lista.
 * `id` é usado no campo `category` dos produtos. `icon` usa os ícones de src/components/Icons.jsx
 * `blurb` aparece no tile da página inicial; `usage` na aba "Como usar" do produto.
 */
export const categories = [
  { id: 'whey', name: 'Whey Protein', short: 'Whey', icon: 'whey', blurb: 'Proteína para recuperar e crescer', usage: 'Misture uma dose em água ou leite, após o treino ou entre as refeições. Siga a porção indicada no rótulo.' },
  { id: 'creatina', name: 'Creatina', short: 'Creatina', icon: 'creatina', blurb: 'Força e desempenho todo dia', usage: 'Consumo diário conforme o rótulo, com água ou suco, em qualquer horário. Mantenha a regularidade, inclusive nos dias sem treino.' },
  { id: 'pre-treino', name: 'Pré-Treino', short: 'Pré-treino', icon: 'bolt', blurb: 'Energia e foco para o treino', usage: 'Misture uma dose em água cerca de 20–30 minutos antes do treino. Contém cafeína: não recomendado para menores de 18 anos, gestantes e pessoas sensíveis.' },
  { id: 'pre-sem-cafeina', name: 'Pré-Treino sem Cafeína', short: 'Sem cafeína', icon: 'amino', blurb: 'Para treinar à noite ou evitar estimulantes', usage: 'Misture uma dose em água cerca de 20–30 minutos antes do treino, conforme o rótulo.' },
  { id: 'bem-estar', name: 'Saúde e Bem-estar', short: 'Bem-estar', icon: 'pill', blurb: 'Termogênicos, colágeno e mais', usage: 'Consuma conforme a porção indicada no rótulo. Em caso de dúvida, consulte um nutricionista ou médico.' },
  { id: 'barras', name: 'Barras de Proteína', short: 'Barras', icon: 'shaker', blurb: 'Praticidade para qualquer hora', usage: 'Consuma como lanche, de preferência junto a uma alimentação equilibrada.' },
];

export const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]));
