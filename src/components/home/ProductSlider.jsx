import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import AppLink from "../AppLink";
import { useTranslation } from "../../context/LanguageContext";
import ProductCard from "./ProductCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductSlider({
  id,
  title,
  viewAllHref,
  viewAllLabel,
  products,
}) {
  const { dir, t } = useTranslation();
  const prevClass = `product-prev-${id}`;
  const nextClass = `product-next-${id}`;

  return (
    <section className="store-container py-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-gray-900 md:text-2xl">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {viewAllHref && (
            <AppLink
              href={viewAllHref}
              className="text-sm font-medium text-primary hover:underline"
            >
              {viewAllLabel || t("viewAll")}
            </AppLink>
          )}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className={`${prevClass} flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary`}
              aria-label="Previous"
            >
              <FaChevronRight className={dir === "ltr" ? "rotate-180" : ""} />
            </button>
            <button
              type="button"
              className={`${nextClass} flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary`}
              aria-label="Next"
            >
              <FaChevronLeft className={dir === "ltr" ? "rotate-180" : ""} />
            </button>
          </div>
        </div>
      </div>

      <Swiper
        dir={dir}
        className="product-slider"
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1.15}
        navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 4 },
          1536: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
