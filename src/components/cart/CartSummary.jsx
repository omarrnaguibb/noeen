import { useState } from "react";
import PriceAmount from "../PriceAmount";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "../../context/LanguageContext";

export default function CartSummary({ onSubmit }) {
  const { items, totalPrice } = useCart();
  const { t } = useTranslation();
  const [coupon, setCoupon] = useState("");

  const subtotal = totalPrice;

  return (
    <div className="cart-summary-sidebar w-full lg:sticky lg:top-24 lg:w-96 ltr:lg:ml-8 rtl:lg:mr-8">
      <div className="relative mb-5 rounded border border-gray-200 bg-white p-5 transition-all duration-1000 sm:p-7">
        <h4 className="mb-5 text-sm font-bold text-gray-900">
          {t("cartPage.orderSummary")}
        </h4>

        <div className="mb-5 flex justify-between text-sm">
          <span className="text-gray-400">
            {t("cartPage.productsSubtotal")}
          </span>
          <b id="sub-total">
            <PriceAmount amount={subtotal} />
          </b>
        </div>

        <div className="s-cart-coupons-wrapper mb-5">
          <div className="s-cart-coupons-input-section">
            <label
              htmlFor="coupon-input"
              className="s-cart-coupons-coupon-label"
            >
              {t("cartPage.couponLabel")}
            </label>
            <div className="s-cart-coupons-coupon-input-container">
              <input
                id="coupon-input"
                type="text"
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                className="form-input"
                placeholder={t("cartPage.couponPlaceholder")}
                name="coupon"
                aria-label={t("cartPage.couponPlaceholder")}
              />
              <button
                type="button"
                className="s-button-element s-button-btn s-button-solid border-primary! border text-primary! s-button-loader-center"
              >
                <span className="rounded-l">
                  <span>{t("cartPage.applyCoupon")}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-5 flex justify-between text-sm">
          <span className="text-gray-400">{t("total")}</span>
          <b data-cart-total="">
            <PriceAmount amount={subtotal} />
          </b>
        </div>

        <div className="cart-submit-wrap">
          <button
            type="button"
            onClick={onSubmit}
            disabled={items.length === 0}
            className="s-button-element s-button-btn s-button-solid s-button-wide border-primary! border text-primary!  s-button-loader-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="s-button-text">{t("cartPage.completeOrder")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
