import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import AppLink from "../AppLink";
import { useTranslation } from "../../context/LanguageContext";
import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider({ slides }) {
  const { dir } = useTranslation();

  if (!slides?.length) return null;

  return (
    <section className="store-container py-4 md:py-6">
      <Swiper
        dir={dir}
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={slides.length > 1}
        className="overflow-hidden rounded-xl"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={`${slide.image}-${index}`}>
            {slide.href ? (
              <AppLink href={slide.href} className="block">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="mx-auto max-h-[420px] w-full object-contain"
                />
              </AppLink>
            ) : (
              <img
                src={slide.image}
                alt={slide.alt}
                className="mx-auto max-h-[420px] w-full object-contain"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
