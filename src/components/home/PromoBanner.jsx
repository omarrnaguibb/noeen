import AppLink from "../AppLink";

export default function PromoBanner({ image, alt, href }) {
  const content = (
    <img
      src={image}
      alt={alt}
      className="w-full rounded-xl object-cover"
    />
  );

  return (
    <section className="store-container py-4">
      {href ? (
        <AppLink href={href} className="block">
          {content}
        </AppLink>
      ) : (
        content
      )}
    </section>
  );
}
