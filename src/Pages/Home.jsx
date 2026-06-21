import StoreLayout from "../components/layout/StoreLayout";
import HeroSlider from "../components/home/HeroSlider";
import ProductSlider from "../components/home/ProductSlider";
import PromoBanner from "../components/home/PromoBanner";
import TestimonialsSlider from "../components/home/TestimonialsSlider";
import { ProcessSteps, TrustFeatures } from "../components/home/TrustFeatures";
import { useHomepageContent } from "../context/LanguageContext";

function renderSection(section) {
  switch (section.type) {
    case "hero":
      return <HeroSlider key="hero" slides={section.slides} />;
    case "products":
      return (
        <ProductSlider
          key={section.id}
          id={section.id}
          title={section.title}
          viewAllHref={section.viewAllHref}
          viewAllLabel={section.viewAllLabel}
          products={section.products}
        />
      );
    case "banner":
      return (
        <PromoBanner
          key={section.image}
          image={section.image}
          alt={section.alt}
          href={section.href}
        />
      );
    case "testimonials":
      return (
        <TestimonialsSlider
          key={`testimonials-${section.title}`}
          title={section.title}
          viewAllHref={section.viewAllHref}
          viewAllLabel={section.viewAllLabel}
          items={section.items}
        />
      );
    case "trust-features":
      return <TrustFeatures key="trust" items={section.items} />;
    case "process-steps":
      return <ProcessSteps key="process" items={section.items} />;
    default:
      return null;
  }
}

export default function Home() {
  const { HOME_SECTIONS } = useHomepageContent();

  return (
    <StoreLayout>
      {HOME_SECTIONS.map((section, index) => (
        <div key={`${section.type}-${index}`}>{renderSection(section)}</div>
      ))}
    </StoreLayout>
  );
}
