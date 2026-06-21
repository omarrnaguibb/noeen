import { FaCartPlus } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import PriceAmount from "./PriceAmount";

export default function ServiceCard({ service }) {
  const { addToCart } = useCart();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={service.image}
          alt={service.name}
          className="h-full w-full object-contain p-6 transition duration-300 group-hover:scale-105"
        />
        {service.badge && (
          <span className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
            {service.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 min-h-[3rem] text-base font-bold text-gray-900">
          {service.name}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-6 text-gray-500">
          {service.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <PriceAmount
            amount={service.price}
            className="inline-flex items-center gap-1 text-lg font-bold text-primary"
          />
          <button
            type="button"
            onClick={() => addToCart(service)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            <FaCartPlus />
            <span>إضافة للسلة</span>
          </button>
        </div>
      </div>
    </article>
  );
}
