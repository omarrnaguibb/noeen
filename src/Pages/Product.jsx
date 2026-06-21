import { Navigate, useParams } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa6";
import StoreLayout from "../components/layout/StoreLayout";
import StarRating from "../components/home/StarRating";
import PriceAmount from "../components/PriceAmount";
import { useCart } from "../context/CartContext";
import { useHomepageContent, useTranslation } from "../context/LanguageContext";
import { findProductByUrl, RESERVED_SLUGS } from "../utils/catalog";

export default function Product() {
  const { productSlug } = useParams();
  const { ALL_PRODUCTS, CATALOG_PRODUCTS_BY_ID } = useHomepageContent();
  const { addToCart } = useCart();
  const { t } = useTranslation();

  if (!productSlug || RESERVED_SLUGS.has(productSlug)) {
    return <Navigate to="/" replace />;
  }

  const product = findProductByUrl(ALL_PRODUCTS, `/${productSlug}`, CATALOG_PRODUCTS_BY_ID);
  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.name,
      badge: product.badge,
      rating: product.rating,
      url: product.url,
    });
  };

  return (
    <StoreLayout>
      <div className="bg-gray-50 pb-12">
        <div className="page-container mx-auto max-w-[1200px] px-3 py-8 sm:px-5">
          <div className="grid gap-8 rounded-md bg-white p-5 sm:grid-cols-2 sm:p-8">
            <div className="flex items-center justify-center rounded-lg bg-gray-50 p-4">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-80 w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="mb-4 text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="mb-4">
                <StarRating value={product.rating ?? 5} />
              </div>
              <PriceAmount
                amount={product.price}
                className="mb-6 inline-flex items-center gap-1.5 text-2xl font-bold text-primary"
                iconClassName="h-5 w-5"
              />
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-dark sm:w-auto"
              >
                <FaCartPlus />
                {t("addToCart")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
