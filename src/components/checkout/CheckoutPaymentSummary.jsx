import { createPortal } from "react-dom";
import AppLink from "../AppLink";
import {
  useHomepageContent,
  useTranslation,
} from "../../context/LanguageContext";

function SallaCurrency({
  amount,
  className = "currency",
  iconSmallClassName = "",
}) {
  return (
    <span className={className}>
      <b>{amount}</b>{" "}
      <small className={iconSmallClassName || undefined}>
        <i className="sicon-sar" aria-hidden />
      </small>
    </span>
  );
}

function formatDrawerItemPrice(amount) {
  return Number(amount).toFixed(2);
}

function formatDrawerTotal(amount) {
  const value = Number(amount);
  return Number.isInteger(value) ? value : value.toFixed(2);
}

function CartDrawerItems({ items }) {
  return items.map((item) => (
    <div key={item.id} className="flex w-full justify-between items-center">
      <div className="cart-item__image relative">
        <img src={item.image} alt={item.name} className="w-12 h-12" />
        <div className="cart-item__quantity-badge bg-white rounded-full p-2 absolute -top-4 -right-1">
          {item.quantity}
        </div>
      </div>
      <div className="cart-item__details">
        <div className="cart-item__info">
          <h4 className="cart-item__name font-bold">{item.name}</h4>
          <div className="cart-item__meta">
            <span className="cart-item__specs" />
          </div>
        </div>
      </div>
      <div className="cart-item__bottom">
        <div className="cart-item__price flex items-center gap-2">
          {formatDrawerItemPrice(item.price * item.quantity)}
          <small className="cart-item__currency">
            <i className="sicon-sar" aria-hidden />
          </small>
        </div>
      </div>
    </div>
  ));
}

function CartDrawerFooter({ total }) {
  const { t } = useTranslation();
  const displayTotal = formatDrawerTotal(total);

  return (
    <div className="cart-drawer__footer">
      <div className="cart-summary-wrapper">
        <div className="cart-summary--drawer">
          <ul className="cart-summary" style={{ display: "block" }}>
            <li>
              <h4>{t("cartPage.orderSummary")}</h4>
              <SallaCurrency amount={displayTotal} className="rtl currency" />
            </li>
          </ul>
          <ul className="cart-summary cart-summary--total">
            <li>
              <div className="total-title-wrapper">
                <b>{t("checkoutPhone.orderTotal")}</b>
              </div>
              <div className="total-amount-wrapper">
                <SallaCurrency amount={displayTotal} iconSmallClassName="rtl" />
                <div className="cashback-message-lable-wrapper" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CancelIcon() {
  return <i className="sicon-cancel" aria-hidden />;
}

function OrderDetailsOverlays({ open, items, total, onClose, t }) {
  if (!open) return null;

  const overlay = (
    <>
      <div
        className="cart-drawer-wrapper reveal hidden lg:block"
        onClick={onClose}
        role="presentation"
      >
        <div
          className="cart-drawer-cont"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="cart-drawer__header">
            <h3 className="cart-drawer__title">
              {t("checkoutPhone.orderDetails")}
            </h3>
            <button
              type="button"
              className="cart-drawer__close"
              aria-label={t("close")}
              onClick={onClose}
            >
              <CancelIcon />
            </button>
          </div>
          <div className="cart-drawer__content">
            <div className="cart-drawer__items">
              <div className="cart-drawer__scroll-content">
                <CartDrawerItems items={items} />
              </div>
            </div>
          </div>
          <CartDrawerFooter total={total} />
        </div>
      </div>

      <div className="bottom-sheet-wrapper reveal lg:hidden">
        <button
          type="button"
          className="bottom-sheet-wrapper__overlay"
          aria-label={t("close")}
          onClick={onClose}
        />
        <div className="bottom-sheet-cont">
          <div className="bottom-sheet__drag-bar" />
          <div className="bottom-sheet__header">
            <h3 className="bottom-sheet__title">
              {t("checkoutPhone.orderDetails")}
            </h3>
            <button
              type="button"
              className="bottom-sheet__close"
              aria-label={t("close")}
              onClick={onClose}
            >
              <CancelIcon />
            </button>
          </div>
          <div className="bottom-sheet__content">
            <div className="bottom-sheet__items">
              <div className="bottom-sheet__scroll-content">
                <CartDrawerItems items={items} />
              </div>
            </div>
          </div>
          <div className="bottom-sheet__footer">
            <div className="cart-summary-wrapper">
              <div className="cart-summary--bottom-sheet">
                <ul className="cart-summary" style={{ display: "block" }}>
                  <li>
                    <h4>{t("cartPage.orderSummary")}</h4>
                    <SallaCurrency
                      amount={formatDrawerTotal(total)}
                      className="rtl currency"
                    />
                  </li>
                </ul>
                <ul className="cart-summary cart-summary--total">
                  <li>
                    <div className="total-title-wrapper">
                      <b>{t("checkoutPhone.orderTotal")}</b>
                    </div>
                    <div className="total-amount-wrapper">
                      <SallaCurrency
                        amount={formatDrawerTotal(total)}
                        iconSmallClassName="rtl"
                      />
                      <div className="cashback-message-lable-wrapper" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(overlay, document.body);
}

export default function CheckoutPaymentSummary({
  items,
  total,
  detailsOpen,
  couponOpen,
  coupon,
  onToggleDetails,
  onToggleCoupon,
  onCouponChange,
}) {
  const { t } = useTranslation();
  const { STORE } = useHomepageContent();

  return (
    <div id="cart_summary_desktop">
      <div className="cart-summary-wrapper">
        <OrderDetailsOverlays
          open={detailsOpen}
          items={items}
          total={total}
          onClose={onToggleDetails}
          t={t}
        />

        <div className="cart-summary-main flex flex-1 p-2">
          <img
            src={STORE.logo}
            alt=""
            className="store-logo-summary is-loaded w-8 p-2  rounded-full bg-gray-100"
          />

          <div className="cart-summary-content flex-1">
            <div className="cart-summary--top">
              <ul className="cart-summary" style={{ display: "none" }}>
                <li>
                  <h4>{t("cartPage.orderSummary")}</h4>
                  <SallaCurrency amount={total} className="rtl currency" />
                </li>
              </ul>
              <ul className="cart-summary cart-summary--total">
                <li>
                  <div className="total-title-wrapper">
                    <b>{t("checkoutPhone.orderTotal")}</b>
                  </div>
                  <div className="total-amount-wrapper">
                    <SallaCurrency amount={total} iconSmallClassName="rtl" />
                    <div className="cashback-message-lable-wrapper" />
                  </div>
                </li>
              </ul>
            </div>

            <ul className="cart-summary cart-summary--bottom ">
              <li className="column no-border p-0 w-full">
                <div className="coupon-wrapper cashback-coupon-toggle-wrapper flex items-center justify-between w-full">
                  <div className="cart-items-preview">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="cart-items-row rounded-full w-10 h-10 p-2"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn--link btn--coupon text-red-500!  underline"
                    onClick={onToggleCoupon}
                  >
                    {t("checkoutPhone.haveCoupon")}
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="coupon-full-width">
          <div
            className={`coupon-section ${couponOpen ? "" : "coupon-section--closed"}`}
          >
            <div className="coupon-wrapper w-100">
              <form
                name="coupon_form"
                action="#"
                className="form form--payment form--coupon"
                onSubmit={(event) => event.preventDefault()}
              >
                <fieldset className="form-group">
                  {coupon ? (
                    <button
                      type="button"
                      className="clear-input"
                      aria-label={t("close")}
                      onClick={() => onCouponChange("")}
                    >
                      <CancelIcon />
                    </button>
                  ) : null}
                  <input
                    id="coupon_field"
                    type="text"
                    value={coupon}
                    onChange={(event) => onCouponChange(event.target.value)}
                    placeholder={t("checkoutPhone.couponPlaceholder")}
                    className="form-control"
                  />
                  <button
                    id="coupon_form_submit"
                    type="button"
                    className="btn btn--primary"
                  >
                    <span>{t("cartPage.applyCoupon")}</span>
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>

        <div className="cart-summary--bg ">
          <div className="cart-summary--toggle">
            <button
              type="button"
              className="  bg-white btn border p-2 rounded-full!   border-gray-500"
              onClick={onToggleDetails}
            >
              {t("checkoutPhone.orderDetails")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginStepIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      color="currentColor"
      fill="none"
      aria-hidden
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
          stroke="black"
          strokeWidth="1.5"
        />
      </svg>
    </svg>
  );
}

export function PaymentStepIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      color="currentColor"
      fill="none"
      aria-hidden
    >
      <path
        d="M14.4998 12.001C14.4998 13.3817 13.3805 14.501 11.9998 14.501C10.6191 14.501 9.49982 13.3817 9.49982 12.001C9.49982 10.6203 10.6191 9.50098 11.9998 9.50098C13.3805 9.50098 14.4998 10.6203 14.4998 12.001Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 5.00098C18.4794 5.00098 20.1903 5.38518 21.1329 5.6773C21.6756 5.84549 22 6.35987 22 6.92803V16.6833C22 17.7984 20.7719 18.6374 19.6762 18.4305C18.7361 18.253 17.5107 18.1104 16 18.1104C11.2491 18.1104 10.1096 19.9161 3.1448 18.3802C2.47265 18.232 2 17.6275 2 16.9392V6.92214C2 5.94628 2.92079 5.23464 3.87798 5.42458C10.1967 6.67844 11.4209 5.00098 16 5.00098Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 9.00098C3.95133 9.00098 5.70483 7.40605 5.92901 5.75514M18.5005 5.50098C18.5005 7.54062 20.2655 9.46997 22 9.46997M22 15.001C20.1009 15.001 18.2601 16.3112 18.102 18.0993M6.00049 18.4971C6.00049 16.2879 4.20963 14.4971 2.00049 14.4971"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
