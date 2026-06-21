import { useParams } from "react-router-dom";
import StoreLayout from "../components/layout/StoreLayout";
import CatalogBreadcrumb from "../components/catalog/CatalogBreadcrumb";
import ProductListLayout from "../components/catalog/ProductListLayout";
import {
  findNavLinkByHref,
  getCategoryProducts,
} from "../utils/catalog";
import { useHomepageContent } from "../context/LanguageContext";

export default function Category() {
  const { slug } = useParams();
  const {
    ALL_PRODUCTS,
    NAV_LINKS,
    CATEGORY_PRODUCTS_MAP,
    CATALOG_PRODUCTS_BY_ID,
    CATALOG_WITH_TESTIMONIALS,
  } = useHomepageContent();
  const href = `/category/${slug}`;
  const navLink = findNavLinkByHref(NAV_LINKS, href);
  const title = navLink?.label ?? slug;
  const categoryKey = navLink?.id ?? slug;
  const products = getCategoryProducts(categoryKey, {
    allProducts: ALL_PRODUCTS,
    catalogProductsById: CATALOG_PRODUCTS_BY_ID,
    categoryProductsMap: CATEGORY_PRODUCTS_MAP,
  });
  const showTestimonials = CATALOG_WITH_TESTIMONIALS.has(categoryKey);

  return (
    <StoreLayout>
      <div className="bg-gray-50 pb-12">
        <div className="page-container mx-auto max-w-[1200px] px-3 sm:px-5">
          <CatalogBreadcrumb current={title} />
          <ProductListLayout
            title={title}
            products={products}
            showTestimonials={showTestimonials}
          />
        </div>
      </div>
    </StoreLayout>
  );
}
