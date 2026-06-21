import PriceAmount from "../PriceAmount";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "../../context/LanguageContext";

export default function CartDrawer({ open, onClose }) {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { t } = useTranslation();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition duration-300 ltr:right-0 rtl:left-0 ${
          open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            {t("cart.label")} ({totalItems})
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <FaXmark />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">{t("emptyCart")}</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-xl border border-gray-100 p-3">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-contain" />
                  <div className="flex-1">
                    <p className="line-clamp-2 text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="mt-1 text-sm font-bold text-primary">
                      <PriceAmount amount={item.price} />
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded border border-gray-200 p-1"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded border border-gray-200 p-1"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="ms-auto text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">{t("total")}</span>
            <span className="text-lg font-bold text-primary">
              <PriceAmount amount={totalPrice} />
            </span>
          </div>
          <Link
            to="/checkout"
            onClick={onClose}
            className="mb-2 block rounded-xl bg-primary py-3 text-center text-sm font-bold text-white hover:bg-primary-dark"
          >
            {t("checkout")}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700"
          >
            {t("continueShopping")}
          </button>
        </div>
      </aside>
    </>
  );
}
