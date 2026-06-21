import AppLink from "../AppLink";
import PriceAmount from "../PriceAmount";
import { FaXmark } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "../../context/LanguageContext";
import QuantityInput from "./QuantityInput";
import CartItemAttachments from "./CartItemAttachments";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { t } = useTranslation();
  const lineTotal = item.price * item.quantity;

  return (
    <form id={`item-${item.id}`}>
      <section className="cart-item relative mb-5 rounded-md bg-white pt-3 px-1">
        <input type="hidden" name="id" value={item.id} />

        <div>
          <div className="mb-8 items-start justify-between last:mb-0 xl:flex xl:space-x-8 rtl:space-x-reverse">
            <div className="flex flex-1 space-x-2">
              <AppLink href={item.url} className="relative shrink-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className=" w-24 flex-none rounded border border-gray-200 bg-gray-100 object-cover object-center"
                />
                <div className="free-ribbon absolute top-[11px] right-[-38px] hidden w-32 rotate-45 bg-primary py-1 text-center text-xs font-bold text-white shadow-md">
                  منتج مجاني
                </div>
              </AppLink>

              <div className="space-y-1">
                <h3 className="leading-6 text-gray-900">
                  <AppLink href={item.url} className="text-base font-bold">
                    {item.name}
                  </AppLink>
                </h3>
                <span className="item-regular-price hidden text-sm text-gray-400 line-through">
                  <PriceAmount amount={item.price} />
                </span>
                <PriceAmount
                  amount={item.price}
                  className="item-price text-sm text-gray-400"
                />
                <span className="old-offers mx-1.5 flex items-center gap-1">
                  <span className="offer-icon hidden text-gray-500" />
                  <span className="offer-name hidden text-sm text-gray-500" />
                </span>
              </div>

              <div className="w-10 xl:hidden" />
            </div>

            <div className="mt-5 flex w-full flex-1 items-center justify-between border-b border-t border-gray-200 py-3 xl:mt-0 xl:w-auto xl:border-none xl:p-0 xl:items-start">
              <QuantityInput
                value={item.quantity}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                onChange={(qty) => updateQuantity(item.id, qty || 1)}
              />

              <p className="flex-none text-sm font-bold text-primary ltr:md:pr-12 rtl:md:pl-12">
                <span>{t("cartPage.lineTotal")}: </span>
                <PriceAmount amount={lineTotal} className="item-total inline-block" />
              </p>
            </div>
          </div>

          <CartItemAttachments itemId={item.id} />
        </div>

        <span className="absolute top-1.5 ltr:right-1.5 rtl:left-1.5 sm:top-5 ltr:sm:right-5 rtl:sm:left-5">
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="btn--delete s-button-element s-button-icon s-button-solid s-button-small s-button-danger s-button-loader-center bg-primary! p-1!"
            aria-label={t("remove")}
          >
            <span className="s-button-text">
              <FaXmark />
            </span>
          </button>
        </span>
      </section>
    </form>
  );
}
