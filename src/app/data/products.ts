// Estrutura principal dos produtos do cardápio
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;

  // Informações exibidas para o cliente
  rating: number;
  reviewCount: number;
  prepTime: string;
  tags: string[];

  // Personalização do pedido
  options?: ProductOption[];
  extras?: ProductExtra[];

  // Pontuação do programa de fidelidade 
  points: number;

  // Controle de disponibilidade
  seasonal?: boolean;
  seasonLabel?: string;
  unavailableIn?: string[];
  requiresFullKitchen?: boolean;
  popular?: boolean;
  available?: boolean;
}

// Opções selecionáveis do produto
export interface ProductOption {
  id: string;
  name: string;
  required: boolean;
  choices: { id: string; label: string; price?: number }[];
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

// Lista das categorias disponíveis
export const categories: Category[] = [
  { id: 'carnes', name: 'Carnes', icon: '🥩', color: '#C62828', count: 12 },
  { id: 'tapioca', name: 'Tapioca', icon: '🥞', color: '#B94E2F', count: 8 },
  { id: 'moqueca', name: 'Moqueca', icon: '🐟', color: '#2980B9', count: 6 },
  { id: 'baiao', name: 'Baião', icon: '🍛', color: '#F39C12', count: 5 },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤', color: '#2E7D32', count: 10 },
  { id: 'doces', name: 'Doces', icon: '🍮', color: '#8E44AD', count: 7 },
  { id: 'lanches', name: 'Lanches', icon: '🥪', color: '#D35400', count: 9 },
  { id: 'sopas', name: 'Sopas', icon: '🍲', color: '#1ABC9C', count: 4 },
];

// Produtos cadastrados no cardápio
export const products: Product[] = [
  {
    id: '1',
    name: 'Carne de Sol com Macaxeira',
    description: 'Suculenta carne de sol grelhada na brasa, acompanhada de macaxeira cozida na manteiga de garrafa e vinagrete nordestino.',
    price: 38.90,
    image: import.meta.env.BASE_URL + 'images/carne_de_sol.png',
    category: 'carnes',
    rating: 4.8,
    reviewCount: 247,
    prepTime: '25 min',
    tags: ['popular', 'nordestino'],
    popular: true,
    points: 38,
    options: [
      {
        id: 'tamanho',
        name: 'Tamanho',
        required: true,
        choices: [
          { id: 'p', label: 'Individual (300g)' },
          { id: 'm', label: 'Médio (500g)', price: 10 },
          { id: 'g', label: 'Grande (800g)', price: 20 },
        ],
      },
      {
        id: 'ponto',
        name: 'Ponto da Carne',
        required: true,
        choices: [
          { id: 'mal', label: 'Mal Passado' },
          { id: 'med', label: 'Ao Ponto' },
          { id: 'bem', label: 'Bem Passado' },
        ],
      },
    ],
    extras: [
      { id: 'vinagrete', name: 'Vinagrete Extra', price: 3.50 },
      { id: 'pimenta', name: 'Molho de Pimenta', price: 2.00 },
      { id: 'feijao', name: 'Feijão Verde', price: 5.00 },
    ],
  },
  {
    id: '2',
    name: 'Baião de Dois Completo',
    description: 'O clássico baião de dois com feijão-de-corda, arroz, queijo coalho, linguiça e bacon. Sabor autêntico do sertão.',
    price: 32.50,
    image: import.meta.env.BASE_URL + 'images/baiao_de_dois.png',
    category: 'baiao',
    rating: 4.9,
    reviewCount: 389,
    prepTime: '20 min',
    tags: ['popular', 'vegetariano'],
    popular: true,
    points: 32,
    options: [
      {
        id: 'proteina',
        name: 'Proteína',
        required: true,
        choices: [
          { id: 'linguica', label: 'Linguiça + Bacon' },
          { id: 'carne', label: 'Carne de Sol', price: 8 },
          { id: 'vegano', label: 'Sem proteína (Vegano)' },
        ],
      },
    ],
    extras: [
      { id: 'queijo', name: 'Queijo Coalho Extra', price: 4.00 },
      { id: 'manteiga', name: 'Manteiga de Garrafa', price: 3.00 },
    ],
  },
  {
    id: '3',
    name: 'Tapioca de Queijo Coalho',
    description: 'Tapioca fresquinha recheada com queijo coalho grelhado, coco ralado e mel de engenho. Cremosa e irresistível.',
    price: 18.90,
    originalPrice: 22.00,
    image: import.meta.env.BASE_URL + 'images/tapioca.png',
    category: 'tapioca',
    rating: 4.7,
    reviewCount: 156,
    prepTime: '10 min',
    tags: ['sem glúten', 'promoção'],
    points: 18,
    options: [
      {
        id: 'recheio',
        name: 'Recheio',
        required: true,
        choices: [
          { id: 'queijo', label: 'Queijo Coalho' },
          { id: 'frango', label: 'Frango com Catupiry', price: 4 },
          { id: 'camarao', label: 'Camarão Temperado', price: 8 },
          { id: 'carne-sol', label: 'Carne de Sol', price: 6 },
        ],
      },
    ],
    extras: [
      { id: 'mel', name: 'Mel de Engenho', price: 2.50 },
      { id: 'coco', name: 'Coco Ralado', price: 1.50 },
    ],
  },
  {
    id: '4',
    name: 'Moqueca de Peixe',
    description: 'Moqueca nordestina com peixe fresco, dendê, leite de coco, pimentões coloridos e coentro. Servida com arroz e pirão.',
    price: 52.00,
    image: import.meta.env.BASE_URL + 'images/moqueca.png',
    category: 'moqueca',
    rating: 4.6,
    reviewCount: 98,
    prepTime: '35 min',
    tags: ['frutos do mar'],
    points: 52,
  },
  {
    id: '5',
    name: 'Espetinho de Camarão',
    description: 'Camarões frescos temperados com alho, limão e ervas, grelhados no espeto. Acompanha molho tártaro e limão.',
    price: 42.00,
    image: import.meta.env.BASE_URL + 'images/espetinho.png',
    category: 'carnes',
    rating: 4.5,
    reviewCount: 134,
    prepTime: '20 min',
    tags: ['frutos do mar', 'grelhado'],
    points: 42,
  },
  {
    id: '6',
    name: 'Cuscuz com Ovo e Manteiga',
    description: 'Cuscuz nordestino fofinho com ovo mexido, manteiga de garrafa e queijo coalho. O café da manhã mais autêntico do Nordeste.',
    price: 16.90,
    image: import.meta.env.BASE_URL + 'images/cuscuz.png',
    category: 'lanches',
    rating: 4.8,
    reviewCount: 312,
    prepTime: '12 min',
    tags: ['café da manhã', 'popular'],
    popular: true,
    points: 16,
  },
  {
    id: '7',
    name: 'Buchada de Bode',
    description: 'Iguaria típica nordestina: buchada preparada com temperos especiais da casa, servida com pirão e farinha.',
    price: 45.00,
    image: import.meta.env.BASE_URL + 'images/buchada.png',
    category: 'carnes',
    rating: 4.4,
    reviewCount: 67,
    prepTime: '40 min',
    tags: ['regional', 'tradicional'],
    points: 45,
  },
  {
    id: '8',
    name: 'Cartola',
    description: 'Sobremesa pernambucana: banana-da-terra frita, queijo coalho grelhado, açúcar, canela e mel. Uma explosão de sabores.',
    price: 22.00,
    image: import.meta.env.BASE_URL + 'images/cartola.png',
    category: 'doces',
    rating: 4.9,
    reviewCount: 201,
    prepTime: '15 min',
    tags: ['doce', 'sobremesa'],
    points: 22,
  },
  {
    id: '9',
    name: 'Caldinho de Feijão',
    description: 'Caldinho cremoso de feijão-preto com bacon, linguiça, coentro e torradas crocantes. Perfeito para o frio.',
    price: 14.90,
    image: import.meta.env.BASE_URL + 'images/caldinho.png',
    category: 'sopas',
    rating: 4.7,
    reviewCount: 178,
    prepTime: '8 min',
    tags: ['quente', 'entrada'],
    popular: true,
    points: 14,
  },
  {
    id: '10',
    name: 'Cajuína Gelada',
    description: 'A famosa bebida piauiense feita com suco de caju clarificado. Suave, refrescante e cheia de nostalgia nordestina.',
    price: 9.90,
    image: import.meta.env.BASE_URL + 'images/cajuina.png',
    category: 'bebidas',
    rating: 4.8,
    reviewCount: 445,
    prepTime: '2 min',
    tags: ['gelada', 'regional'],
    popular: true,
    points: 9,
  },
];

export const promotions = [
  {
    id: 'promo1',
    title: '2x1 em Tapiocas',
    subtitle: 'Toda quinta-feira',
    discount: '50% OFF',
    color: '#B94E2F',
    image: import.meta.env.BASE_URL + 'images/tapioca.png',
  },
  {
    id: 'promo2',
    title: 'Combo Nordestino',
    subtitle: 'Carne de Sol + Baião + Bebida',
    discount: 'R$ 69,90',
    color: '#C62828',
    image: import.meta.env.BASE_URL + 'images/carne_de_sol.png',
  },
  {
    id: 'promo3',
    title: 'Frete Grátis',
    subtitle: 'Pedidos acima de R$ 60',
    discount: 'GRÁTIS',
    color: '#2E7D32',
    image: import.meta.env.BASE_URL + 'images/baiao_de_dois.png',
  },
];

export const coupons = [
  { id: 'NORDESTE10', discount: 10, type: 'percent', description: '10% de desconto no pedido', minOrder: 30 },
  { id: 'FRETEGRATIS', discount: 0, type: 'frete', description: 'Frete grátis', minOrder: 50 },
  { id: 'PRIMEIRORAIZ', discount: 15, type: 'percent', description: '15% no primeiro pedido', minOrder: 0 },
  { id: 'RAIZES20', discount: 20, type: 'fixed', description: 'R$ 20 de desconto', minOrder: 80 },
];
