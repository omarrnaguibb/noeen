import CatalogProductCard from "./CatalogProductCard";

export default function ProductGrid({ products }) {
  return (
    <div className="s-products-list-wrapper s-products-list-vertical-cards">
      {products.map((product) => (
        <CatalogProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
