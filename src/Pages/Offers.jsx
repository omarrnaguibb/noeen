import StoreLayout from "../components/layout/StoreLayout";
import CatalogBreadcrumb from "../components/catalog/CatalogBreadcrumb";
import ProductListLayout from "../components/catalog/ProductListLayout";
import { getCategoryProducts } from "../utils/catalog";
import { useHomepageContent, useTranslation } from "../context/LanguageContext";

export default function Offers() {
  const { ALL_PRODUCTS, NAV_LINKS, CATEGORY_PRODUCTS_MAP, CATALOG_PRODUCTS_BY_ID } =
    useHomepageContent();
  const { t } = useTranslation();
  const offersLink = NAV_LINKS.find((link) => link.id === "offers");
  const title = offersLink?.label ?? t("catalogPage.offersTitle");
  const products = getCategoryProducts("offers", {
    allProducts: ALL_PRODUCTS,
    catalogProductsById: CATALOG_PRODUCTS_BY_ID,
    categoryProductsMap: CATEGORY_PRODUCTS_MAP,
  });

  return (
    <StoreLayout>
      <div className="bg-gray-50 pb-12">
        <div className="page-container mx-auto max-w-[1200px] px-3 sm:px-5">
          <CatalogBreadcrumb current={title} />
          <ProductListLayout title={title} products={products} variant="offers" />
        </div>
      </div>
    </StoreLayout>
  );
}
