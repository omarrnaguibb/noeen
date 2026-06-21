import AppLink from "../AppLink";
import PriceAmount from "../PriceAmount";
import { FaCartPlus } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "../../context/LanguageContext";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t } = useTranslation();

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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <AppLink href={product.url} className="relative block aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-2 start-2 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white">
            {product.badge}
          </span>
        )}
      </AppLink>

      <div className="flex flex-1 flex-col p-3">
        <AppLink
          href={product.url}
          className="mb-2 line-clamp-2 min-h-[2.75rem] text-sm font-bold text-gray-900 hover:text-primary"
        >
          {product.name}
        </AppLink>

        <div className="mb-3">
          <StarRating value={product.rating ?? 5} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <PriceAmount
            amount={product.price}
            className="inline-flex items-center gap-1 text-base font-bold text-primary"
            iconClassName="h-3.5 w-3.5 opacity-70"
          />
          <button
            type="button"
            onClick={() => addToCart(cartItem)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary-dark"
          >
            <FaCartPlus />
            <span>{t("addToCart")}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
