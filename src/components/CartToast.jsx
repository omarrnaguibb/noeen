import { useEffect, useRef, useState } from "react";
import AppLink from "./AppLink";
import PriceAmount from "./PriceAmount";
import { Link } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../context/LanguageContext";

const CHECK_ICON =
  "https://cdn.assets.salla.network/themes/2038173539/1.199.0/images/check.svg";

function CartIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3.06164 14.4413L3.42688 12.2985C3.85856 9.76583 4.0744 8.49951 4.92914 7.74975C5.78389 7 7.01171 7 9.46734 7H14.5327C16.9883 7 18.2161 7 19.0709 7.74975C19.9256 8.49951 20.1414 9.76583 20.5731 12.2985L20.9384 14.4413C21.5357 17.946 21.8344 19.6983 20.9147 20.8491C19.995 22 18.2959 22 14.8979 22H9.1021C5.70406 22 4.00504 22 3.08533 20.8491C2.16562 19.6983 2.4643 17.946 3.06164 14.4413Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 9L7.71501 5.98983C7.87559 3.74176 9.7462 2 12 2C14.2538 2 16.1244 3.74176 16.285 5.98983L16.5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckoutIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M2 12C2 8.46252 2 6.69377 3.0528 5.5129C3.22119 5.32403 3.40678 5.14935 3.60746 4.99087C4.86213 4 6.74142 4 10.5 4H13.5C17.2586 4 19.1379 4 20.3925 4.99087C20.5932 5.14935 20.7788 5.32403 20.9472 5.5129C22 6.69377 22 8.46252 22 12C22 15.5375 22 17.3062 20.9472 18.4871C20.7788 18.676 20.5932 18.8506 20.3925 19.0091C19.1379 20 17.2586 20 13.5 20H10.5C6.74142 20 4.86213 20 3.60746 19.0091C3.40678 18.8506 3.22119 18.676 3.0528 18.4871C2 17.3062 2 15.5375 2 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16H11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 16L18 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ToastProgress({ paused, durationMs, variant = "primary" }) {
  return (
    <div className="h-1 overflow-hidden bg-gray-100">
      <div
        className={`h-full ${variant === "warning" ? "bg-red-400" : "bg-primary"} ${
          paused ? "cart-toast-progress-paused" : "cart-toast-progress"
        }`}
        style={{ animationDuration: `${durationMs}ms` }}
      />
    </div>
  );
}

function DuplicateToast({ onClose, paused, onPause, onResume, durationMs }) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed bottom-4 z-60 w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl ltr:right-4 rtl:left-4"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
    >
      <ToastProgress paused={paused} durationMs={durationMs} variant="warning" />
      <div className="flex items-start justify-between gap-3 px-4 py-4">
        <h2 className="flex-1 text-base font-bold text-gray-900">
          {t("cartToast.duplicateTitle")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label={t("close")}
        >
          <FaXmark />
        </button>
      </div>
    </div>
  );
}

function AddedToast({ product, onClose, paused, onPause, onResume, durationMs }) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed bottom-4 z-60 w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl ltr:right-4 rtl:left-4"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
    >
      <ToastProgress paused={paused} durationMs={durationMs} />

      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <img src={CHECK_ICON} alt="" width={16} height={16} className="shrink-0" />
          <span className="text-sm font-bold text-gray-900">{t("cartToast.addedTitle")}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label={t("close")}
        >
          <FaXmark />
        </button>
      </div>

      <div className="mx-4 border-t border-gray-100" />

      <div className="flex items-center gap-3 px-4 py-3">
        <AppLink href={product.url} className="shrink-0 overflow-hidden rounded-lg bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="h-16 w-16 object-contain p-1"
            loading="lazy"
          />
        </AppLink>
        <div className="min-w-0 flex-1">
          <AppLink
            href={product.url}
            className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-primary"
          >
            {product.name}
          </AppLink>
        </div>
        <div className="shrink-0 text-sm font-bold text-gray-900">
          <PriceAmount amount={product.price} />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 sm:flex-row">
        <Link
          to="/checkout"
          onClick={onClose}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          <span>{t("cartToast.completeOrder")}</span>
          <CheckoutIcon />
        </Link>
        <Link
          to="/checkout"
          onClick={onClose}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-primary hover:text-primary"
        >
          <span>{t("cartToast.viewCart")}</span>
          <CartIcon />
        </Link>
      </div>
    </div>
  );
}

export default function CartToast() {
  const { toast, dismissToast, toastDurationMs } = useCart();
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const remainingRef = useRef(toastDurationMs);
  const startedAtRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleDismiss = (delay) => {
    clearTimer();
    startedAtRef.current = Date.now();
    remainingRef.current = delay;
    timerRef.current = setTimeout(dismissToast, delay);
  };

  const handlePause = () => {
    if (paused) return;
    setPaused(true);
    const elapsed = Date.now() - startedAtRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    clearTimer();
  };

  const handleResume = () => {
    if (!paused) return;
    setPaused(false);
    scheduleDismiss(remainingRef.current);
  };

  useEffect(() => {
    if (!toast) return undefined;

    setPaused(false);
    scheduleDismiss(toastDurationMs);

    return clearTimer;
  }, [toast, dismissToast, toastDurationMs]);

  if (!toast) return null;

  if (toast.type === "duplicate") {
    return (
      <DuplicateToast
        onClose={dismissToast}
        paused={paused}
        onPause={handlePause}
        onResume={handleResume}
        durationMs={toastDurationMs}
      />
    );
  }

  return (
    <AddedToast
      product={toast.product}
      onClose={dismissToast}
      paused={paused}
      onPause={handlePause}
      onResume={handleResume}
      durationMs={toastDurationMs}
    />
  );
}
