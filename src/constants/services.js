import { ALL_PRODUCTS, STORE } from "./homepage.js";

export const SERVICES = ALL_PRODUCTS.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  description: product.name,
  badge: product.badge,
  rating: product.rating,
  url: product.url,
}));

export const CATEGORIES = [];
export const HERO_SLIDES = [];
export const NOEEN_LOGO = STORE.logo;
