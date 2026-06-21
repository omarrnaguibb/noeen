import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import AppLink from "../AppLink";
import { useTranslation } from "../../context/LanguageContext";
import StarRating from "./StarRating";
import "swiper/css";
import "swiper/css/navigation";

export default function TestimonialsSlider({ title, viewAllHref, viewAllLabel, items }) {
  const { dir, t } = useTranslation();

  if (!items?.length) return null;

  return (
    <section className="store-container py-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-gray-900 md:text-2xl">{title}</h2>
        {viewAllHref && (
          <AppLink href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
            {viewAllLabel || t("viewAll")}
          </AppLink>
        )}
      </div>

      <Swiper
        dir={dir}
        modules={[]}
        spaceBetween={16}
        slidesPerView={1.1}
        navigation
        breakpoints={{
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.name}>
            <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <StarRating value={item.rating} />
                </div>
              </div>
              {item.quote && (
                <p className="text-sm leading-7 text-gray-600">{item.quote}</p>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
