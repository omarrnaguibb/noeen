import { toAppPath } from "./appRoutes";

export function buildProductLookup(allProducts, catalogProductsById = {}) {
  const lookup = new Map(allProducts.map((product) => [String(product.id), product]));
  Object.values(catalogProductsById).forEach((product) => {
    lookup.set(String(product.id), product);
  });
  return lookup;
}

export function getCategoryProducts(categoryKey, { allProducts, catalogProductsById, categoryProductsMap }) {
  const ids = categoryProductsMap[categoryKey] ?? [];
  const lookup = buildProductLookup(allProducts, catalogProductsById);
  return ids.map((id) => lookup.get(String(id))).filter(Boolean);
}

export function findNavLinkByHref(navLinks, href) {
  const target = toAppPath(href);
  for (const link of navLinks) {
    if (toAppPath(link.href) === target) return link;
    for (const child of link.children ?? []) {
      if (toAppPath(child.href) === target) return child;
    }
  }
  return null;
}

export function findProductByUrl(products, path, catalogProductsById = {}) {
  const target = toAppPath(path);
  const lookup = buildProductLookup(products, catalogProductsById);
  return [...lookup.values()].find((product) => toAppPath(product.url) === target);
}

export const RESERVED_SLUGS = new Set([
  "checkout",
  "cart",
  "offers",
  "category",
  "p",
  "testimonials",
  "blog",
  "whatsapp",
  "latest-products",
  "most-Sales-products",
]);
