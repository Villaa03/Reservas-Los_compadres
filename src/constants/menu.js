import hamburguesaImg from '../assets/menu/hamburguesa.png';
import ginTonicImg from '../assets/menu/gin_tonic.png';
import rooftopImg from '../assets/rooftop_view.png';

export const MENU_CATEGORIES = [
  { id: "entradas", label: "Entradas" },
  { id: "fuertes", label: "Platos Fuertes" },
  { id: "bebidas", label: "Bebidas y Cócteles" },
  { id: "postres", label: "Postres" }
];

export const MENU_ITEMS = [
  {
    id: "empanadas",
    name: "Empanaditas Compadres",
    description: "5 empanaditas de carne mechada acompañadas de ají casero de la casa y limón.",
    price: 18000,
    category: "entradas",
    image: rooftopImg
  },
  {
    id: "chicharron",
    name: "Chicharrón Crujiente",
    description: "Dados de chicharrón carnudo marinados en limón y sal de gusano, con arepitas criollas.",
    price: 24000,
    category: "entradas",
    image: rooftopImg
  },
  {
    id: "hamburguesa",
    name: "Hamburguesa Compadre Premium",
    description: "150g de carne Angus, queso cheddar fundido, cebolla caramelizada, tocineta crujiente y salsa especial de la casa en pan brioche, acompañada de papas rústicas.",
    price: 32000,
    category: "fuertes",
    image: hamburguesaImg
  },
  {
    id: "costillitas",
    name: "Costillas BBQ Compadres",
    description: "Costillitas de cerdo tiernas bañadas en salsa BBQ de maracuyá artesanal, acompañadas de papas criollas.",
    price: 45000,
    category: "fuertes",
    image: hamburguesaImg
  },
  {
    id: "lomo",
    name: "Lomo al Trapo Rústico",
    description: "250g de lomo de res tierno sellado al trapo con sal marina, acompañado de vegetales asados y papas fritas.",
    price: 48000,
    category: "fuertes",
    image: hamburguesaImg
  },
  {
    id: "gin_tonic",
    name: "Gin Tonic Compadre",
    description: "Ginebra premium, agua tónica, frutos rojos frescos, rodaja de pepino y un toque de romero flameado.",
    price: 28000,
    category: "bebidas",
    image: ginTonicImg
  },
  {
    id: "mojito",
    name: "Mojito Rooftop Clásico",
    description: "Ron blanco, hierbabuena fresca macerada, zumo de limón, azúcar de caña y agua con gas.",
    price: 24000,
    category: "bebidas",
    image: ginTonicImg
  },
  {
    id: "limonada_coco",
    name: "Limonada de Coco Cremosa",
    description: "Limonada fría licuada con crema de coco real y ralladura de limón.",
    price: 14000,
    category: "bebidas",
    image: ginTonicImg
  },
  {
    id: "volcan_chocolate",
    name: "Volcán de Chocolate con Helado",
    description: "Torta húmeda de chocolate con centro líquido caliente de chocolate belga, acompañado de una bola de helado de vainilla artesanal.",
    price: 16000,
    category: "postres",
    image: rooftopImg
  }
];
