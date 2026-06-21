import AppLink from "../AppLink";
import PriceAmount from "../PriceAmount";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "../../context/LanguageContext";

export default function CatalogProductCard({ product }) {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const isOutOfStock = product.status === "out";
  const hasRating = product.rating != null;

  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.name,
    badge: product.badge,
    rating: product.rating,
    url: product.url,
  };

  return (
    <article
      className={`s-product-card-entry s-product-card-vertical s-product-card-fit-height${isOutOfStock ? " s-product-card-out-of-stock" : ""}`}
      id={product.id}
    >
      <div className="s-product-card-image">
        <AppLink href={product.url}>
          <img
            className="s-product-card-image-contain"
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
          {product.badge && <div className="s-product-card-promotion-title">{product.badge}</div>}
        </AppLink>

        <button
          type="button"
          className="s-product-card-wishlist-btn s-button-element s-button-icon s-button-outline s-button-light-outline"
          aria-label="Add or remove to wishlist"
        >
          <span className="s-button-text">♡</span>
        </button>
      </div>

      <div className="s-product-card-content">
        <div className="s-product-card-content-main">
          <h3 className="s-product-card-content-title">
            <AppLink href={product.url}>{product.name}</AppLink>
          </h3>
        </div>

        <div className="s-product-card-content-sub">
          <h4 className="s-product-card-price">
            {product.price == null ? (
              "-"
            ) : (
              <PriceAmount amount={product.price} className="inline-flex items-center gap-1" />
            )}
          </h4>
          {hasRating && (
            <div className="s-product-card-rating">
              <span className="text-orange-300">★</span>
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        <div className="s-product-card-content-footer gap-2">
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="s-button-element s-button-btn s-button-outline s-button-wide s-button-light-outline s-button-disabled w-full"
            >
              <span className="s-button-text">{t("catalogPage.outOfStock")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(cartItem)}
              className="s-button-element s-button-btn s-button-outline s-button-wide s-button-primary-outline w-full"
            >
              <span className="s-button-text">
                <span className="rtl:ml-1.5 ltr:mr-1.5">+</span>
                <span>{t("addToCart")}</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
