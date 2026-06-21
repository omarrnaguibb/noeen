import { useEffect, useMemo, useState } from "react";
import EmptyProductList from "./EmptyProductList";
import LoadMoreButton from "./LoadMoreButton";
import ProductGrid from "./ProductGrid";
import TestimonialsSlider from "../home/TestimonialsSlider";
import { useHomepageContent, useTranslation } from "../../context/LanguageContext";

const PAGE_SIZE = 20;

export default function ProductListLayout({
  title,
  products,
  showTestimonials = false,
  variant = "category",
}) {
  const { TESTIMONIALS, HEADER_UI } = useHomepageContent();
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [products]);

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, products.length));
  };

  const mainContent = (
    <div className="main-content flex-1 w-full">
      <div className="mb-4 sm:mb-6 flex justify-between items-center">
        <h1 className="font-bold text-xl rtl:pl-3 ltr:pr-3">{title}</h1>
        <div className="center-between">
          <div className="flex gap-6 md:gap-8 items-center" />
        </div>
      </div>

      <div className="flex">
        <div className={`flex-1 min-w-0 overflow-auto ${products.length ? "s-products-list" : ""}`}>
          {products.length === 0 ? (
            <EmptyProductList />
          ) : (
            <>
              <ProductGrid products={visibleProducts} />
              <LoadMoreButton visible={hasMore} onLoadMore={handleLoadMore} />
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (variant === "offers") {
    return mainContent;
  }

  return (
    <div className="product-index-wrapper flex flex-col space-y-8 sm:space-y-16">
      <div className="s-blocks-wrapper s-before-products-list !mt-0" />

      <div className="container container--products-list">
        <div className="flex items-start flex-col md:flex-row">{mainContent}</div>
      </div>

      <div className="s-blocks-wrapper s-after-products-list" />

      {showTestimonials && TESTIMONIALS?.length > 0 && (
        <section className="s-block s-block--testimonials overflow-hidden">
          <TestimonialsSlider
            title={HEADER_UI.testimonialsTitle ?? t("testimonialsTitle")}
            items={TESTIMONIALS}
          />
        </section>
      )}

      {showTestimonials && <div className="s-blocks-wrapper s-after-testimonials" />}
    </div>
  );
}
