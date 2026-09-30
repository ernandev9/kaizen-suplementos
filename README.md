# Kaizen Suplementos — loja online

SPA em React + Vite, mobile first. Sem backend obrigatório: roda em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, Hostinger).

## Rodar

```bash
npm install
npm run dev            # desenvolvimento
npm run build          # gera dist/ para publicar
npm run build:single   # gera um único dist/index.html com tudo embutido
```

## O que editar no dia a dia

| Quero… | Arquivo |
|---|---|
| Trocar número do WhatsApp, Instagram, e-mail, CNPJ | `src/config/store.js` → `STORE` |
| Mudar textos ou imagem do banner | `src/config/store.js` → `HERO` |
| Mudar frete fixo / valor do frete grátis | `src/config/store.js` → `SHIPPING` |
| Ativar/desativar PIX, cartão, dinheiro na entrega | `src/config/store.js` → `PAYMENT.methods` |
| Regra de "Últimas unidades" | `src/config/store.js` → `STOCK.lowThreshold` |
| Cadastrar, editar preço ou estoque de produto | `src/data/products.js` |
| Criar/renomear categorias | `src/data/categories.js` |
| Cores e fontes | topo de `src/styles/index.css` (variáveis `--accent`, `--lime`…) |
| Logo | `src/assets/logo-kaizen.webp` e `logo-kaizen-completo.webp` |

### Cadastrar um produto

Copie um bloco em `src/data/products.js` e ajuste. Para foto real, adicione `image: '/caminho/foto.webp'` (ou URL). Sem foto, o site desenha uma embalagem com base em `visual`.

`oldPrice` maior que `price` → o produto aparece em **Ofertas** com a % de desconto calculada.
`featured: true` → aparece em **Destaques** na página inicial (até 4).

## Estrutura

```
src/
  config/store.js          configurações da loja
  data/products.js         produtos (fonte única)
  data/categories.js       categorias
  services/
    productService.js      leitura de produtos e baixa de estoque  ← trocar por banco
    paymentService.js      criação do pedido e pagamento           ← integrar gateway
    shippingService.js     frete e busca de CEP (ViaCEP)
  context/StoreContext.jsx estado global: produtos, carrinho, estoque
  hooks/useRoute.js        rotas por hash (#/produtos, #/produto/slug, #/checkout)
  utils/                   formatação, estoque, busca/filtros, mensagens de WhatsApp
  components/              Header, MobileMenu, Search, Hero, CategoryCard, ProductCard,
                           ProductGrid, ProductDetail, Cart, Checkout, OrderSuccess,
                           Filters, WhatsAppButton, Footer…
  pages/                   Home, Products (lista, busca, categorias e ofertas)
```

## Fluxo de compra atual

Carrinho → Checkout (dados, endereço, forma de pagamento) → pedido registrado → botão **Enviar pedido pelo WhatsApp** com itens, total e endereço já preenchidos. A loja responde com a chave PIX ou link de pagamento.

## Próximos passos

**Estoque em banco de dados.** Hoje o estoque vem de `products.js` e a baixa após um pedido vale só para a sessão do cliente. Para estoque real, implemente `fetchProducts` e `reserveStock` em `src/services/productService.js` (ex.: Supabase) — a baixa deve ser feita no servidor.

**Gateway de pagamento.** Implemente `createPayment` em `src/services/paymentService.js` chamando uma rota do seu backend (Mercado Pago, Pagar.me, Asaas, Stripe) e mude `PAYMENT.gatewayEnabled` para `true`. Nunca coloque chave secreta do gateway no front-end, e capture dados de cartão pelo componente do próprio gateway.
